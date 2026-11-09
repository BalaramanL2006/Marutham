import User from '../models/User.js';
import Product from '../models/Product.js';
import Livestock from '../models/Livestock.js';
import RentalEquipment from '../models/RentalEquipment.js';
import RentalBooking from '../models/RentalBooking.js';
import AgriculturalLand from '../models/AgriculturalLand.js';
import Order from '../models/Order.js';
import CommunityPost from '../models/CommunityPost.js';
import DiseaseAnalysis from '../models/DiseaseAnalysis.js';

// @desc    Get dashboard analytics & statistics
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalProducts,
      totalLivestock,
      totalRentals,
      totalLands,
      totalOrders,
      totalBookings,
      totalAnalyses,
      reportedPosts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      Product.countDocuments(),
      Livestock.countDocuments(),
      RentalEquipment.countDocuments(),
      AgriculturalLand.countDocuments(),
      Order.countDocuments(),
      RentalBooking.countDocuments(),
      DiseaseAnalysis.countDocuments(),
      CommunityPost.countDocuments({ isReported: true })
    ]);

    // Calculate revenue from completed orders
    const orders = await Order.find({ orderStatus: { $ne: 'cancelled' } }, 'totalAmount');
    const totalOrderVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalProducts,
        totalLivestock,
        totalRentals,
        totalLands,
        totalOrders,
        totalBookings,
        totalAnalyses,
        reportedPosts,
        totalOrderVolume
      },
      recentOrders,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or verification
// @route   PUT /api/admin/users/:id
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const { role, isVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User account removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reported community posts
// @route   GET /api/admin/reports
export const getReportedPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({ isReported: true })
      .populate('author', 'name email phone avatar')
      .sort({ updatedAt: -1 });
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Dismiss report or remove post
// @route   DELETE /api/admin/reports/:id
export const handleReportedPost = async (req, res, next) => {
  try {
    const { action } = req.query; // 'dismiss' or 'delete'
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (action === 'dismiss') {
      post.isReported = false;
      post.reportReason = '';
      await post.save();
      return res.json({ success: true, message: 'Report dismissed, post retained' });
    } else {
      await post.deleteOne();
      return res.json({ success: true, message: 'Inappropriate post removed successfully' });
    }
  } catch (error) {
    next(error);
  }
};

