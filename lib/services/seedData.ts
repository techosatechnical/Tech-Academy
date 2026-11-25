import { adminDb } from '@/lib/firebase/admin';
import {
  brightAcademyData,
  excellenceTutorialsData,
  CompleteOrganisationData,
} from '@/data/sampleOrganisations';

/**
 * Seeds a single complete organisation and all its subcollections into Firestore.
 */
async function seedSingleOrganisation(data: CompleteOrganisationData): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin Firestore is not initialized. Please verify your environment variables.');
  }

  const orgId = data.organisation.id;
  const orgRef = adminDb.collection('organisations').doc(orgId);

  // 1. Root Organisation Document
  await orgRef.set(data.organisation, { merge: true });

  // 2. Settings Subcollection (organisations/{orgId}/settings/general)
  await orgRef.collection('settings').doc('general').set(data.settings, { merge: true });

  // 3. Pages Subcollection (organisations/{orgId}/pages/home & about)
  await orgRef.collection('pages').doc('home').set(data.homePage, { merge: true });
  await orgRef.collection('pages').doc('about').set(data.aboutPage, { merge: true });

  // 4. Courses Subcollection
  const coursesBatch = adminDb.batch();
  for (const course of data.courses) {
    const courseDocRef = orgRef.collection('courses').doc(course.id);
    coursesBatch.set(courseDocRef, course, { merge: true });
  }
  await coursesBatch.commit();

  // 5. Teachers Subcollection
  const teachersBatch = adminDb.batch();
  for (const teacher of data.teachers) {
    const teacherDocRef = orgRef.collection('teachers').doc(teacher.id);
    teachersBatch.set(teacherDocRef, teacher, { merge: true });
  }
  await teachersBatch.commit();

  // 6. Gallery Subcollection
  const galleryBatch = adminDb.batch();
  for (const item of data.gallery) {
    const itemDocRef = orgRef.collection('gallery').doc(item.id);
    galleryBatch.set(itemDocRef, item, { merge: true });
  }
  await galleryBatch.commit();

  // 7. Announcements Subcollection
  const announceBatch = adminDb.batch();
  for (const announcement of data.announcements) {
    const announceDocRef = orgRef.collection('announcements').doc(announcement.id);
    announceBatch.set(announceDocRef, announcement, { merge: true });
  }
  await announceBatch.commit();
}

/**
 * Seeds both sample organisations (Bright Academy & Excellence Tutorials) into Firestore.
 */
export async function seedOrganisations(): Promise<{
  success: boolean;
  message: string;
  seededOrgs: string[];
}> {
  if (!adminDb) {
    return {
      success: false,
      message: 'Firebase Admin not configured. Unable to connect to Firestore.',
      seededOrgs: [],
    };
  }

  try {
    await seedSingleOrganisation(brightAcademyData);
    await seedSingleOrganisation(excellenceTutorialsData);

    return {
      success: true,
      message: 'Successfully seeded tuition-001 (Bright Academy) and tuition-002 (Excellence Tutorials) into Firestore.',
      seededOrgs: ['tuition-001', 'tuition-002'],
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to seed organisations';
    console.error('Seeding Firestore error:', error);
    return {
      success: false,
      message: errorMsg,
      seededOrgs: [],
    };
  }
}
