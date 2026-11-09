import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Vegetables',
      'Fruits',
      'Organic Fertilizers',
      'Chemical Fertilizers',
      'Seeds',
      'Pesticides',
      'Farming Tools',
      'Irrigation Equipment',
      'Crop Protection'
    ]
  },
  subcategory: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required (e.g., kg, ton, piece)'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: 0
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    city: { type: String, default: 'Madurai' },
    district: { type: String, default: 'Madurai' },
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
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['available', 'low_stock', 'out_of_stock', 'inactive'],
    default: 'available'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isRegulated: {
    type: Boolean,
    default: false
  },
  sellerLicenseNumber: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

productSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

