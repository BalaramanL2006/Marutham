import mongoose from 'mongoose';

const agricultureArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: [
      'Crop Cultivation',
      'Soil Preparation',
      'Irrigation Methods',
      'Organic Farming',
      'Fertilizer Usage',
      'Pest Management',
      'Seasonal Farming Tips',
      'Government Schemes'
    ],
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  author: {
    name: { type: String, default: 'MARUTHAM Agronomy Team' },
    role: { type: String, default: 'Senior Agricultural Scientist' }
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

agricultureArticleSchema.index({ title: 'text', summary: 'text', content: 'text', category: 'text' });

export default mongoose.models.AgricultureArticle || mongoose.model('AgricultureArticle', agricultureArticleSchema);

