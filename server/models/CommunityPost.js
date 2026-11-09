import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['Crop Advisory', 'Pest Control', 'Livestock Care', 'Machinery & Tools', 'Market Tips', 'Success Stories', 'General Discussion'],
    default: 'General Discussion'
  },
  tags: [{
    type: String
  }],
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);

