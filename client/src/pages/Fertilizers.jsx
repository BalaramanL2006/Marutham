import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaRedo, FaLeaf, FaShieldAlt } from 'react-icons/fa';
import { GiFertilizerBag } from 'react-icons/gi';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Fertilizers = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const fetchFertilizers = async () => {
    try {
      setLoading(true);
      const params = {
        type: 'fertilizers',
        page: 1,
        limit: 30
      };

      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (organicOnly) params.organic = 'true';

      if (sortBy === 'price_asc') params.sort = 'price_asc';
      if (sortBy === 'price_desc') params.sort = 'price_desc';
      if (sortBy === 'rating') params.sort = 'rating';

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching fertilizers & farming products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFertilizers();
  }, [category, organicOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFertilizers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setOrganicOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const fertilizerCategories = [
    'All',
    'Organic Fertilizers',
    'Chemical Fertilizers',
    'Seeds',
    'Pesticides',
    'Farming Tools',
    'Irrigation Equipment',
    'Crop Protection'
  ];

  return (
    <div className="fertilizers-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <span className="section-badge mb-2">
                🌱 {language === 'ta' ? 'வேளாண் இடுபொருட்கள்' : 'Farm Inputs & Agro Equipment'}
              </span>
              <h1 className="fw-bolder mb-1 fs-2">
                {language === 'ta' ? 'உரங்கள், விதைகள் & விவசாய பொருட்கள்' : 'Fertilizers, Seeds & Farm Products'}
              </h1>
              <p className="text-muted small m-0">
                Procure 100% genuine cold-pressed neem cake, bio-fertilizers, high-germination hybrid seeds, and precision drip irrigation hardware.
              </p>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <span className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold fs-6">
                {totalCount} {language === 'ta' ? 'பொருட்கள் உள்ளன' : 'Products Available'}
              </span>
            </Col>
          </Row>

          <div className="mt-3 p-2 px-3 bg-light border rounded-3 small text-muted d-flex align-items-center gap-2">
            <FaShieldAlt className="text-success" />
            <span>
              <strong>Quality Assurance:</strong> All chemical fertilizers and crop protection sprays must be sold exclusively by licensed agro-dealers following statutory pesticide standards.
            </span>
          </div>
        </div>

        <Row className="g-4">
          {/* Sidebar */}
          <Col lg={3}>
            <Card className="border shadow-sm rounded-4 p-3 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                  <FaFilter className="text-success" />
                  <span>Filters</span>
                </h6>
                <button onClick={handleResetFilters} className="btn btn-link text-decoration-none p-0 small text-muted">
                  <FaRedo size={12} className="me-1" /> Reset
                </button>
              </div>

              {/* Search */}
              <Form onSubmit={handleSearchSubmit} className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Search Farm Inputs</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Neem Cake, Drip, Seeds..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button type="submit" variant="outline-success">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>

              {/* Category */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Category</Form.Label>
                <div className="d-flex flex-column gap-2">
                  {fertilizerCategories.map((cat) => (
                    <Form.Check
                      key={cat}
                      type="radio"
                      id={`fert-cat-${cat}`}
                      name="fertCategory"
                      label={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="small"
                    />
                  ))}
                </div>
              </div>

              {/* Organic Only */}
              <div className="mb-3 pb-2 border-bottom">
                <Form.Check
                  type="checkbox"
                  id="fert-organic-check"
                  label={
                    <span className="small fw-semibold text-success d-flex align-items-center gap-1">
                      <FaLeaf size={12} /> 100% Bio & Organic Only
                    </span>
                  }
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="small fw-semibold text-muted">Sort By</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="sm">
                  <option value="newest">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </Form.Select>
              </div>
            </Card>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner message="Loading agricultural supplies..." />
            ) : products.length === 0 ? (
              <div className="bg-white p-5 rounded-4 border text-center my-3">
                <div className="display-4 text-muted mb-3">🌱</div>
                <h4 className="fw-bold">No Products Matching Criteria</h4>
                <p className="text-muted small mb-3">
                  Try clearing your search keyword or selected category.
                </p>
                <Button onClick={handleResetFilters} variant="outline-success" size="sm">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <Row className="g-3">
                {products.map((product) => (
                  <Col md={4} sm={6} key={product._id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Fertilizers;

