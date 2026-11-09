import express from 'express';
import {
  getLands,
  getLandById,
  createLand,
  updateLand,
  deleteLand
} from '../controllers/landController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getLands)
  .post(protect, upload.array('images', 5), createLand);

router.route('/:id')
  .get(getLandById)
  .put(protect, upload.array('images', 5), updateLand)
  .delete(protect, deleteLand);

export default router;

