import {
  Organisation,
  OrganisationSettings,
  HomePageContent,
  AboutPageContent,
  Course,
  FacultyMember,
  GalleryImage,
  Announcement,
  Enquiry,
} from '@/types';
import {
  brightAcademyData,
  excellenceTutorialsData,
  sampleOrganisationsMap,
  CompleteOrganisationData,
} from '@/data/sampleOrganisations';
import { adminDb } from '@/lib/firebase/admin';

/**
 * Resolves an organisation by its URL slug (e.g., 'bright' or 'excellence')
 * or fallback by ID ('tuition-001', 'tuition-002').
 */
export async function getOrganisationBySlug(slug: string): Promise<Organisation | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Try server-side admin Firestore if available
  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection('organisations')
        .where('slug', '==', normalizedSlug)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data() as Omit<Organisation, 'id'>;
        const fallback = sampleOrganisationsMap[normalizedSlug];
        return {
          ...(fallback?.organisation || {}),
          id: docSnap.id,
          ...data,
          theme: {
            ...(fallback?.organisation?.theme || {}),
            ...(data.theme || {}),
          },
          contact: {
            ...(fallback?.organisation?.contact || {}),
            ...(data.contact || {}),
          },
        } as Organisation;
      }
    } catch (err) {
      console.warn('Server firestore lookup error (falling back to sample data):', err);
    }
  }

  // 2. In-memory resilient fallback
  const fallback = sampleOrganisationsMap[normalizedSlug];
  return fallback ? fallback.organisation : null;
}

/**
 * Retrieves the complete set of organisation data:
 * metadata, settings, home/about pages, courses, teachers, gallery, announcements.
 */
export async function getCompleteOrganisationData(slugOrId: string): Promise<CompleteOrganisationData> {
  const normalized = slugOrId.toLowerCase().trim();
  const sample = sampleOrganisationsMap[normalized] || brightAcademyData;

  const orgId = sample.organisation.id;

  // If server adminDb is available, query Firestore subcollections
  if (adminDb) {
    try {
      const orgRef = adminDb.collection('organisations').doc(orgId);
      const orgDoc = await orgRef.get();

      if (orgDoc.exists) {
        const orgData = { id: orgDoc.id, ...(orgDoc.data() as Omit<Organisation, 'id'>) };

        // Fetch subcollections in parallel
        const [
          settingsDoc,
          homeDoc,
          aboutDoc,
          coursesSnap,
          teachersSnap,
          gallerySnap,
          announcementsSnap,
        ] = await Promise.all([
          orgRef.collection('settings').doc('general').get(),
          orgRef.collection('pages').doc('home').get(),
          orgRef.collection('pages').doc('about').get(),
          orgRef.collection('courses').get(),
          orgRef.collection('teachers').get(),
          orgRef.collection('gallery').get(),
          orgRef.collection('announcements').where('isActive', '==', true).get(),
        ]);

        return {
          organisation: {
            ...sample.organisation,
            ...orgData,
            theme: {
              ...sample.organisation.theme,
              ...(orgData.theme || {}),
            },
            contact: {
              ...sample.organisation.contact,
              ...(orgData.contact || {}),
            },
          },
          settings: settingsDoc.exists
            ? { ...sample.settings, ...(settingsDoc.data() as OrganisationSettings) }
            : sample.settings,
          homePage: homeDoc.exists
            ? { ...sample.homePage, ...(homeDoc.data() as HomePageContent) }
            : sample.homePage,
          aboutPage: aboutDoc.exists
            ? { ...sample.aboutPage, ...(aboutDoc.data() as AboutPageContent) }
            : sample.aboutPage,
          courses: coursesSnap.empty
            ? sample.courses
            : coursesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) })),
          teachers: teachersSnap.empty
            ? sample.teachers
            : teachersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyMember, 'id'>) })),
          gallery: gallerySnap.empty
            ? sample.gallery
            : gallerySnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryImage, 'id'>) })),
          announcements: announcementsSnap.empty
            ? sample.announcements
            : announcementsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) })),
          results: sample.results,
          testimonials: sample.testimonials,
          faqs: sample.faqs,
        };
      }
    } catch (error) {
      console.warn('Error fetching organisation subcollections from Firestore, using seed fallback:', error);
    }
  }

  // Return complete in-memory fallback
  return sample;
}

/**
 * Returns all available organisations for the platform selector or root directory.
 */
export async function getAllOrganisations(): Promise<Organisation[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('organisations').where('status', '==', 'active').get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Organisation, 'id'>) }));
      }
    } catch (err) {
      console.warn('Firestore getAllOrganisations error:', err);
    }
  }

  return [brightAcademyData.organisation, excellenceTutorialsData.organisation];
}

/**
 * Submits an enquiry (admission or contact) into organisations/{orgId}/enquiries
 */
export async function saveEnquiry(
  organisationId: string,
  enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'organisationId'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // 1. Try server Admin Firestore
    if (adminDb) {
      const docRef = await adminDb
        .collection('organisations')
        .doc(organisationId)
        .collection('enquiries')
        .add({
          ...enquiryData,
          organisationId,
          status: 'new',
          createdAt: new Date().toISOString(),
        });
      return { success: true, id: docRef.id };
    }

    // 2. Fallback demo mode simulation
    return { success: true, id: 'demo-' + Date.now() };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database write error';
    console.error('Failed to save enquiry to Firestore:', error);
    return { success: false, error: errorMsg };
  }
}
