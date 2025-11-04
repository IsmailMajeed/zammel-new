import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent'],
      default: 'draft'
    },
    sentAt: {
      type: Date,
      default: null
    },
    recipientsCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for queries
NewsletterSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

