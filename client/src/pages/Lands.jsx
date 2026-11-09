import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaRedo, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LandCard from '../components/marketplace/LandCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Lands = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [soilType, setSoilType] = useState('All');
  const [waterSource, setWaterSource] = useState('All');
  const [district, setDistrict] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchLands = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 30 };

      if (search) params.search = search;
      if (soilType && soilType !== 'All') params.soilType = soilType;
      if (waterSource && waterSource !== 'All') params.waterSource = waterSource;
      if (district) params.district = district;

      if (sortBy === 'price_asc') params.sort = 'price_asc';
      if (sortBy === 'price_desc') params.sort = 'price_desc';
      if (sortBy === 'area_asc') params.sort = 'area_asc';
      if (sortBy === 'area_desc') params.sort = 'area_desc';

      const res = await api.get('/lands', { params });
      if (res.data.success) {
        setLands(res.data.lands);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching land listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [soilType, waterSource, district, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLands();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSoilType('All');
    setWaterSource('All');
    setDistrict('');
    setSortBy('newest');
    setSearchParams({});
  };

  const soilTypes = ['All', 'Red Soil', 'Black Cotton Soil', 'Alluvial Soil', 'Clay Loam', 'Sandy Loam'];
  const waterSources = ['All', 'Borewell Available', 'Open Well', 'Canal Irrigation', 'River Water Access', 'Rainfed Only'];

  return (
    <div className="lands-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <span className="section-badge mb-2">
                🌾 {language === 'ta' ? 'விவசாய விளைநிலங்கள் தளம்' : 'Verified Agricultural Farmland Portal'}
              </span>
              <h1 className="fw-bolder mb-1 fs-2">
                {language === 'ta' ? 'விவசாய நிலங்கள் சந்தை' : 'Agricultural Land Marketplace'}
              </h1>
              <p className="text-muted small m-0">
                Buy and sell fertile agricultural plots, coconut groves, delta paddy lands, and organic farms across Tamil Nadu.
              </p>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <span className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold fs-6">
                {totalCount} {language === 'ta' ? 'நிலங்கள் விற்பனைக்கு உள்ளன' : 'Properties Listed'}
              </span>
            </Col>
          </Row>

          {/* Mandatory Legal Disclaimer Bar */}
          <div className="mt-3 p-2 px-3 bg-warning bg-opacity-10 border border-warning rounded-3 small text-dark d-flex align-items-center gap-2">
            <FaShieldAlt className="text-warning flex-shrink-0" />
            <span>
              <strong>Legal Notice:</strong> MARUTHAM is a digital discovery ecosystem. All revenue documents (Patta, Chitta, FMB, Encumbrance Certificate) must be independently investigated and verified with legal counsel prior to monetary transactions.
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
                <Form.Label className="small fw-semibold text-muted">Search Land by Keyword</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Red Soil, Borewell..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button type="submit" variant="outline-success">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>

              {/* Soil Type */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Soil Type</Form.Label>
                <div className="d-flex flex-column gap-2">
                  {soilTypes.map((type) => (
                    <Form.Check
                      key={type}
                      type="radio"
                      id={`soil-${type}`}
                      name="soilGroup"
                      label={type}
                      checked={soilType === type}
                      onChange={() => setSoilType(type)}
                      className="small"
                    />
                  ))}
                </div>
              </div>

              {/* Water Source */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Water Availability</Form.Label>
                <Form.Select value={waterSource} onChange={(e) => setWaterSource(e.target.value)} size="sm">
                  {waterSources.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </Form.Select>
              </div>

              {/* District */}
              <div className="mb-3">
                <Form.Label className="small fw-semibold text-muted">District</Form.Label>
                <Form.Select value={district} onChange={(e) => setDistrict(e.target.value)} size="sm">
                  <option value="">All Tamil Nadu</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Coimbatore">Coimbatore (Pollachi)</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Theni">Theni</option>
                  <option value="Dindigul">Dindigul</option>
                </Form.Select>
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="small fw-semibold text-muted">Sort By</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="sm">
                  <option value="newest">Recently Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: Largest First</option>
                  <option value="area_asc">Area: Smallest First</option>
                </Form.Select>
              </div>
            </Card>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner message="Locating verified farmlands..." />
            ) : lands.length === 0 ? (
              <div className="bg-white p-5 rounded-4 border text-center my-3">
                <div className="display-4 text-muted mb-3">🏞️</div>
                <h4 className="fw-bold">No Farmlands Matching Your Criteria</h4>
                <p className="text-muted small mb-3">
                  Try broadening your soil type or water source filters.
                </p>
                <Button onClick={handleResetFilters} variant="outline-success" size="sm">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <Row className="g-3">
                {lands.map((land) => (
                  <Col md={4} sm={6} key={land._id}>
                    <LandCard land={land} />
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

export default Lands;

