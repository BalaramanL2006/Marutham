import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, InputGroup, Alert } from 'react-bootstrap';
import {
  FaUsers,
  FaPlusCircle,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaFlag,
  FaImage,
  FaPaperPlane,
  FaFilter,
  FaMapMarkerAlt
} from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  // New Post State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General Discussion');
  const [newTags, setNewTags] = useState('');
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  // Comment State (expanded post comments)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [activeComments, setActiveComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingPostId, setReportingPostId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  const postCategories = [
    'All',
    'Crop Advisory',
    'Pest Control',
    'Livestock Care',
    'Machinery & Tools',
    'Market Tips',
    'Success Stories',
    'General Discussion'
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'All') params.category = category;

      const res = await api.get('/community', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setCreateError('Please provide a title and content for your post.');
      return;
    }

    try {
      setCreateSubmitting(true);
      setCreateError('');

      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('category', newCategory);
      if (newTags) formData.append('tags', newTags);
      if (postImageFile) formData.append('images', postImageFile);

      const res = await api.post('/community', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        setPostImageFile(null);
        setPostImagePreview('');
        fetchPosts();
      }
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    if (!isAuthenticated) return alert('Please login to like posts.');

    try {
      const res = await api.post(`/community/${postId}/like`);
      if (res.data.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === postId) {
            const hasLiked = p.likes?.includes(user._id);
            const updatedLikes = hasLiked
              ? p.likes.filter(id => id !== user._id)
              : [...(p.likes || []), user._id];
            return { ...p, likes: updatedLikes };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleToggleComments = async (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }

    setActiveCommentsPostId(postId);
    try {
      setCommentsLoading(true);
      const res = await api.get(`/community/${postId}`);
      if (res.data.success) {
        setActiveComments(res.data.comments || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (postId) => {
    if (!isAuthenticated) return alert('Please login to comment.');
    if (!newCommentText.trim()) return;

    try {
      const res = await api.post(`/community/${postId}/comment`, { content: newCommentText });
      if (res.data.success) {
        setActiveComments(prev => [...prev, res.data.comment]);
        setNewCommentText('');
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleReportPost = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/community/${reportingPostId}/report`, { reason: reportReason });
      setReportSuccess('Post reported to moderators. Thank you.');
      setTimeout(() => {
        setReportSuccess('');
        setShowReportModal(false);
        setReportReason('');
      }, 1500);
    } catch (err) {
      console.error('Error reporting post:', err);
    }
  };

  return (
    <div className="community-page py-4">
      <Container style={{ maxWidth: '850px' }}>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <span className="section-badge mb-1">
                🌾 {language === 'ta' ? 'விவசாயிகள் சமூகம்' : 'Farmer Community Network'}
              </span>
              <h1 className="fw-bolder fs-3 m-0">
                {language === 'ta' ? 'விவசாயிகள் கலந்துரையாடல் அரங்கம்' : 'Tamil Nadu Farmers Community'}
              </h1>
              <small className="text-muted">
                Ask farming queries, share pest remedies, and celebrate your harvest results.
              </small>
            </div>
            <Button
              onClick={() => {
                if (!isAuthenticated) return alert('Please login to create a post.');
                setShowCreateModal(true);
              }}
              className="btn-accent-gold d-flex align-items-center gap-2 px-3 py-2 fw-bold text-nowrap flex-shrink-0"
            >
              <FaPlusCircle /> Create New Post
            </Button>
          </div>

          {/* Category Filter Pills */}
          <div className="d-flex gap-2 mt-3 overflow-auto pb-1">
            {postCategories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'success' : 'outline-secondary'}
                size="sm"
                className="rounded-pill text-nowrap px-3 py-1"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Post Feed */}
        {loading ? (
          <LoadingSpinner message="Loading farmer conversations..." />
        ) : posts.length === 0 ? (
          <div className="bg-white p-5 rounded-4 border text-center my-3">
            <h4>No Community Posts in this Category Yet</h4>
            <p className="text-muted small">Be the first farmer to start a conversation!</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {posts.map((post) => {
              const isLiked = post.likes?.includes(user?._id);
              const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80';

              return (
                <Card key={post._id} className="border shadow-sm rounded-4 overflow-hidden">
                  <Card.Body className="p-4">
                    {/* Author & Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={authorAvatar}
                          alt={post.author?.name}
                          className="rounded-circle border border-success"
                          style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{post.author?.name || 'Farmer'}</div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <FaMapMarkerAlt size={11} className="text-danger" />
                            <span>{post.author?.location?.district || 'Tamil Nadu'}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="success" className="px-2 py-1 rounded-pill">
                          {post.category}
                        </Badge>
                        <button
                          onClick={() => {
                            setReportingPostId(post._id);
                            setShowReportModal(true);
                          }}
                          className="btn btn-sm btn-link text-muted p-0"
                          title="Report post"
                        >
                          <FaFlag size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Body */}
                    <h5 className="fw-bold mb-2 text-dark">{post.title}</h5>
                    <p className="text-muted mb-3" style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {post.content}
                    </p>

                    {/* Post Images if any */}
                    {post.images?.length > 0 && (
                      <div className="rounded-3 overflow-hidden mb-3" style={{ maxHeight: '360px' }}>
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="badge bg-light text-muted border small">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions: Likes & Comments */}
                    <div className="d-flex align-items-center gap-4 pt-2 border-top">
                      <button
                        onClick={() => handleToggleLike(post._id)}
                        className={`btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 small ${isLiked ? 'text-danger fw-bold' : 'text-muted'}`}
                      >
                        {isLiked ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                        <span>{post.likes?.length || 0} Likes</span>
                      </button>

                      <button
                        onClick={() => handleToggleComments(post._id)}
                        className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 small text-muted"
                      >
                        <FaComment />
                        <span>{post.commentsCount || 0} Comments</span>
                      </button>
                    </div>

                    {/* Comments Dropdown */}
                    {activeCommentsPostId === post._id && (
                      <div className="mt-3 pt-3 border-top bg-light p-3 rounded-3">
                        <h6 className="fw-bold small mb-3">Farmer Discussion ({activeComments.length})</h6>

                        {commentsLoading ? (
                          <div className="small text-muted py-2 text-center">Loading comments...</div>
                        ) : activeComments.length === 0 ? (
                          <div className="small text-muted py-1">No comments yet. Write the first response!</div>
                        ) : (
                          <div className="d-flex flex-column gap-2 mb-3">
                            {activeComments.map((com) => (
                              <div key={com._id} className="bg-white p-2 rounded-2 border">
                                <div className="d-flex justify-content-between small text-muted mb-1">
                                  <strong>{com.author?.name}</strong>
                                  <span style={{ fontSize: '0.7rem' }}>{new Date(com.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="small text-dark">{com.content}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Input */}
                        {isAuthenticated ? (
                          <InputGroup size="sm">
                            <Form.Control
                              placeholder="Write a helpful agricultural reply..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                            />
                            <Button variant="success" onClick={() => handleAddComment(post._id)}>
                              <FaPaperPlane />
                            </Button>
                          </InputGroup>
                        ) : (
                          <div className="small text-muted text-center">
                            Please <a href="/login" className="text-success fw-bold">Login</a> to join the conversation.
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Post Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Create Farmer Community Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}
            <Form onSubmit={handleCreatePost}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Discussion Category</Form.Label>
                <Form.Select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {postCategories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Effective organic remedy for brinjal shoot borer..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Share your farming question or experience</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Describe crop details, symptoms observed, soil conditions, or field results..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Tags (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Paddy, Organic, Fertilizer, Thanjavur"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Attach Farm Photo (optional)</Form.Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPostImageFile(file);
                      setPostImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="form-control form-control-sm"
                />
                {postImagePreview && (
                  <div className="mt-2" style={{ maxHeight: '150px', overflow: 'hidden' }}>
                    <img src={postImagePreview} alt="Preview" className="rounded-2" style={{ height: '120px', objectFit: 'cover' }} />
                  </div>
                )}
              </Form.Group>

              <Button type="submit" className="btn-primary-green w-100 py-2 fw-bold" disabled={createSubmitting}>
                {createSubmitting ? 'Publishing...' : 'Publish to Forum'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Report Post Modal */}
        <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Report Inappropriate Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reportSuccess ? (
              <Alert variant="success">{reportSuccess}</Alert>
            ) : (
              <Form onSubmit={handleReportPost}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Reason for reporting</Form.Label>
                  <Form.Select value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                    <option value="">Select violation...</option>
                    <option value="Spam / Advertisements">Spam / Commercial Advertisements</option>
                    <option value="Misleading Agricultural Information">Misleading or Dangerous Chemical Advice</option>
                    <option value="Abusive Language">Abusive / Harassing Language</option>
                    <option value="Other">Other Policy Violation</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="danger" className="w-100">
                  Submit Report
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Community;

