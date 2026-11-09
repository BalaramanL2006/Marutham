import mongoose from 'mongoose';

const rentalEquipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Equipment name/title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Equipment category is required'],
    enum: [
      'Tractors',
      'Harvesters',
      'Rotavators',
      'Agricultural Drones',
      'Seed Sowing Machines',
      'Sprayers',
      'Balers',
      'Tiller & Cultivators',
      'Other'
    ]
  },
  brandModel: {
    type: String,
    default: 'Mahindra / John Deere'
  },
  powerHp: {
    type: String,
    default: '45 HP'
  },
  rentalPricePerHour: {
    type: Number,
    required: [true, 'Hourly rental price is required'],
    min: 0
  },
  rentalPricePerDay: {
    type: Number,
    required: [true, 'Daily rental price is required'],
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 1000
  },
  withDriver: {
    type: Boolean,
    default: true
  },
  driverChargesIncluded: {
    type: Boolean,
    default: true
  },
  fuelPolicy: {
    type: String,
    default: 'Customer pays for diesel / fuel.'
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
    area: { type: String, default: '' },
    city: { type: String, default: 'Thanjavur' },
    district: { type: String, default: 'Thanjavur' },
    state: { type: String, default: 'Tamil Nadu' }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerContact: {
    phone: String,
    name: String
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  rating: {
    type: Number,
    default: 4.9
  }
}, {
  timestamps: true
});

rentalEquipmentSchema.index({ title: 'text', category: 'text', brandModel: 'text' });

export default mongoose.models.RentalEquipment || mongoose.model('RentalEquipment', rentalEquipmentSchema);

