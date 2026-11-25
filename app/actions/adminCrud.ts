'use server';

import { getCurrentUserSessionAction } from '@/app/actions/auth';
import {
  listOrgCourses,
  createOrgCourse,
  updateOrgCourse,
  deleteOrgCourse,
  listOrgTeachers,
  createOrgTeacher,
  updateOrgTeacher,
  deleteOrgTeacher,
  listOrgGallery,
  createOrgGalleryImage,
  deleteOrgGalleryImage,
  listOrgAnnouncements,
  createOrgAnnouncement,
  updateOrgAnnouncement,
  deleteOrgAnnouncement,
  listOrgEnquiries,
  updateOrgEnquiryStatus,
  deleteOrgEnquiry,
  getOrgSettings,
  updateOrgSettings,
  getOrgHomePageContent,
  updateOrgHomePageContent,
  getOrgAboutPageContent,
  updateOrgAboutPageContent,
  listAllOrganisations,
  createOrganisation,
  updateOrganisationDetails,
} from '@/lib/services/adminCrudService';
import {
  Course,
  FacultyMember,
  GalleryImage,
  Announcement,
  Enquiry,
  OrganisationSettings,
  HomePageContent,
  AboutPageContent,
  Organisation,
} from '@/types';
import { revalidatePath } from 'next/cache';

/**
 * Helper to check organisation authorization
 */
async function authorizeOrgAccess(orgId: string, allowedRoles?: string[]) {
  const session = await getCurrentUserSessionAction();
  if (!session.isAuthenticated || !session.user) {
    throw new Error('Not authenticated. Please log in.');
  }

  const { user } = session;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error(`Role ${user.role} is not permitted to perform this action.`);
  }

  if (user.role === 'SUPER_ADMIN') {
    return { authorized: true, user };
  }

  if (user.organisationIds.includes(orgId)) {
    return { authorized: true, user };
  }

  throw new Error(`You do not have administrative access to organisation: ${orgId}`);
}

/**
 * Course Actions
 */
export async function getCoursesAction(orgId: string): Promise<Course[]> {
  await authorizeOrgAccess(orgId);
  return listOrgCourses(orgId);
}

export async function saveCourseAction(
  orgId: string,
  course: Omit<Course, 'id'>,
  courseId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    let res;
    if (courseId) {
      res = await updateOrgCourse(orgId, courseId, course);
    } else {
      res = await createOrgCourse(orgId, course);
    }
    revalidatePath('/[orgSlug]/courses', 'page');
    revalidatePath('/courses', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error saving course' };
  }
}

export async function deleteCourseAction(
  orgId: string,
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await deleteOrgCourse(orgId, courseId);
    revalidatePath('/[orgSlug]/courses', 'page');
    revalidatePath('/courses', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error deleting course' };
  }
}

/**
 * Teacher Actions
 */
export async function getTeachersAction(orgId: string): Promise<FacultyMember[]> {
  await authorizeOrgAccess(orgId);
  return listOrgTeachers(orgId);
}

export async function saveTeacherAction(
  orgId: string,
  teacher: Omit<FacultyMember, 'id'>,
  teacherId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    let res;
    if (teacherId) {
      res = await updateOrgTeacher(orgId, teacherId, teacher);
    } else {
      res = await createOrgTeacher(orgId, teacher);
    }
    revalidatePath('/[orgSlug]/faculty', 'page');
    revalidatePath('/faculty', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error saving teacher' };
  }
}

export async function deleteTeacherAction(
  orgId: string,
  teacherId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await deleteOrgTeacher(orgId, teacherId);
    revalidatePath('/[orgSlug]/faculty', 'page');
    revalidatePath('/faculty', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error deleting teacher' };
  }
}

/**
 * Gallery Actions
 */
export async function getGalleryAction(orgId: string): Promise<GalleryImage[]> {
  await authorizeOrgAccess(orgId);
  return listOrgGallery(orgId);
}

export async function saveGalleryImageAction(
  orgId: string,
  image: Omit<GalleryImage, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await createOrgGalleryImage(orgId, image);
    revalidatePath('/[orgSlug]/gallery', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error saving image' };
  }
}

export async function deleteGalleryImageAction(
  orgId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await deleteOrgGalleryImage(orgId, imageId);
    revalidatePath('/[orgSlug]/gallery', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error deleting image' };
  }
}

/**
 * Announcement Actions
 */
export async function getAnnouncementsAction(orgId: string): Promise<Announcement[]> {
  await authorizeOrgAccess(orgId);
  return listOrgAnnouncements(orgId);
}

export async function saveAnnouncementAction(
  orgId: string,
  data: Omit<Announcement, 'id'>,
  announcementId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    let res;
    if (announcementId) {
      res = await updateOrgAnnouncement(orgId, announcementId, data);
    } else {
      res = await createOrgAnnouncement(orgId, data);
    }
    revalidatePath('/[orgSlug]', 'layout');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error saving announcement' };
  }
}

export async function deleteAnnouncementAction(
  orgId: string,
  announcementId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await deleteOrgAnnouncement(orgId, announcementId);
    revalidatePath('/[orgSlug]', 'layout');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error deleting announcement' };
  }
}

/**
 * Enquiries Actions (Restricted: no EDITOR)
 */
export async function getEnquiriesAction(orgId: string): Promise<Enquiry[]> {
  await authorizeOrgAccess(orgId, ['SUPER_ADMIN', 'ORGANISATION_ADMIN']);
  return listOrgEnquiries(orgId);
}

export async function updateEnquiryStatusAction(
  orgId: string,
  enquiryId: string,
  status: Enquiry['status']
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId, ['SUPER_ADMIN', 'ORGANISATION_ADMIN']);
    return await updateOrgEnquiryStatus(orgId, enquiryId, status);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error updating status' };
  }
}

export async function deleteEnquiryAction(
  orgId: string,
  enquiryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId, ['SUPER_ADMIN', 'ORGANISATION_ADMIN']);
    return await deleteOrgEnquiry(orgId, enquiryId);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error deleting enquiry' };
  }
}

/**
 * Settings & Content Actions (Restricted: no EDITOR)
 */
export async function getSettingsAction(orgId: string): Promise<OrganisationSettings | null> {
  await authorizeOrgAccess(orgId, ['SUPER_ADMIN', 'ORGANISATION_ADMIN']);
  return getOrgSettings(orgId);
}

export async function saveSettingsAction(
  orgId: string,
  settings: Partial<OrganisationSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId, ['SUPER_ADMIN', 'ORGANISATION_ADMIN']);
    const res = await updateOrgSettings(orgId, settings);
    revalidatePath('/[orgSlug]', 'layout');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error saving settings' };
  }
}

export async function getHomePageContentAction(orgId: string): Promise<HomePageContent | null> {
  await authorizeOrgAccess(orgId);
  return getOrgHomePageContent(orgId);
}

export async function saveHomePageContentAction(
  orgId: string,
  content: Partial<HomePageContent>
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await updateOrgHomePageContent(orgId, content);
    revalidatePath('/[orgSlug]', 'page');
    revalidatePath('/', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error updating home page' };
  }
}

export async function getAboutPageContentAction(orgId: string): Promise<AboutPageContent | null> {
  await authorizeOrgAccess(orgId);
  return getOrgAboutPageContent(orgId);
}

export async function saveAboutPageContentAction(
  orgId: string,
  content: Partial<AboutPageContent>
): Promise<{ success: boolean; error?: string }> {
  try {
    await authorizeOrgAccess(orgId);
    const res = await updateOrgAboutPageContent(orgId, content);
    revalidatePath('/[orgSlug]/about', 'page');
    revalidatePath('/about', 'page');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error updating about page' };
  }
}

/**
 * Super Admin Organisation Management
 */
export async function getAllOrganisationsAction(): Promise<Organisation[]> {
  const session = await getCurrentUserSessionAction();
  if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
    throw new Error('Only SUPER_ADMIN can view all organisations');
  }
  return listAllOrganisations();
}

export async function createOrganisationAction(
  data: Omit<Organisation, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const session = await getCurrentUserSessionAction();
    if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Only SUPER_ADMIN can create organisations.' };
    }
    const res = await createOrganisation(data);
    revalidatePath('/', 'layout');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error creating organisation' };
  }
}

export async function updateOrganisationAction(
  orgId: string,
  data: Partial<Organisation>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUserSessionAction();
    if (!session.isAuthenticated || session.user?.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Only SUPER_ADMIN can update organisation metadata.' };
    }
    const res = await updateOrganisationDetails(orgId, data);
    revalidatePath('/', 'layout');
    return res;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error updating organisation' };
  }
}
