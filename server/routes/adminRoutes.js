import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getReportedPosts,
  handleReportedPost
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);
router.get('/reports', getReportedPosts);
router.delete('/reports/:id', handleReportedPost);

export default router;

