import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['product', 'livestock', 'rental', 'land'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: String,
  price: Number,
  image: String,
  location: String,
  extraInfo: String
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

