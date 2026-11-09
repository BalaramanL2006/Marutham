import DiseaseAnalysis from '../models/DiseaseAnalysis.js';
import { analyzeCropDisease } from '../services/geminiService.js';

// @desc    Analyze crop disease from image
// @route   POST /api/disease/analyze
export const analyzeDisease = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a plant or crop leaf image' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Call AI Service (Gemini or Agronomy diagnostic engine)
    const diagnosis = await analyzeCropDisease(filePath, originalName);

    const imageUrl = `/uploads/${req.file.filename}`;

    const record = await DiseaseAnalysis.create({
      user: req.user ? req.user._id : null,
      imageUrl,
      detectedCrop: diagnosis.detectedCrop,
      possibleDisease: diagnosis.possibleDisease,
      confidenceScore: diagnosis.confidenceScore,
      diseaseDescription: diagnosis.diseaseDescription,
      symptoms: diagnosis.symptoms || [],
      causes: diagnosis.causes || [],
      treatment: diagnosis.treatment || [],
      prevention: diagnosis.prevention || [],
      recommendedPractices: diagnosis.recommendedPractices || [],
      isHealthy: diagnosis.isHealthy || false,
      disclaimer: diagnosis.disclaimer
    });

    res.status(201).json({
      success: true,
      analysis: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's disease analysis history
// @route   GET /api/disease/history
export const getDiseaseHistory = async (req, res, next) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    const history = await DiseaseAnalysis.find(query).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single disease analysis record
// @route   GET /api/disease/:id
export const getDiseaseAnalysisById = async (req, res, next) => {
  try {
    const record = await DiseaseAnalysis.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Diagnosis report not found' });
    }
    res.json({ success: true, analysis: record });
  } catch (error) {
    next(error);
  }
};

