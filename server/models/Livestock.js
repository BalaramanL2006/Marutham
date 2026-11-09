import mongoose from 'mongoose';

const livestockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Animal title/name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Livestock category is required'],
    enum: ['Cows', 'Buffaloes', 'Goats', 'Sheep', 'Chickens', 'Other']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['months', 'years'], default: 'years' }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Pair'],
    required: true
  },
  healthInfo: {
    type: String,
    default: 'Healthy, dewormed and vaccinated.'
  },
  milkProduction: {
    litersPerDay: { type: Number, default: 0 },
    lactationCycle: { type: String, default: '' }
  },
  weightKg: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  location: {
    village: { type: String, default: '' },
    city: { type: String, default: 'Coimbatore' },
    district: { type: String, default: 'Coimbatore' },
    state: { type: String, default: 'Tamil Nadu' }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerContact: {
    phone: String,
    name: String
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  },
  vaccinationProof: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

livestockSchema.index({ title: 'text', breed: 'text', category: 'text' });

export default mongoose.models.Livestock || mongoose.model('Livestock', livestockSchema);

