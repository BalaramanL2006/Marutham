import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaRedo, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LivestockCard from '../components/marketplace/LivestockCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Livestock = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('All');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchLivestock = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 30 };

      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (breed) params.breed = breed;
      if (gender && gender !== 'All') params.gender = gender;
      if (location) params.location = location;

      if (sortBy === 'price_asc') params.sort = 'price_asc';
      if (sortBy === 'price_desc') params.sort = 'price_desc';

      const res = await api.get('/livestock', { params });
      if (res.data.success) {
        setAnimals(res.data.livestock);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching livestock:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, [category, gender, location, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLivestock();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setBreed('');
    setGender('All');
    setLocation('');
    setSortBy('newest');
    setSearchParams({});
  };

  const animalCategories = ['All', 'Cows', 'Buffaloes', 'Goats', 'Sheep', 'Chickens', 'Other'];

  return (
    <div className="livestock-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <span className="section-badge mb-2">
                🐄 {language === 'ta' ? 'நாட்டு கால்நடைகள் சந்தை' : 'Indigenous Cattle & Livestock Fair'}
              </span>
              <h1 className="fw-bolder mb-1 fs-2">
                {language === 'ta' ? 'கால்நடைகள் சந்தை' : 'Livestock Marketplace'}
              </h1>
              <p className="text-muted small m-0">
                Buy and sell pure indigenous breed cattle, high-yield dairy buffaloes, and breeding goats directly from pastoral farmers.
              </p>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <span className="badge bg-warning text-dark p-2 px-3 rounded-pill fw-bold fs-6">
                {totalCount} {language === 'ta' ? 'கால்நடைகள் உள்ளன' : 'Animals Available'}
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
                <Form.Label className="small fw-semibold text-muted">Search Animal / Breed</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Kangeyam, Murrah..."
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
                  {animalCategories.map((cat) => (
                    <Form.Check
                      key={cat}
                      type="radio"
                      id={`animal-cat-${cat}`}
                      name="animalCategory"
                      label={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="small"
                    />
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Gender</Form.Label>
                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} size="sm">
                  <option value="All">All Genders</option>
                  <option value="Male">Male / Bull</option>
                  <option value="Female">Female / Cow</option>
                  <option value="Pair">Pair / Pair Team</option>
                </Form.Select>
              </div>

              {/* District */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">District</Form.Label>
                <Form.Select value={location} onChange={(e) => setLocation(e.target.value)} size="sm">
                  <option value="">All Tamil Nadu</option>
                  <option value="Tiruppur">Tiruppur (Kangeyam)</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Tenkasi">Tenkasi</option>
                  <option value="Erode">Erode</option>
                  <option value="Dindigul">Dindigul</option>
                </Form.Select>
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="small fw-semibold text-muted">Sort By Price</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="sm">
                  <option value="newest">Recently Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </Form.Select>
              </div>
            </Card>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner message="Searching registered livestock..." />
            ) : animals.length === 0 ? (
              <div className="bg-white p-5 rounded-4 border text-center my-3">
                <div className="display-4 text-muted mb-3">🐂</div>
                <h4 className="fw-bold">No Livestock Listings Found</h4>
                <p className="text-muted small mb-3">
                  Try adjusting the breed or district filters, or register your cattle on MARUTHAM today.
                </p>
                <Button onClick={handleResetFilters} variant="outline-success" size="sm">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <Row className="g-3">
                {animals.map((animal) => (
                  <Col md={4} sm={6} key={animal._id}>
                    <LivestockCard animal={animal} />
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

export default Livestock;

