import mongoose from 'mongoose';

// Simple Variant Schema
const VariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  colorCode: {
    type: String, // Hex code like #FF0000
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    required: true,
    trim: true
  },
  // Images for this specific color
  images: [{
    type: String,
    trim: true
  }],
  // Individual discount for this variant (percentage)
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { _id: true });

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    // Reference to Category model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    // Array of variants (color + size combinations)
    variants: {
      type: [VariantSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Product must have at least one variant'
      }
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    fabric: {
      type: String,
      trim: true
    },
    gsm: {
      type: Number,
      min: 0
    },
    fit: {
      type: String,
      trim: true
    },
    careInstructions: [{
      type: String,
      trim: true
    }],
    sizeChart: [{
      size: {
        type: String,
        trim: true
      },
      chest: {
        type: String,
        trim: true
      },
      length: {
        type: String,
        trim: true
      },
      sleeve: {
        type: String,
        trim: true
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total stock
ProductSchema.virtual('totalStock').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((total, variant) => total + variant.quantity, 0);
});

// Virtual for price range
ProductSchema.virtual('priceRange').get(function () {
  if (!this.variants || this.variants.length === 0) return { min: 0, max: 0 };
  const prices = this.variants.map(v => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Method to get discounted price for a variant
ProductSchema.methods.getDiscountedPrice = function (variantId) {
  const variant = this.variants.id(variantId);
  if (!variant) return null;

  if (variant.discount > 0) {
    return variant.price - (variant.price * variant.discount / 100);
  }
  return variant.price;
};

// Index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Compound index for filtering
ProductSchema.index({ category: 1, status: 1, featured: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
