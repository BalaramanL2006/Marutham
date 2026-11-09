import mongoose from 'mongoose';

const agriculturalLandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Land title is required'],
    trim: true
  },
  totalArea: {
    type: Number,
    required: [true, 'Total area is required'],
    min: 0.1
  },
  areaUnit: {
    type: String,
    enum: ['Acres', 'Cents', 'Hectares', 'Grounds'],
    default: 'Acres'
  },
  price: {
    type: Number,
    required: [true, 'Total price is required'],
    min: 0
  },
  pricePerUnit: {
    type: Number,
    default: 0
  },
  location: {
    village: { type: String, default: '' },
    taluk: { type: String, default: '' },
    district: { type: String, required: true, default: 'Tirunelveli' },
    state: { type: String, default: 'Tamil Nadu' },
    pincode: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 8.7139 },
      lng: { type: Number, default: 77.7567 }
    }
  },
  soilType: {
    type: String,
    enum: ['Red Soil', 'Black Cotton Soil', 'Alluvial Soil', 'Clay Loam', 'Sandy Loam', 'Laterite Soil'],
    default: 'Red Soil'
  },
  waterSource: {
    type: String,
    enum: ['Borewell Available', 'Open Well', 'Canal Irrigation', 'River Water Access', 'Rainfed Only'],
    default: 'Borewell Available'
  },
  borewellCount: {
    type: Number,
    default: 1
  },
  freeElectricity: {
    type: Boolean,
    default: true
  },
  roadAccess: {
    type: String,
    enum: ['Tar Road Frontage', 'Panchayat Concrete Road', 'Mud Road / Cart Track', 'NH/SH Highway Proximity'],
    default: 'Tar Road Frontage'
  },
  fencingAvailable: {
    type: Boolean,
    default: false
  },
  cropSuitability: [{
    type: String
  }],
  documentsAvailable: [{
    type: String
  }],
  legalDisclaimer: {
    type: String,
    default: 'MARUTHAM connects buyers and sellers. All property details, patta, chitta, encumbrance certificates (EC), and legal titles must be independently verified by the buyer with legal counsel and revenue officials before financial transactions.'
  },
  images: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerContact: {
    name: String,
    phone: String,
    alternatePhone: String
  },
  status: {
    type: String,
    enum: ['available', 'under_negotiation', 'sold'],
    default: 'available'
  },
  isVerifiedListing: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

agriculturalLandSchema.index({ title: 'text', 'location.district': 'text', soilType: 'text' });

export default mongoose.models.AgriculturalLand || mongoose.model('AgriculturalLand', agriculturalLandSchema);

