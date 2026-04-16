import mongoose from 'mongoose';

const FoodPostSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  quantity: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Claimed', 'Collected', 'Expired'],
    default: 'Available'
  },

  // FIXED — location now supports both address and coordinates
  location: {
    address:     { type: String },
    type:        { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  },

  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  confirmationCode: {
    type: String,
    default: null
  },
  expiryDuration: {
    type: Number,
    default: 120
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

// TTL index — MongoDB hard-deletes document after expiresAt
FoodPostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('FoodPost', FoodPostSchema);