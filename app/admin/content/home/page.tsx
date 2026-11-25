'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getHomePageContentAction,
  saveHomePageContentAction,
} from '@/app/actions/adminCrud';
import { HomePageContent } from '@/types';
import {
  FileText,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function AdminHomeContentPage() {
  const { user, isSuperAdmin } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<HomePageContent>({
    heroBadge: '',
    heroHeading: '',
    heroHeadingAccent: '',
    heroSubheading: '',
    heroImageUrl: '',
    stats: [],
    aboutPreview: {
      badge: '',
      heading: '',
      text1: '',
      text2: '',
      imageUrl: '',
      cardTitle: '',
      cardDescription: '',
      pillars: [],
    },
    features: [],
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

  const loadContent = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHomePageContentAction(orgId);
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load home page content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent(selectedOrg);
  }, [selectedOrg, loadContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await saveHomePageContentAction(selectedOrg, formData);
    if (res.success) {
      setSuccess('Homepage content updated successfully! Public pages revalidated.');
    } else {
      setError(res.error || 'Failed to update homepage content.');
    }
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-700" />
            Homepage Content Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize hero headline, taglines, introduction copy, and background banners.
          </p>
        </div>

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

      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Hero Banner & Headings</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Badge / Top Pill *
              </label>
              <input
                type="text"
                required
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                placeholder="e.g. ADMISSIONS OPEN FOR 2026–2027 ACADEMIC SESSION"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroHeading}
                  onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                  placeholder="e.g. Learn Today."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Accent *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroHeadingAccent}
                  onChange={(e) =>
                    setFormData({ ...formData, heroHeadingAccent: e.target.value })
                  }
                  placeholder="e.g. Lead Tomorrow."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Subheading / Supporting Paragraph *
              </label>
              <textarea
                required
                rows={3}
                value={formData.heroSubheading}
                onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Background Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* About Section Preview Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Homepage About Section Preview
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                About Section Heading *
              </label>
              <input
                type="text"
                required
                value={formData.aboutPreview.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPreview: { ...formData.aboutPreview, heading: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paragraph 1 *
              </label>
              <textarea
                required
                rows={3}
                value={formData.aboutPreview.text1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPreview: { ...formData.aboutPreview, text1: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paragraph 2 *
              </label>
              <textarea
                required
                rows={3}
                value={formData.aboutPreview.text2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aboutPreview: { ...formData.aboutPreview, text2: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Homepage Content
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
