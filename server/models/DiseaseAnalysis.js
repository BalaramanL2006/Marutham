import mongoose from 'mongoose';

const diseaseAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  imageUrl: {
    type: String,
    required: true
  },
  detectedCrop: {
    type: String,
    default: 'Identified Crop'
  },
  possibleDisease: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number,
    default: 94
  },
  diseaseDescription: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String
  }],
  causes: [{
    type: String
  }],
  treatment: [{
    type: String
  }],
  prevention: [{
    type: String
  }],
  recommendedPractices: [{
    type: String
  }],
  isHealthy: {
    type: Boolean,
    default: false
  },
  disclaimer: {
    type: String,
    default: 'Preliminary AI analysis. Please consult local agrarian extension officers, TNAU Krishi Vigyan Kendra (KVK), or certified agricultural specialists before large-scale pesticide applications.'
  }
}, {
  timestamps: true
});

export default mongoose.models.DiseaseAnalysis || mongoose.model('DiseaseAnalysis', diseaseAnalysisSchema);

