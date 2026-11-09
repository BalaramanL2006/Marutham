import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaRedo, FaLeaf, FaMapMarkerAlt, FaSortAmountDown } from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Marketplace = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(200);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        type: 'vegetables',
        page: 1,
        limit: 30
      };

      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (organicOnly) params.organic = 'true';
      if (location) params.location = location;
      if (maxPrice < 200) params.maxPrice = maxPrice;

      if (sortBy === 'price_asc') params.sort = 'price_asc';
      if (sortBy === 'price_desc') params.sort = 'price_desc';
      if (sortBy === 'rating') params.sort = 'rating';

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching vegetable marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, organicOnly, location, sortBy, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setOrganicOnly(false);
    setLocation('');
    setSortBy('newest');
    setMaxPrice(200);
    setSearchParams({});
  };

  return (
    <div className="marketplace-page py-4">
      <Container>
        {/* Header Breadcrumbs & Title */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <span className="section-badge mb-2">
                🌱 {language === 'ta' ? 'விவசாயிகள் நேரடி சந்தை' : 'Direct Farmer Produce Market'}
              </span>
              <h1 className="fw-bolder mb-1 fs-2">
                {language === 'ta' ? 'காய்கறி & பழங்கள் சந்தை' : 'Vegetables & Fruits Marketplace'}
              </h1>
              <p className="text-muted small m-0">
                Freshly harvested produce listed directly by verified Tamil Nadu farmers. No middlemen markups.
              </p>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <span className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold fs-6">
                {totalCount} {language === 'ta' ? 'விளைபொருட்கள் உள்ளன' : 'Listings Available'}
              </span>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          {/* Left Column: Filter Sidebar */}
          <Col lg={3}>
            <Card className="border shadow-sm rounded-4 p-3 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                  <FaFilter className="text-success" />
                  <span>{t.buttons.filter}</span>
                </h6>
                <button onClick={handleResetFilters} className="btn btn-link text-decoration-none p-0 small text-muted">
                  <FaRedo size={12} className="me-1" /> {t.buttons.reset}
                </button>
              </div>

              {/* Search Bar */}
              <Form onSubmit={handleSearchSubmit} className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Search Crops / Vegetables</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Tomato, Onion..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-end-0"
                  />
                  <Button type="submit" variant="outline-success" className="border-start-0">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>

              {/* Category Filter */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Category</Form.Label>
                <div className="d-flex flex-column gap-2">
                  {['All', 'Vegetables', 'Fruits'].map((cat) => (
                    <Form.Check
                      key={cat}
                      type="radio"
                      id={`cat-${cat}`}
                      name="cropCategory"
                      label={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="small"
                    />
                  ))}
                </div>
              </div>

              {/* Organic Checkbox */}
              <div className="mb-3 pb-2 border-bottom">
                <Form.Check
                  type="checkbox"
                  id="organic-check"
                  label={
                    <span className="small fw-semibold text-success d-flex align-items-center gap-1">
                      <FaLeaf size={12} /> {language === 'ta' ? 'இயற்கை முறையில் விளைந்தவை மட்டும்' : 'Organic Certified Only'}
                    </span>
                  }
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
              </div>

              {/* Location / District Filter */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Filter by District</Form.Label>
                <Form.Select value={location} onChange={(e) => setLocation(e.target.value)} size="sm">
                  <option value="">All Districts</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Dindigul">Dindigul</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Erode">Erode</option>
                  <option value="Salem">Salem</option>
                  <option value="Perambalur">Perambalur</option>
                </Form.Select>
              </div>

              {/* Max Price Slider */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span className="fw-semibold">Max Price / kg</span>
                  <span className="text-success fw-bold">₹{maxPrice}</span>
                </div>
                <Form.Range
                  min={10}
                  max={200}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="small fw-semibold text-muted">Sort By</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="sm">
                  <option value="newest">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Farmer Rating</option>
                </Form.Select>
              </div>
            </Card>
          </Col>

          {/* Right Column: Products Grid */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner message="Updating farm harvest catalog..." />
            ) : products.length === 0 ? (
              <div className="bg-white p-5 rounded-4 border text-center my-3">
                <div className="display-4 text-muted mb-3">🥕</div>
                <h4 className="fw-bold">No Produce Listings Found</h4>
                <p className="text-muted small mb-3">
                  Try adjusting your district or price filters, or be the first farmer to list this vegetable!
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

export default Marketplace;

