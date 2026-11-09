import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBookOpen, FaSearch, FaClock, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const KnowledgeHub = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Crop Cultivation',
    'Soil Preparation',
    'Irrigation Methods',
    'Organic Farming',
    'Fertilizer Usage',
    'Pest Management',
    'Seasonal Farming Tips',
    'Government Schemes'
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;

      const res = await api.get('/articles', { params });
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="knowledge-hub-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col lg={8}>
              <span className="section-badge mb-2">
                📖 {language === 'ta' ? 'வேளாண் வழிகாட்டி & தொழில்நுட்பம்' : 'Agronomy & Learning Resource'}
              </span>
              <h1 className="display-6 fw-bolder mb-2">
                {language === 'ta' ? 'விவசாய அறிவுக் களஞ்சியம்' : 'Agriculture Knowledge Hub'}
              </h1>
              <p className="text-muted m-0">
                Scientifically verified cultivation manuals, organic formulation recipes, irrigation techniques, and Tamil Nadu government subsidy schemes.
              </p>
            </Col>
            <Col lg={4} className="mt-3 mt-lg-0">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search agronomy guides..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button type="submit" variant="success">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          {/* Categories Pill Bar */}
          <div className="d-flex gap-2 mt-4 overflow-auto pb-2">
            {categories.map((cat) => (
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

        {/* Articles List */}
        {loading ? (
          <LoadingSpinner message="Retrieving knowledge repository..." />
        ) : articles.length === 0 ? (
          <div className="bg-white p-5 rounded-4 border text-center my-3">
            <h4>No Articles Found for Selected Category</h4>
            <Button onClick={() => { setCategory('All'); setSearch(''); }} variant="outline-success" size="sm" className="mt-2">
              Show All Guides
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {articles.map((art) => (
              <Col lg={4} md={6} key={art._id}>
                <Card className="marutham-card h-100 border-0">
                  <div className="position-relative overflow-hidden" style={{ height: '210px' }}>
                    <Link to={`/knowledge/${art.slug}`}>
                      <img
                        src={art.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80'}
                        alt={art.title}
                        className="card-img-zoom w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    <div className="position-absolute top-0 start-0 m-2">
                      <Badge bg="success" className="px-2 py-1 shadow-sm">
                        {art.category}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                      <FaClock size={12} />
                      <span>{art.readTime || '5 min read'}</span>
                      <span>•</span>
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Card.Title as="h5" className="fw-bold mb-2">
                      <Link to={`/knowledge/${art.slug}`} className="text-dark hover-green">
                        {art.title}
                      </Link>
                    </Card.Title>

                    <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.6' }}>
                      {art.summary}
                    </p>

                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                      <small className="text-muted d-flex align-items-center gap-1">
                        <FaUser size={11} className="text-success" /> {art.author?.name || 'TNAU Scientist'}
                      </small>
                      <Link to={`/knowledge/${art.slug}`} className="text-success fw-bold small d-flex align-items-center gap-1">
                        Read Guide <FaArrowRight size={11} />
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default KnowledgeHub;

