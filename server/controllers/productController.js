import Product from '../models/Product.js';

// @desc    Get all products (with search, category, sort, location filters)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      type, // 'vegetables', 'fertilizers', 'fruits'
      minPrice,
      maxPrice,
      location,
      organic,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'available' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    } else if (type === 'vegetables') {
      query.category = { $in: ['Vegetables', 'Fruits'] };
    } else if (type === 'fertilizers') {
      query.category = {
        $in: [
          'Organic Fertilizers',
          'Chemical Fertilizers',
          'Seeds',
          'Pesticides',
          'Farming Tools',
          'Irrigation Equipment',
          'Crop Protection'
        ]
      };
    }

    if (organic === 'true') {
      query.isOrganic = true;
    }

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
    if (sort === 'rating') sortOption = { rating: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name phone location avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name phone location avatar bio email');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product listing
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    productData.seller = req.user._id;

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (!productData.images || productData.images.length === 0) {
      productData.images = ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'];
    }

    if (typeof productData.location === 'string') {
      try {
        productData.location = JSON.parse(productData.location);
      } catch (e) {
        productData.location = { district: productData.location || req.user.location?.district || 'Madurai' };
      }
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

