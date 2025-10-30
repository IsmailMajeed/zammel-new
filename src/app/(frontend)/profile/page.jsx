'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSetAccountMutation, useChangePasswordMutation } from '@/redux/api/Auth';
import { setUser } from '@/redux/slices/User';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [setAccount] = useSetAccountMutation();
  const [changePassword, { isLoading: changingPwd }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
    } else {
      setName(user.name || '');
    }
  }, [user, router]);

  if (!user) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await setAccount({ name }).unwrap();
      if (res?.data?.user) {
        dispatch(setUser({ user: res.data.user }));
      }
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
    }
  };

  return (
    <main className="container !py-10">
      <div className="mb-6 text-sm text-gray-600">
        <nav className="flex items-center gap-2" aria-label="Breadcrumb">
          <span className="text-gray-500">Account</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">Profile</span>
        </nav>
      </div>

      <div className="flex items-end justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Profile</h1>
        <span className="hidden md:inline text-sm text-gray-500">Manage your personal info and security</span>
      </div>

      <div className="grid gap-6 md:gap-8 md:grid-cols-12">
        <aside className="md:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
                {(user?.name || user?.email || 'U')
                  .toString()
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">{user?.name || 'Your name'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  const el = document.getElementById('profile-info');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Profile Info
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  const el = document.getElementById('security');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Security
              </button>
            </div>
          </div>
        </aside>

        <section className="md:col-span-8 space-y-8">
          <div id="profile-info" className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile information</h2>
                <p className="text-sm text-gray-500">Update your name and contact email</p>
              </div>
            </div>
            <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 text-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>

          <div id="security" className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
              <p className="text-sm text-gray-500">Keep your account secure with a strong password</p>
            </div>
            <form onSubmit={onChangePassword} className="px-6 py-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPwd}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {changingPwd ? 'Changing…' : 'Change password'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}


