import { adminDb } from '@/lib/firebase/admin';
import {
  Course,
  FacultyMember,
  GalleryImage,
  Announcement,
  Enquiry,
  OrganisationSettings,
  Organisation,
  HomePageContent,
  AboutPageContent,
} from '@/types';

/**
 * Courses CRUD
 */
export async function listOrgCourses(orgId: string): Promise<Course[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('courses')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) }));
  } catch (err) {
    console.error(`Error listing courses for ${orgId}:`, err);
    return [];
  }
}

export async function createOrgCourse(
  orgId: string,
  course: Omit<Course, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    const docRef = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('courses')
      .add({
        ...course,
        organisationId: orgId,
        createdAt: new Date().toISOString(),
      });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function updateOrgCourse(
  orgId: string,
  courseId: string,
  data: Partial<Course>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('courses')
      .doc(courseId)
      .set(data, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function deleteOrgCourse(
  orgId: string,
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('courses')
      .doc(courseId)
      .delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Teachers / Faculty CRUD
 */
export async function listOrgTeachers(orgId: string): Promise<FacultyMember[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('teachers')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyMember, 'id'>) }));
  } catch (err) {
    console.error(`Error listing teachers for ${orgId}:`, err);
    return [];
  }
}

export async function createOrgTeacher(
  orgId: string,
  teacher: Omit<FacultyMember, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    const docRef = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('teachers')
      .add({
        ...teacher,
        organisationId: orgId,
        createdAt: new Date().toISOString(),
      });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function updateOrgTeacher(
  orgId: string,
  teacherId: string,
  data: Partial<FacultyMember>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('teachers')
      .doc(teacherId)
      .set(data, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function deleteOrgTeacher(
  orgId: string,
  teacherId: string
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('teachers')
      .doc(teacherId)
      .delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Gallery CRUD
 */
export async function listOrgGallery(orgId: string): Promise<GalleryImage[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('gallery')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryImage, 'id'>) }));
  } catch (err) {
    console.error(`Error listing gallery for ${orgId}:`, err);
    return [];
  }
}

export async function createOrgGalleryImage(
  orgId: string,
  image: Omit<GalleryImage, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    const docRef = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('gallery')
      .add({
        ...image,
        organisationId: orgId,
        uploadedAt: new Date().toISOString(),
      });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function deleteOrgGalleryImage(
  orgId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('gallery')
      .doc(imageId)
      .delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Announcements CRUD
 */
export async function listOrgAnnouncements(orgId: string): Promise<Announcement[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('announcements')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
  } catch (err) {
    console.error(`Error listing announcements for ${orgId}:`, err);
    return [];
  }
}

export async function createOrgAnnouncement(
  orgId: string,
  data: Omit<Announcement, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    const docRef = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('announcements')
      .add({
        ...data,
        organisationId: orgId,
        createdAt: new Date().toISOString(),
      });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function updateOrgAnnouncement(
  orgId: string,
  announcementId: string,
  data: Partial<Announcement>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('announcements')
      .doc(announcementId)
      .set(data, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function deleteOrgAnnouncement(
  orgId: string,
  announcementId: string
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('announcements')
      .doc(announcementId)
      .delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Enquiries Management
 */
export async function listOrgEnquiries(orgId: string): Promise<Enquiry[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('enquiries')
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, 'id'>) }));
  } catch {
    // If order by index is pending, fallback to default get
    try {
      const snap = await adminDb
        .collection('organisations')
        .doc(orgId)
        .collection('enquiries')
        .get();
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, 'id'>) }));
    } catch {
      return [];
    }
  }
}

export async function updateOrgEnquiryStatus(
  orgId: string,
  enquiryId: string,
  status: Enquiry['status']
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('enquiries')
      .doc(enquiryId)
      .update({ status });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function deleteOrgEnquiry(
  orgId: string,
  enquiryId: string
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('enquiries')
      .doc(enquiryId)
      .delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Settings & Content Management
 */
export async function getOrgSettings(orgId: string): Promise<OrganisationSettings | null> {
  if (!adminDb) return null;
  try {
    const doc = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('settings')
      .doc('general')
      .get();
    return doc.exists ? (doc.data() as OrganisationSettings) : null;
  } catch {
    return null;
  }
}

export async function updateOrgSettings(
  orgId: string,
  settings: Partial<OrganisationSettings>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('settings')
      .doc('general')
      .set(settings, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function getOrgHomePageContent(orgId: string): Promise<HomePageContent | null> {
  if (!adminDb) return null;
  try {
    const doc = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('pages')
      .doc('home')
      .get();
    return doc.exists ? (doc.data() as HomePageContent) : null;
  } catch {
    return null;
  }
}

export async function updateOrgHomePageContent(
  orgId: string,
  content: Partial<HomePageContent>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('pages')
      .doc('home')
      .set(content, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function getOrgAboutPageContent(orgId: string): Promise<AboutPageContent | null> {
  if (!adminDb) return null;
  try {
    const doc = await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('pages')
      .doc('about')
      .get();
    return doc.exists ? (doc.data() as AboutPageContent) : null;
  } catch {
    return null;
  }
}

export async function updateOrgAboutPageContent(
  orgId: string,
  content: Partial<AboutPageContent>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb
      .collection('organisations')
      .doc(orgId)
      .collection('pages')
      .doc('about')
      .set(content, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Super Admin Organisation Management
 */
export async function listAllOrganisations(): Promise<Organisation[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb.collection('organisations').get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Organisation, 'id'>) }));
  } catch (err) {
    console.error('Error listing all organisations:', err);
    return [];
  }
}

export async function createOrganisation(
  data: Omit<Organisation, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    const orgId = data.slug ? `tuition-${data.slug}` : `tuition-${Date.now()}`;
    await adminDb.collection('organisations').doc(orgId).set({
      ...data,
      id: orgId,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: orgId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}

export async function updateOrganisationDetails(
  orgId: string,
  data: Partial<Organisation>
): Promise<{ success: boolean; error?: string }> {
  if (!adminDb) return { success: false, error: 'adminDb not initialized' };
  try {
    await adminDb.collection('organisations').doc(orgId).set(data, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Database error' };
  }
}
