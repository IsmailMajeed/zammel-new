import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    },
    // Parent category for nested categories (optional)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    // Display order
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for products count
CategorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Helper function to generate slug
const generateSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Auto-generate slug from name before saving
CategorySchema.pre('save', function (next) {
  // Always generate slug if it's missing or if name has changed
  if (!this.slug || this.isModified('name')) {
    if (this.name) {
      this.slug = generateSlug(this.name);
    }
  }
  next();
});

// Also handle before create
CategorySchema.pre('validate', function (next) {
  // Ensure slug is set before validation
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
