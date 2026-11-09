import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaRedo, FaTractor, FaUserCheck } from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import RentalCard from '../components/marketplace/RentalCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Rentals = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [withDriverOnly, setWithDriverOnly] = useState(false);
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 30 };

      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (withDriverOnly) params.withDriver = 'true';
      if (location) params.location = location;

      if (sortBy === 'price_asc') params.sort = 'price_asc';
      if (sortBy === 'price_desc') params.sort = 'price_desc';

      const res = await api.get('/rentals', { params });
      if (res.data.success) {
        setRentals(res.data.rentals);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [category, withDriverOnly, location, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRentals();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setWithDriverOnly(false);
    setLocation('');
    setSortBy('newest');
    setSearchParams({});
  };

  const rentalCategories = [
    'All',
    'Tractors',
    'Harvesters',
    'Rotavators',
    'Agricultural Drones',
    'Seed Sowing Machines',
    'Sprayers',
    'Other'
  ];

  return (
    <div className="rentals-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <span className="section-badge mb-2">
                🚜 {language === 'ta' ? 'விவசாய இயந்திர வாடகை தளம்' : 'Custom Hiring Center Fleet'}
              </span>
              <h1 className="fw-bolder mb-1 fs-2">
                {language === 'ta' ? 'வாடகை விவசாய வாகனங்கள்' : 'Agricultural Vehicle & Machinery Rentals'}
              </h1>
              <p className="text-muted small m-0">
                On-demand hiring of heavy-duty tractors, combine rubber-track harvesters, drone spray rigs, and sowing machinery.
              </p>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <span className="badge bg-primary bg-opacity-10 text-primary p-2 px-3 rounded-pill fw-bold fs-6">
                {totalCount} {language === 'ta' ? 'இயந்திரங்கள் வாடகைக்கு உள்ளன' : 'Machines Available'}
              </span>
            </Col>
          </Row>
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
                <Form.Label className="small fw-semibold text-muted">Search Machinery</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Tractor, Drone..."
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
                  {rentalCategories.map((cat) => (
                    <Form.Check
                      key={cat}
                      type="radio"
                      id={`rental-cat-${cat}`}
                      name="rentalCategory"
                      label={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="small"
                    />
                  ))}
                </div>
              </div>

              {/* With Driver Checkbox */}
              <div className="mb-3 pb-2 border-bottom">
                <Form.Check
                  type="checkbox"
                  id="driver-check"
                  label={
                    <span className="small fw-semibold text-primary d-flex align-items-center gap-1">
                      <FaUserCheck size={13} /> Driver / Operator Included
                    </span>
                  }
                  checked={withDriverOnly}
                  onChange={(e) => setWithDriverOnly(e.target.checked)}
                />
              </div>

              {/* District */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">District</Form.Label>
                <Form.Select value={location} onChange={(e) => setLocation(e.target.value)} size="sm">
                  <option value="">All Districts</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Coimbatore">Coimbatore (Pollachi)</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Tiruchirappalli">Trichy</option>
                  <option value="Erode">Erode</option>
                </Form.Select>
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="small fw-semibold text-muted">Sort By Rate</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="sm">
                  <option value="newest">Latest Machinery</option>
                  <option value="price_asc">Price / Day: Low to High</option>
                  <option value="price_desc">Price / Day: High to Low</option>
                </Form.Select>
              </div>
            </Card>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner message="Scanning equipment fleets..." />
            ) : rentals.length === 0 ? (
              <div className="bg-white p-5 rounded-4 border text-center my-3">
                <div className="display-4 text-muted mb-3">🚜</div>
                <h4 className="fw-bold">No Machinery Available for Selected Filter</h4>
                <p className="text-muted small mb-3">
                  Try adjusting the district filter or contact our fleet coordinator.
                </p>
                <Button onClick={handleResetFilters} variant="outline-success" size="sm">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <Row className="g-3">
                {rentals.map((rental) => (
                  <Col md={4} sm={6} key={rental._id}>
                    <RentalCard equipment={rental} />
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

export default Rentals;

