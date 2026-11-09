import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
export const toggleWishlist = async (req, res, next) => {
  try {
    const { itemType, itemId, title, price, image, location, extraInfo } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const index = wishlist.items.findIndex(
      item => item.itemId.toString() === itemId.toString() && item.itemType === itemType
    );

    let isAdded = false;
    if (index > -1) {
      wishlist.items.splice(index, 1);
    } else {
      wishlist.items.push({ itemType, itemId, title, price, image, location, extraInfo });
      isAdded = true;
    }

    await wishlist.save();
    res.json({ success: true, isAdded, wishlist });
  } catch (error) {
    next(error);
  }
};

