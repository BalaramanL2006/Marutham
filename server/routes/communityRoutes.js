import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  toggleLike,
  addComment,
  reportPost
} from '../controllers/communityController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.array('images', 3), createPost);

router.route('/:id')
  .get(getPostById);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.post('/:id/report', protect, reportPost);

export default router;

