import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  itemContext: {
    itemType: String,
    itemId: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    image: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

