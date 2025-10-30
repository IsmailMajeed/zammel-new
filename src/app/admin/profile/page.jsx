"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetAccountMutation, useChangePasswordMutation } from "@/redux/api/Auth";
import { setAdminUser } from "@/redux/slices/AdminUser";

export default function AdminProfilePage() {
  const { user } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [setAccount] = useSetAccountMutation();
  const [changePassword, { isLoading: changingPwd }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  if (!user) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await setAccount({ name }).unwrap();
      if (res?.data?.user) {
        dispatch(setAdminUser({ user: res.data.user }));
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
      </div>

      <div className="">
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-cardBackground rounded-lg shadow border border-cardForeground/10">
            <div className="px-6 py-4 border-b border-cardForeground/10">
              <h2 className="text-lg font-semibold">Profile information</h2>
            </div>
            <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cardForeground mb-2">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-borderColor rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ringColor focus:border-transparent bg-inputBackground text-inputForeground"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cardForeground mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full border border-borderColor bg-mutedBackground text-cardForeground/70 rounded-lg px-4 py-3 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryHover transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-cardBackground rounded-lg shadow border border-cardForeground/10">
            <div className="px-6 py-4 border-b border-cardForeground/10">
              <h2 className="text-lg font-semibold">Change password</h2>
            </div>
            <form onSubmit={onChangePassword} className="px-6 py-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cardForeground mb-2">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-borderColor rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ringColor focus:border-transparent bg-inputBackground text-inputForeground"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-borderColor rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ringColor focus:border-transparent bg-inputBackground text-inputForeground"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-borderColor rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ringColor focus:border-transparent bg-inputBackground text-inputForeground"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPwd}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryHover transition-colors disabled:opacity-60"
                >
                  {changingPwd ? "Changing…" : "Change password"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}