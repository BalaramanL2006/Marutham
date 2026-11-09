import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

// @desc    Get user conversations
// @route   GET /api/messages/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email phone avatar role location')
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation or create one
// @route   POST /api/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, itemContext } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ success: false, message: 'Recipient and content are required' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        lastMessage: content,
        lastMessageAt: new Date(),
        itemContext: itemContext || {}
      });
    } else {
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      if (itemContext) conversation.itemContext = itemContext;
      await conversation.save();
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      title: `New message from ${req.user.name}`,
      message: content.substring(0, 80),
      type: 'enquiry',
      link: '/dashboard?tab=messages'
    });

    res.status(201).json({ success: true, message, conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversation: req.params.conversationId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

