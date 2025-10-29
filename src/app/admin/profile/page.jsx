"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaCamera, FaShield, FaBell, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-buttonForeground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed.khan@zammel.com",
    phone: "+92 300 1234567",
    role: "Administrator",
    department: "Management",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-15T10:30:00Z",
    avatar: "/api/placeholder/120/120",
    address: {
      street: "123 Main Street",
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan",
      zipCode: "75500"
    },
    preferences: {
      language: "en",
      timezone: "Asia/Karachi",
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      theme: "light"
    }
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    lastPasswordChange: "2023-12-01T00:00:00Z"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value
        }
      }));
    }
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    setSecurityData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaShield },
    { id: "preferences", label: "Preferences", icon: FaCog },
    { id: "notifications", label: "Notifications", icon: FaBell }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Profile Settings
        </motion.h1>
        {isEditing && (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FaSave />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-cardBackground p-6 rounded-lg shadow"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-gray-400" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full hover:bg-primaryHover transition-colors">
                <FaCamera className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-cardForeground/60">{profileData.role} • {profileData.department}</p>
            <p className="text-sm text-cardForeground/60">Joined {formatDate(profileData.joinDate)}</p>
            <p className="text-sm text-cardForeground/60">Last login: {formatDate(profileData.lastLogin)}</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2"
            >
              <FaEdit />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-cardForeground/10">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-cardForeground/60 hover:text-cardForeground hover:border-cardForeground/20"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-cardBackground p-6 rounded-lg shadow"
      >
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Phone
                </label>
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Street Address
                </label>
                <Input
                  name="street"
                  value={profileData.address.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  City
                </label>
                <Input
                  name="city"
                  value={profileData.address.city}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  State
                </label>
                <Input
                  name="state"
                  value={profileData.address.state}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Country
                </label>
                <Input
                  name="country"
                  value={profileData.address.country}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  ZIP Code
                </label>
                <Input
                  name="zipCode"
                  value={profileData.address.zipCode}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Current Password
                </label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  New Password
                </label>
                <Input
                  name="newPassword"
                  type="password"
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Confirm New Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="bg-primary text-white hover:bg-primaryHover px-4 py-2"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-cardForeground/60">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${securityData.twoFactorEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Button className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-1 text-sm">
                      {securityData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Last Password Change</h4>
                  <p className="text-sm text-cardForeground/60">{formatDate(securityData.lastPasswordChange)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">General Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={profileData.preferences.language}
                  onChange={handlePreferenceChange}
                  className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={profileData.preferences.timezone}
                  onChange={handlePreferenceChange}
                  className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                >
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Theme
                </label>
                <select
                  name="theme"
                  value={profileData.preferences.theme}
                  onChange={handlePreferenceChange}
                  className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-cardForeground/60">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="email"
                    checked={profileData.preferences.notifications.email}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-cardForeground/60">Receive notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="sms"
                    checked={profileData.preferences.notifications.sms}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-cardForeground/60">Receive push notifications in browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="push"
                    checked={profileData.preferences.notifications.push}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}