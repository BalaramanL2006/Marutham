import express from 'express';
import {
  getRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental
} from '../controllers/rentalController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getRentals)
  .post(protect, upload.array('images', 5), createRental);

router.route('/:id')
  .get(getRentalById)
  .put(protect, upload.array('images', 5), updateRental)
  .delete(protect, deleteRental);

export default router;

