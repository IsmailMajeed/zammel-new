import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    // Tax settings
    tax: {
      enabled: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
      },
      value: {
        type: Number,
        required: true,
        min: 0,
        default: 8 // 8% default tax
      },
      description: {
        type: String,
        trim: true,
        default: 'Sales Tax'
      }
    },
    // Shipping settings
    shipping: {
      enabled: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        enum: ['fixed', 'percentage', 'free_above', 'city_wise'],
        default: 'fixed'
      },
      value: {
        type: Number,
        required: false,
        min: 0,
        default: 500 // PKR 500 default shipping (used when city_wise is not set)
      },
      freeShippingAbove: {
        type: Number,
        min: 0,
        default: 5000 // Free shipping above PKR 5000
      },
      description: {
        type: String,
        trim: true,
        default: 'Standard Shipping'
      },
      // City-wise delivery charges
      cityCharges: {
        type: Map,
        of: {
          type: Number,
          min: 0
        },
        default: {}
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      tax: {
        enabled: true,
        type: 'percentage',
        value: 8,
        description: 'Sales Tax'
      },
      shipping: {
        enabled: true,
        type: 'fixed',
        value: 500,
        freeShippingAbove: 5000,
        description: 'Standard Shipping'
      }
    });
  }

  return settings;
};

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

