import mongoose from 'mongoose';

const rentalBookingSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalEquipment',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily'],
    default: 'daily'
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  fieldLocation: {
    address: String,
    district: String,
    state: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.RentalBooking || mongoose.model('RentalBooking', rentalBookingSchema);

