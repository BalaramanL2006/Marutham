import express from 'express';
import {
  analyzeDisease,
  getDiseaseHistory,
  getDiseaseAnalysisById
} from '../controllers/diseaseController.js';
import { optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/analyze', optionalAuth, upload.single('image'), analyzeDisease);
router.get('/history', optionalAuth, getDiseaseHistory);
router.get('/:id', getDiseaseAnalysisById);

export default router;

