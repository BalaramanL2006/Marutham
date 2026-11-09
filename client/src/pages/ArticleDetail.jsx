import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaUser, FaTag, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import api from '../services/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${slug}`);
        if (res.data.success) {
          setArticle(res.data.article);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Opening agronomy guide..." />;
  if (!article) {
    return (
      <Container className="py-5 text-center">
        <h3>Article Not Found</h3>
        <Link to="/knowledge" className="btn btn-primary-green mt-3">Back to Knowledge Hub</Link>
      </Container>
    );
  }

  return (
    <div className="article-detail-page py-4">
      <Container style={{ maxWidth: '880px' }}>
        <Link to="/knowledge" className="text-decoration-none small text-success fw-bold d-inline-flex align-items-center gap-1 mb-3">
          <FaArrowLeft /> Back to Agriculture Guide
        </Link>

        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
          <Badge bg="success" className="px-3 py-1 rounded-pill mb-3">
            {article.category}
          </Badge>

          <h1 className="fw-bolder mb-3 text-dark">{article.title}</h1>

          <div className="d-flex flex-wrap align-items-center gap-3 text-muted small pb-3 mb-4 border-bottom">
            <span className="d-flex align-items-center gap-1">
              <FaUser className="text-success" />
              <strong>{article.author?.name}</strong> ({article.author?.role})
            </span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <FaClock /> {article.readTime}
            </span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Banner Image */}
          <div className="rounded-4 overflow-hidden mb-4" style={{ height: '380px' }}>
            <img
              src={article.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80'}
              alt={article.title}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Lead Summary */}
          <p className="lead fw-semibold text-dark p-3 rounded-3 bg-light border-start border-4 border-success mb-4">
            {article.summary}
          </p>

          {/* Article Full Content formatted */}
          <div className="article-body text-dark" style={{ lineHeight: '1.9', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
            {article.content}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="mt-5 pt-3 border-top d-flex flex-wrap gap-2 align-items-center">
              <FaTag className="text-muted me-1" />
              {article.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ArticleDetail;

