"use client";

import React, { useState, useEffect } from "react";
import { FaCog, FaPercentage, FaTruck, FaSave, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/Settings";
import Swal from "sweetalert2";

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

export default function SettingsPage() {
  const {
    data: settingsData,
    isLoading,
    error,
    refetch,
  } = useGetSettingsQuery();

  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [taxSettings, setTaxSettings] = useState({
    enabled: true,
    type: 'percentage',
    value: 8,
    description: 'Sales Tax'
  });

  const [shippingSettings, setShippingSettings] = useState({
    enabled: true,
    type: 'fixed',
    value: 500,
    freeShippingAbove: 5000,
    description: 'Standard Shipping'
  });

  useEffect(() => {
    if (settingsData?.data?.settings) {
      const settings = settingsData.data.settings;
      if (settings.tax) {
        setTaxSettings(settings.tax);
      }
      if (settings.shipping) {
        setShippingSettings(settings.shipping);
      }
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      Swal.fire({
        title: 'Saving...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await updateSettings({
        tax: taxSettings,
        shipping: shippingSettings,
      }).unwrap();

      Swal.fire({
        title: 'Saved!',
        text: 'Settings have been updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || 'Failed to update settings',
        icon: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-4xl text-primary mb-4" />
          <p className="text-mutedForeground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">Failed to load settings</p>
          <p className="text-sm text-mutedForeground mt-2">
            {error?.data?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

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
          className="text-2xl font-bold flex items-center gap-2"
        >
          <FaCog />
          Settings
        </motion.h1>
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaPercentage className="text-2xl text-primary" />
            <h2 className="text-xl font-semibold">Tax Settings</h2>
          </div>

          <div className="space-y-4">
            {/* Enable/Disable Tax */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Tax</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={taxSettings.enabled}
                  onChange={(e) =>
                    setTaxSettings({ ...taxSettings, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {taxSettings.enabled && (
              <>
                {/* Tax Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tax Type
                  </label>
                  <select
                    value={taxSettings.type}
                    onChange={(e) =>
                      setTaxSettings({ ...taxSettings, type: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                {/* Tax Value */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tax Value
                    {taxSettings.type === 'percentage' ? ' (%)' : ' (PKR)'}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step={taxSettings.type === 'percentage' ? '0.1' : '1'}
                    value={taxSettings.value}
                    onChange={(e) =>
                      setTaxSettings({
                        ...taxSettings,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={
                      taxSettings.type === 'percentage'
                        ? 'Enter percentage (e.g., 8)'
                        : 'Enter amount (e.g., 100)'
                    }
                  />
                </div>

                {/* Tax Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Input
                    type="text"
                    value={taxSettings.description}
                    onChange={(e) =>
                      setTaxSettings({
                        ...taxSettings,
                        description: e.target.value,
                      })
                    }
                    placeholder="Sales Tax"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Shipping Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaTruck className="text-2xl text-primary" />
            <h2 className="text-xl font-semibold">Shipping Settings</h2>
          </div>

          <div className="space-y-4">
            {/* Enable/Disable Shipping */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Shipping</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shippingSettings.enabled}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {shippingSettings.enabled && (
              <>
                {/* Shipping Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Type
                  </label>
                  <select
                    value={shippingSettings.type}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        type: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage of Order</option>
                    <option value="free_above">Free Above Threshold</option>
                  </select>
                </div>

                {/* Shipping Value */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Cost
                    {shippingSettings.type === 'percentage' ? ' (%)' : ' (PKR)'}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step={shippingSettings.type === 'percentage' ? '0.1' : '1'}
                    value={shippingSettings.value}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={
                      shippingSettings.type === 'percentage'
                        ? 'Enter percentage'
                        : 'Enter amount'
                    }
                  />
                </div>

                {/* Free Shipping Above */}
                {shippingSettings.type === 'free_above' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Free Shipping Above (PKR)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={shippingSettings.freeShippingAbove}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          freeShippingAbove: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter minimum order amount"
                    />
                    <p className="text-xs text-mutedForeground mt-1">
                      Orders above this amount will have free shipping
                    </p>
                  </div>
                )}

                {/* Shipping Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Input
                    type="text"
                    value={shippingSettings.description}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        description: e.target.value,
                      })
                    }
                    placeholder="Standard Shipping"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-900 mb-2">💡 How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <strong>Tax:</strong> Applied to order subtotal. Can be percentage or
            fixed amount.
          </li>
          <li>
            <strong>Shipping:</strong> Fixed amount, percentage of order, or free
            shipping above a threshold.
          </li>
          <li>
            Changes will apply to all new orders. Existing orders will not be
            affected.
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

