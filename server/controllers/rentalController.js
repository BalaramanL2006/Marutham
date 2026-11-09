import RentalEquipment from '../models/RentalEquipment.js';

// @desc    Get all rental equipment
// @route   GET /api/rentals
export const getRentals = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      location,
      withDriver,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: { $ne: 'maintenance' } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brandModel: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (withDriver !== undefined) query.withDriver = withDriver === 'true';

    if (minPrice || maxPrice) {
      query.rentalPricePerDay = {};
      if (minPrice) query.rentalPricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.rentalPricePerDay.$lte = Number(maxPrice);
    }

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.district': { $regex: location, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { rentalPricePerDay: 1 };
    if (sort === 'price_desc') sortOption = { rentalPricePerDay: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const total = await RentalEquipment.countDocuments(query);
    const rentals = await RentalEquipment.find(query)
      .populate('owner', 'name phone location avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: rentals.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      rentals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single rental equipment by ID
// @route   GET /api/rentals/:id
export const getRentalById = async (req, res, next) => {
  try {
    const rental = await RentalEquipment.findById(req.params.id).populate('owner', 'name phone location avatar bio email');
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Equipment listing not found' });
    }
    res.json({ success: true, rental });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new rental equipment
// @route   POST /api/rentals
export const createRental = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.owner = req.user._id;

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (!data.images || data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80'];
    }

    if (typeof data.location === 'string') {
      try { data.location = JSON.parse(data.location); } catch (e) { data.location = { district: data.location || 'Thanjavur' }; }
    }

    const item = await RentalEquipment.create(data);
    res.status(201).json({ success: true, rental: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update rental equipment
// @route   PUT /api/rentals/:id
export const updateRental = async (req, res, next) => {
  try {
    let item = await RentalEquipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this equipment' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    item = await RentalEquipment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, rental: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete rental equipment
// @route   DELETE /api/rentals/:id
export const deleteRental = async (req, res, next) => {
  try {
    const item = await RentalEquipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this equipment' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Equipment listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

