import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please enter phone number'],
    trim: true
  },
  role: {
    type: String,
    enum: ['buyer', 'farmer', 'service_provider', 'admin'],
    default: 'farmer'
  },
  location: {
    address: { type: String, default: '' },
    villageOrArea: { type: String, default: '' },
    district: { type: String, default: 'Madurai' },
    state: { type: String, default: 'Tamil Nadu' },
    pincode: { type: String, default: '625001' }
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    default: 'Passionate farmer & agricultural enthusiast in Tamil Nadu.'
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);

