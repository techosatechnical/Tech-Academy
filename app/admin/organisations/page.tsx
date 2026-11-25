'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getAllOrganisationsAction,
  createOrganisationAction,
  updateOrganisationAction,
} from '@/app/actions/adminCrud';
import { Organisation } from '@/types';
import {
  Building2,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Edit2,
  X,
  Shield,
  Palette,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrganisationsPage() {
  const { isSuperAdmin } = useAuth();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organisation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: 'Learn Today. Lead Tomorrow.',
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6',
    darkNavyColor: '#172554',
    lightBgColor: '#F8FAFC',
    lightBlueColor: '#EFF6FF',
    phone: '+91 98765 43210',
    email: 'info@tuition.edu',
    address: 'Academic Road, City, State - 682001',
    workingHours: 'Mon – Sat: 8:00 AM – 8:00 PM',
  });

  const loadOrgs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrganisationsAction();
      setOrganisations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organisations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      loadOrgs();
    }
  }, [isSuperAdmin, loadOrgs]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 m-6">
        <Shield className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-slate-800">Super Admin Authority Required</h2>
        <p className="text-xs text-slate-500 mt-1">
          Only users with the SUPER_ADMIN role can manage tuition centres and organisations.
        </p>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      slug: '',
      tagline: 'Learn Today. Lead Tomorrow.',
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      darkNavyColor: '#172554',
      lightBgColor: '#F8FAFC',
      lightBlueColor: '#EFF6FF',
      phone: '+91 98765 43210',
      email: 'info@tuition.edu',
      address: 'Academic Road, City, State - 682001',
      workingHours: 'Mon – Sat: 8:00 AM – 8:00 PM',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (org: Organisation) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      slug: org.slug,
      tagline: org.tagline,
      primaryColor: org.theme.primaryColor,
      secondaryColor: org.theme.secondaryColor,
      darkNavyColor: org.theme.darkNavyColor,
      lightBgColor: org.theme.lightBgColor,
      lightBlueColor: org.theme.lightBlueColor,
      phone: org.contact.phone,
      email: org.contact.email,
      address: org.contact.address,
      workingHours: org.contact.workingHours,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: Omit<Organisation, 'id'> = {
      name: formData.name.trim(),
      slug: formData.slug.toLowerCase().trim(),
      tagline: formData.tagline.trim(),
      theme: {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        darkNavyColor: formData.darkNavyColor,
        lightBgColor: formData.lightBgColor,
        lightBlueColor: formData.lightBlueColor,
      },
      contact: {
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        workingHours: formData.workingHours.trim(),
      },
      status: 'active',
      createdAt: editingOrg?.createdAt || new Date().toISOString(),
    };

    let res;
    if (editingOrg) {
      res = await updateOrganisationAction(editingOrg.id, payload);
    } else {
      res = await createOrganisationAction(payload);
    }

    if (res.success) {
      setSuccess(editingOrg ? 'Organisation updated!' : 'New tuition organisation registered!');
      setIsModalOpen(false);
      loadOrgs();
    } else {
      setError(res.error || 'Failed to save organisation.');
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-700" />
            Tuition Centre Organisation Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and maintain multi-tenant tuition centres, brand color themes, and institution contact records.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register New Organisation
        </button>
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

      {/* Organisations List */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {organisations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-slate-900">{org.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      {org.id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">/{org.slug}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: org.theme.primaryColor }}
                    title={`Primary: ${org.theme.primaryColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: org.theme.secondaryColor }}
                    title={`Secondary: ${org.theme.secondaryColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: org.theme.darkNavyColor }}
                    title={`Dark: ${org.theme.darkNavyColor}`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">&ldquo;{org.tagline}&rdquo;</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div><span className="font-semibold text-slate-800">Phone:</span> {org.contact.phone}</div>
                <div><span className="font-semibold text-slate-800">Email:</span> {org.contact.email}</div>
                <div className="truncate"><span className="font-semibold text-slate-800">Address:</span> {org.contact.address}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/${org.slug}`}
                  target="_blank"
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
                >
                  Visit Public Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => openEditModal(org)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Configuration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">
                {editingOrg ? 'Edit Organisation' : 'Register New Tuition Centre'}
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
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pinnacle Coaching Institute"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug (/slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. pinnacle"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Motto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Empowering Bright Minds"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Theme Colors */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-600" />
                  Theme Colors (Hex Codes)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Primary
                    </label>
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Secondary
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dark Navy
                    </label>
                    <input
                      type="text"
                      value={formData.darkNavyColor}
                      onChange={(e) => setFormData({ ...formData, darkNavyColor: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Campus Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingOrg ? 'Save Organisation' : 'Register Organisation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
