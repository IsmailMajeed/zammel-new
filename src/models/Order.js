import mongoose from 'mongoose';

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  variant: {
    color: String,
    size: String,
    sku: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  images: [{
    type: String
  }]
}, { _id: true });

// Shipping Address Schema
const ShippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  }
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Guest orders allowed
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cod'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    discount: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate unique order number before validation
OrderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Also ensure order number is set before save (backup)
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Index for queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

