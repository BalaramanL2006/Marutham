import RentalBooking from '../models/RentalBooking.js';
import RentalEquipment from '../models/RentalEquipment.js';

// @desc    Create rental booking request
// @route   POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { equipmentId, startDate, endDate, rentalType, duration, notes, fieldLocation, contactNumber } = req.body;

    const equipment = await RentalEquipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Rental equipment not found' });
    }

    if (equipment.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own equipment' });
    }

    const rate = rentalType === 'hourly' ? equipment.rentalPricePerHour : equipment.rentalPricePerDay;
    const totalPrice = rate * Number(duration);

    const booking = await RentalBooking.create({
      equipment: equipmentId,
      renter: req.user._id,
      owner: equipment.owner,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rentalType: rentalType || 'daily',
      duration: Number(duration),
      totalPrice,
      contactNumber: contactNumber || req.user.phone,
      notes: notes || '',
      fieldLocation: fieldLocation || { district: req.user.location?.district || 'Thanjavur' }
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rental bookings (as renter)
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await RentalBooking.find({ renter: req.user._id })
      .populate('equipment')
      .populate('owner', 'name phone location avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rental requests for equipment owned by user
// @route   GET /api/bookings/owner
export const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await RentalBooking.find({ owner: req.user._id })
      .populate('equipment')
      .populate('renter', 'name phone location avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (accept, reject, complete)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const booking = await RentalBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only equipment owner can update booking status' });
    }

    booking.status = status;
    if (rejectionReason) booking.rejectionReason = rejectionReason;

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

