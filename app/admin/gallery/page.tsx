'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getGalleryAction,
  saveGalleryImageAction,
  deleteGalleryImageAction,
} from '@/app/actions/adminCrud';
import { GalleryImage } from '@/types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  X,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const { user, isSuperAdmin } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
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

  const loadGallery = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGalleryAction(orgId);
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery(selectedOrg);
  }, [selectedOrg, loadGallery]);

  const openCreateModal = () => {
    setFormData({
      title: '',
      category: 'Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: Omit<GalleryImage, 'id'> = {
      title: formData.title.trim(),
      category: formData.category,
      imageUrl: formData.imageUrl.trim(),
      organisationId: selectedOrg,
      uploadedAt: new Date().toISOString(),
    };

    const res = await saveGalleryImageAction(selectedOrg, payload);
    if (res.success) {
      setSuccess('Photo added to gallery!');
      setIsModalOpen(false);
      loadGallery(selectedOrg);
    } else {
      setError(res.error || 'Failed to save photo.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (imageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteGalleryImageAction(selectedOrg, imageId);
    if (res.success) {
      setSuccess('Photo deleted from gallery.');
      loadGallery(selectedOrg);
    } else {
      setError(res.error || 'Failed to delete photo.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-700" />
            Campus Gallery & Media
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your campus facilities, smart classrooms, laboratories, and student activity photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Photo
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

      {/* Gallery Grid */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Photos in Gallery</h3>
          <p className="text-xs text-slate-500 mb-4">
            Upload campus and classroom photos to showcase your learning environment.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <span className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-3">
                <h4 className="font-bold text-slate-900 text-xs truncate mb-2">{item.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview
                  </a>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Add Gallery Image</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Physics Demonstration Laboratory"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Classrooms">Smart Classrooms</option>
                  <option value="Laboratories">Science & Computer Labs</option>
                  <option value="Library">Library & Reading Rooms</option>
                  <option value="Events">Academic Events & Seminars</option>
                  <option value="Campus">Campus Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
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
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
