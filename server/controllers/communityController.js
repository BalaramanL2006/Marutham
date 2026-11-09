import CommunityPost from '../models/CommunityPost.js';
import Comment from '../models/Comment.js';

// @desc    Get all community posts
// @route   GET /api/community
export const getPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { isReported: false };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .populate('author', 'name phone location avatar role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: posts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post with comments
// @route   GET /api/community/:id
export const getPostById = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate('author', 'name location avatar role');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name location avatar role')
      .sort({ createdAt: 1 });

    res.json({ success: true, post, comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new community post
// @route   POST /api/community
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      title,
      content,
      category: category || 'General Discussion',
      tags: parsedTags,
      images
    });

    await post.populate('author', 'name location avatar role');
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / unlike community post
// @route   POST /api/community/:id/like
export const toggleLike = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, isLiked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/community/:id/comment
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content
    });

    post.commentsCount += 1;
    await post.save();

    await comment.populate('author', 'name location avatar role');
    res.status(201).json({ success: true, comment, commentsCount: post.commentsCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Report post
// @route   POST /api/community/:id/report
export const reportPost = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.isReported = true;
    post.reportReason = reason || 'Reported by community member for review';
    await post.save();

    res.json({ success: true, message: 'Post reported to moderators. Thank you for keeping MARUTHAM safe.' });
  } catch (error) {
    next(error);
  }
};

