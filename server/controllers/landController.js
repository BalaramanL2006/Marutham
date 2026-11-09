import AgriculturalLand from '../models/AgriculturalLand.js';

// @desc    Get all agricultural land listings
// @route   GET /api/lands
export const getLands = async (req, res, next) => {
  try {
    const {
      search,
      soilType,
      waterSource,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      district,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'available' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
        { 'location.taluk': { $regex: search, $options: 'i' } }
      ];
    }

    if (district) {
      query['location.district'] = { $regex: district, $options: 'i' };
    }

    if (soilType) {
      query.soilType = soilType;
    }

    if (waterSource) {
      query.waterSource = waterSource;
    }

    if (minArea || maxArea) {
      query.totalArea = {};
      if (minArea) query.totalArea.$gte = Number(minArea);
      if (maxArea) query.totalArea.$lte = Number(maxArea);
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'area_asc') sortOption = { totalArea: 1 };
    if (sort === 'area_desc') sortOption = { totalArea: -1 };

    const total = await AgriculturalLand.countDocuments(query);
    const lands = await AgriculturalLand.find(query)
      .populate('seller', 'name phone location avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: lands.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      lands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single land listing by ID
// @route   GET /api/lands/:id
export const getLandById = async (req, res, next) => {
  try {
    const land = await AgriculturalLand.findById(req.params.id).populate('seller', 'name phone location avatar bio email');
    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found' });
    }
    res.json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

// @desc    Create agricultural land listing
// @route   POST /api/lands
export const createLand = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.seller = req.user._id;

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (!data.images || data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'];
    }

    if (typeof data.location === 'string') {
      try { data.location = JSON.parse(data.location); } catch (e) { data.location = { district: data.location || 'Tirunelveli' }; }
    }
    if (typeof data.cropSuitability === 'string') {
      try { data.cropSuitability = JSON.parse(data.cropSuitability); } catch (e) { data.cropSuitability = data.cropSuitability.split(',').map(s => s.trim()); }
    }
    if (typeof data.documentsAvailable === 'string') {
      try { data.documentsAvailable = JSON.parse(data.documentsAvailable); } catch (e) { data.documentsAvailable = data.documentsAvailable.split(',').map(s => s.trim()); }
    }

    if (data.totalArea && data.price) {
      data.pricePerUnit = Math.round(data.price / data.totalArea);
    }

    const land = await AgriculturalLand.create(data);
    res.status(201).json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

// @desc    Update land listing
// @route   PUT /api/lands/:id
export const updateLand = async (req, res, next) => {
  try {
    let land = await AgriculturalLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found' });
    }

    if (land.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    land = await AgriculturalLand.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete land listing
// @route   DELETE /api/lands/:id
export const deleteLand = async (req, res, next) => {
  try {
    const land = await AgriculturalLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found' });
    }

    if (land.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await land.deleteOne();
    res.json({ success: true, message: 'Land listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

