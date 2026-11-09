import AgricultureArticle from '../models/AgricultureArticle.js';

// @desc    Get all agriculture articles
// @route   GET /api/articles
export const getArticles = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await AgricultureArticle.countDocuments(query);
    const articles = await AgricultureArticle.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: articles.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug or ID
// @route   GET /api/articles/:slug
export const getArticleBySlug = async (req, res, next) => {
  try {
    const isId = req.params.slug.match(/^[0-9a-fA-F]{24}$/);
    const article = isId
      ? await AgricultureArticle.findById(req.params.slug)
      : await AgricultureArticle.findOne({ slug: req.params.slug });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

