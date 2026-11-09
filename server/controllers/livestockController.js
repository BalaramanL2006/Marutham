import Livestock from '../models/Livestock.js';

// @desc    Get all livestock listings
// @route   GET /api/livestock
export const getLivestock = async (req, res, next) => {
  try {
    const {
      search,
      category,
      breed,
      minPrice,
      maxPrice,
      location,
      gender,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'available' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    if (gender) query.gender = gender;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.district': { $regex: location, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const total = await Livestock.countDocuments(query);
    const livestock = await Livestock.find(query)
      .populate('seller', 'name phone location avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: livestock.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      livestock
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get livestock by ID
// @route   GET /api/livestock/:id
export const getLivestockById = async (req, res, next) => {
  try {
    const item = await Livestock.findById(req.params.id).populate('seller', 'name phone location avatar bio email');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Livestock listing not found' });
    }
    res.json({ success: true, livestock: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create livestock listing
// @route   POST /api/livestock
export const createLivestock = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.seller = req.user._id;

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (!data.images || data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'];
    }

    if (typeof data.age === 'string') {
      try { data.age = JSON.parse(data.age); } catch (e) { data.age = { value: Number(data.age) || 2, unit: 'years' }; }
    }
    if (typeof data.milkProduction === 'string') {
      try { data.milkProduction = JSON.parse(data.milkProduction); } catch (e) { data.milkProduction = { litersPerDay: Number(data.milkProduction) || 0 }; }
    }
    if (typeof data.location === 'string') {
      try { data.location = JSON.parse(data.location); } catch (e) { data.location = { district: data.location || 'Coimbatore' }; }
    }

    const item = await Livestock.create(data);
    res.status(201).json({ success: true, livestock: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update livestock listing
// @route   PUT /api/livestock/:id
export const updateLivestock = async (req, res, next) => {
  try {
    let item = await Livestock.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    item = await Livestock.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, livestock: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete livestock listing
// @route   DELETE /api/livestock/:id
export const deleteLivestock = async (req, res, next) => {
  try {
    const item = await Livestock.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Livestock listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

