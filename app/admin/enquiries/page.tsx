'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getEnquiriesAction,
  updateEnquiryStatusAction,
  deleteEnquiryAction,
} from '@/app/actions/adminCrud';
import { Enquiry, EnquiryStatus } from '@/types';
import {
  Inbox,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Building2,
  Filter,
  User,
  GraduationCap,
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const { user, isSuperAdmin, isEditor } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string>('tuition-001');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const organisations = [
    { id: 'tuition-001', name: 'Bright Academy', slug: 'bright' },
    { id: 'tuition-002', name: 'Excellence Tutorials', slug: 'excellence' },
  ];

  useEffect(() => {
    if (user && !isSuperAdmin && user.organisationIds.length > 0) {
      setSelectedOrg(user.organisationIds[0]);
    }
  }, [user, isSuperAdmin]);

  const loadEnquiries = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnquiriesAction(orgId);
      setEnquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEditor) {
      loadEnquiries(selectedOrg);
    }
  }, [selectedOrg, isEditor, loadEnquiries]);

  if (isEditor) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 m-6">
        <h2 className="text-lg font-bold text-slate-800">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">
          Content Editors do not have permission to view student admission enquiries.
        </p>
      </div>
    );
  }

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    const res = await updateEnquiryStatusAction(selectedOrg, enquiryId, newStatus);
    if (res.success) {
      setSuccess(`Enquiry status updated to "${newStatus}".`);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } else {
      setError(res.error || 'Failed to update status.');
    }
  };

  const handleDelete = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    const res = await deleteEnquiryAction(selectedOrg, enquiryId);
    if (res.success) {
      setSuccess('Enquiry deleted successfully.');
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
    } else {
      setError(res.error || 'Failed to delete enquiry.');
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in_review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'enrolled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-indigo-700" />
            Admissions & Student Enquiry Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming parent requests, admissions registrations, and contact messages.
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

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter By:</span>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Enquiries</option>
            <option value="admission">Admissions Only</option>
            <option value="contact">Contact Messages Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="in_review">In Review</option>
            <option value="enrolled">Enrolled</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredEnquiries.length}</span> of{' '}
          {enquiries.length} inquiries
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Inquiries Found</h3>
          <p className="text-xs text-slate-500">
            {enquiries.length === 0
              ? 'No admission or contact enquiries have been submitted yet.'
              : 'No enquiries match the current filter selection.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      enquiry.type === 'admission'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {enquiry.type === 'admission' ? 'Admission Form' : 'Contact Message'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(enquiry.status)}`}>
                    Status: {enquiry.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {typeof enquiry.createdAt === 'string'
                      ? enquiry.createdAt.slice(0, 10)
                      : new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Student & Parent Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Name</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {enquiry.studentName || enquiry.fullName || 'Prospective Student'}
                      {enquiry.parentName && (
                        <span className="font-normal text-slate-500">
                          {' '}
                          (Parent: {enquiry.parentName})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Contact</span>
                  <div className="space-y-0.5 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${enquiry.phone}`} className="hover:text-blue-700 font-medium">
                        {enquiry.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${enquiry.email}`} className="hover:text-blue-700 truncate">
                        {enquiry.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Academic Target</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {enquiry.studentClass ? `Class: ${enquiry.studentClass}` : ''}
                      {enquiry.preferredCourse ? ` • Course: ${enquiry.preferredCourse}` : ''}
                      {enquiry.subject ? ` • ${enquiry.subject}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1">Message:</span>
                {enquiry.message}
              </div>

              {/* Status Update & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Update Status:</span>
                  <select
                    value={enquiry.status}
                    onChange={(e) =>
                      handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                    }
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_review">In Review</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(enquiry.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Enquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
