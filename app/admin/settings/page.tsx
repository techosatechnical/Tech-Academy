'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getSettingsAction,
  saveSettingsAction,
} from '@/app/actions/adminCrud';
import { OrganisationSettings } from '@/types';
import {
  Settings,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  BellRing,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, isSuperAdmin, isEditor } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<OrganisationSettings>({
    metaTitle: '',
    metaDescription: '',
    academicYear: '2026–2027',
    admissionOpen: true,
    admissionNotice: '',
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

  const loadSettings = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettingsAction(orgId);
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEditor) {
      loadSettings(selectedOrg);
    }
  }, [selectedOrg, isEditor, loadSettings]);

  if (isEditor) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 m-6">
        <h2 className="text-lg font-bold text-slate-800">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">
          Content Editors do not have permission to modify institution settings.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await saveSettingsAction(selectedOrg, formData);
    if (res.success) {
      setSuccess('Settings updated successfully! Changes are live on the public website.');
    } else {
      setError(res.error || 'Failed to save settings.');
    }
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Institution & Website Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure SEO metadata, academic calendar years, and admissions intake banners.
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
          {/* Admissions Status Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BellRing className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Admissions Status & Academic Session</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Admissions Status
                </span>
                <span className="text-xs text-slate-500">
                  Controls admission call-to-action banners and application availability.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.admissionOpen}
                  onChange={(e) => setFormData({ ...formData, admissionOpen: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700">
                  {formData.admissionOpen ? 'Open' : 'Closed'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Academic Year *
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="e.g. 2026–2027"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admissions Notice Banner Text
                </label>
                <input
                  type="text"
                  value={formData.admissionNotice || ''}
                  onChange={(e) => setFormData({ ...formData, admissionNotice: e.target.value })}
                  placeholder="e.g. Early bird concessions available until May 31"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* SEO & Meta Tags Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Search Engine Optimization (SEO)</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website Meta Title *
              </label>
              <input
                type="text"
                required
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="e.g. Bright Academy | Premier Tuition Centre"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Comprehensive description displayed on Google search results..."
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
              Save All Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
