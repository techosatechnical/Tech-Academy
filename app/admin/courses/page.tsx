'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getCoursesAction,
  saveCourseAction,
  deleteCourseAction,
} from '@/app/actions/adminCrud';
import { Course } from '@/types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  Building2,
  X,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const { user, isSuperAdmin } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    classGroup: '',
    category: 'school' as Course['category'],
    shortDescription: '',
    fullDescription: '',
    fee: '',
    duration: '',
    batchTiming: '',
    subjects: '',
    highlights: '',
    isPopular: false,
  });

  const organisations = [
    { id: 'tuition-001', name: 'Bright Academy', slug: 'bright' },
    { id: 'tuition-002', name: 'Excellence Tutorials', slug: 'excellence' },
  ];

  useEffect(() => {
    if (user && !isSuperAdmin && user.organisationIds.length > 0) {
      setSelectedOrg(user.organisationIds[0]);
    }
  }, [user, isSuperAdmin]);

  const loadCourses = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCoursesAction(orgId);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses(selectedOrg);
  }, [selectedOrg, loadCourses]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      level: 'Classes 8–10',
      classGroup: 'Secondary School',
      category: 'school',
      shortDescription: '',
      fullDescription: '',
      fee: '₹18,000 / academic year',
      duration: '1 Year Full Academic Session',
      batchTiming: '5:00 PM – 7:30 PM (Mon – Fri)',
      subjects: 'Mathematics, Science, Social Science, English',
      highlights: 'NCERT Textbook Coverage\nWeekly Chapter Tests\nPrinted Formula Sheets',
      isPopular: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormData({
      title: c.title,
      level: c.level,
      classGroup: c.classGroup,
      category: c.category,
      shortDescription: c.shortDescription,
      fullDescription: c.fullDescription || '',
      fee: c.fee || '',
      duration: c.duration,
      batchTiming: c.batchTiming,
      subjects: c.subjects.join(', '),
      highlights: (c.highlights || []).join('\n'),
      isPopular: !!c.isPopular,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: Omit<Course, 'id'> = {
      title: formData.title.trim(),
      level: formData.level.trim(),
      classGroup: formData.classGroup.trim(),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      fee: formData.fee.trim(),
      duration: formData.duration.trim(),
      batchTiming: formData.batchTiming.trim(),
      subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      highlights: formData.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
      isPopular: formData.isPopular,
      organisationId: selectedOrg,
    };

    const res = await saveCourseAction(selectedOrg, payload, editingCourse?.id);
    if (res.success) {
      setSuccess(editingCourse ? 'Course updated successfully!' : 'New course added successfully!');
      setIsModalOpen(false);
      loadCourses(selectedOrg);
    } else {
      setError(res.error || 'Failed to save course.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteCourseAction(selectedOrg, courseId);
    if (res.success) {
      setSuccess('Course deleted successfully.');
      loadCourses(selectedOrg);
    } else {
      setError(res.error || 'Failed to delete course.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-700" />
            Course Curriculum Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, or remove courses for your tuition centre syllabus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Org Selector for Super Admin */}
          {isSuperAdmin && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                {organisations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Course List */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Courses Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            No courses have been configured yet for this tuition centre.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {course.level}
                  </span>
                  {course.isPopular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {course.shortDescription}
                </p>

                <div className="space-y-1.5 mb-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{course.batchTiming}</span>
                  </div>
                  {course.fee && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{course.fee}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.subjects.slice(0, 3).map((sub, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                  {course.subjects.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                      +{course.subjects.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(course)}
                  className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">
                {editingCourse ? 'Edit Course Curriculum' : 'Add New Course'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Plus One Science Stream Coaching"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class / Academic Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g. Class 11 (Plus One)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Course['category'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="school">School Tuition (5–10)</option>
                    <option value="higher-secondary">Higher Secondary (+1 / +2)</option>
                    <option value="entrance">Entrance Preparation (JEE/NEET)</option>
                    <option value="specialized">Specialized Subject Coaching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Group Tag
                  </label>
                  <input
                    type="text"
                    value={formData.classGroup}
                    onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
                    placeholder="e.g. Secondary School"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fee Structure
                  </label>
                  <input
                    type="text"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    placeholder="e.g. ₹22,000 / year"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise overview shown on course preview cards..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Timings *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchTiming}
                    onChange={(e) => setFormData({ ...formData, batchTiming: e.target.value })}
                    placeholder="e.g. 5:00 PM – 7:30 PM (Mon – Fri)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 1 Academic Year"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjects Covered (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  placeholder="e.g. Physics, Chemistry, Mathematics, Biology"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highlights & Features (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Complete Board Syllabus&#10;Weekly Topic Tests&#10;Doubt Clearance Batches"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="isPopular" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature as &quot;Popular Course&quot; on Homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
