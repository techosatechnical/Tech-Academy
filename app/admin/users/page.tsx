'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  listAllUsersAction,
  createAdminUserAction,
  updateUserRoleAction,
} from '@/app/actions/auth';
import { UserProfile, UserRole } from '@/types';
import {
  UserCheck,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  X,
  Mail,
  Lock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'ORGANISATION_ADMIN' as UserRole,
    organisationIds: ['tuition-001'],
  });

  const availableOrgs = [
    { id: 'tuition-001', name: 'Bright Academy (tuition-001)' },
    { id: 'tuition-002', name: 'Excellence Tutorials (tuition-002)' },
  ];

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAllUsersAction();
      if (res.success && res.users) {
        setUsers(res.users);
      } else {
        setError(res.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin, loadUsers]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 m-6">
        <Shield className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-slate-800">Super Admin Authority Required</h2>
        <p className="text-xs text-slate-500 mt-1">
          Only SUPER_ADMIN accounts can access administrative user and role assignments.
        </p>
      </div>
    );
  }

  const handleOrgToggle = (orgId: string) => {
    setFormData((prev) => {
      const exists = prev.organisationIds.includes(orgId);
      const updated = exists
        ? prev.organisationIds.filter((id) => id !== orgId)
        : [...prev.organisationIds, orgId];
      return { ...prev, organisationIds: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const res = await createAdminUserAction({
      email: formData.email.trim(),
      password: formData.password.trim() || 'Admin@123456',
      displayName: formData.displayName.trim(),
      role: formData.role,
      organisationIds: formData.role === 'SUPER_ADMIN' ? [] : formData.organisationIds,
    });

    if (res.success) {
      setSuccess('Administrator provisioned successfully in Firebase Auth & Firestore!');
      setIsModalOpen(false);
      loadUsers();
    } else {
      setError(res.error || 'Failed to create administrator.');
    }
    setSubmitting(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, currentOrgs: string[]) => {
    const res = await updateUserRoleAction(userId, newRole, currentOrgs);
    if (res.success) {
      setSuccess('User role updated successfully.');
      loadUsers();
    } else {
      setError(res.error || 'Failed to update user role.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-700" />
            Administrative User & Role Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign security roles (SUPER_ADMIN, ORGANISATION_ADMIN, EDITOR) and map admins to specific tuition centres.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              displayName: '',
              email: '',
              password: 'Admin@123456',
              role: 'ORGANISATION_ADMIN',
              organisationIds: ['tuition-001'],
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Administrator
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

      {/* Users Table */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Admin Users Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Provision administrators to manage tuition centres.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Administrator</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Accessible Organisations</th>
                  <th className="px-5 py-3.5 text-right">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {u.displayName || 'Administrator'}
                              {isCurrent && (
                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : u.role === 'ORGANISATION_ADMIN'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {u.role === 'SUPER_ADMIN' ? (
                          <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            Unrestricted (All Organisations)
                          </span>
                        ) : u.organisationIds && u.organisationIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {u.organisationIds.map((orgId) => (
                              <span
                                key={orgId}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
                              >
                                {orgId}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None assigned</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {!isCurrent && (
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(
                                u.id,
                                e.target.value as UserRole,
                                u.organisationIds || []
                              )
                            }
                            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="ORGANISATION_ADMIN">ORGANISATION_ADMIN</option>
                            <option value="EDITOR">EDITOR</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Provision Administrator</h3>
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
                  Full Name / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Prof. Anjali Menon"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@techacademy.edu"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Assignment *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="ORGANISATION_ADMIN">ORGANISATION_ADMIN (Manages assigned centre)</option>
                  <option value="EDITOR">EDITOR (Manages courses & faculty only)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Unrestricted system control)</option>
                </select>
              </div>

              {formData.role !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Accessible Organisations *
                  </label>
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {availableOrgs.map((org) => (
                      <label key={org.id} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={formData.organisationIds.includes(org.id)}
                          onChange={() => handleOrgToggle(org.id)}
                          className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="text-slate-800">{org.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                  Provision Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
