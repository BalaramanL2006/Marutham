import express from 'express';
import { getConversations, sendMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/', sendMessage);
router.get('/:conversationId', getMessages);

export default router;

