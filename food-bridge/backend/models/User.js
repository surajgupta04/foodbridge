import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['restaurant', 'ngo'], required: true },
  address:  { type: String, default: '' },
  phone:    { type: String, default: '' },
  profilePhoto: { type: String, default: '' }, // base64 or URL

  // Restaurant-specific
  cuisineType:    { type: String, default: '' },
  operatingHours: { type: String, default: '' },

  // NGO-specific
  capacity: { type: Number, default: 0 }, // meals they can handle

  location: {
    type:        { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  }
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);