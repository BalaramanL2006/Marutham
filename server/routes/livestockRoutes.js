import express from 'express';
import {
  getLivestock,
  getLivestockById,
  createLivestock,
  updateLivestock,
  deleteLivestock
} from '../controllers/livestockController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getLivestock)
  .post(protect, upload.array('images', 5), createLivestock);

router.route('/:id')
  .get(getLivestockById)
  .put(protect, upload.array('images', 5), updateLivestock)
  .delete(protect, deleteLivestock);

export default router;

