import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaRobot,
  FaTractor,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaHandshake,
  FaArrowRight,
  FaLeaf,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaCloudSun,
  FaSeedling,
  FaUsers
} from 'react-icons/fa';
import { GiCow, GiCarrot, GiFertilizerBag } from 'react-icons/gi';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import LivestockCard from '../components/marketplace/LivestockCard.jsx';
import RentalCard from '../components/marketplace/RentalCard.jsx';
import LandCard from '../components/marketplace/LandCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import heroBgImage from '../assets/Golden Hour Village Farmland Panorama.png';

const Home = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryType, setCategoryType] = useState('marketplace');

  // Featured items state
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLivestock, setFeaturedLivestock] = useState([]);
  const [featuredRentals, setFeaturedRentals] = useState([]);
  const [featuredLands, setFeaturedLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, liveRes, rentRes, landRes] = await Promise.allSettled([
          api.get('/products?limit=4'),
          api.get('/livestock?limit=4'),
          api.get('/rentals?limit=3'),
          api.get('/lands?limit=3')
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.data.products) {
          setFeaturedProducts(prodRes.value.data.products);
        }
        if (liveRes.status === 'fulfilled' && liveRes.value.data.livestock) {
          setFeaturedLivestock(liveRes.value.data.livestock);
        }
        if (rentRes.status === 'fulfilled' && rentRes.value.data.rentals) {
          setFeaturedRentals(rentRes.value.data.rentals);
        }
        if (landRes.status === 'fulfilled' && landRes.value.data.lands) {
          setFeaturedLands(landRes.value.data.lands);
        }
      } catch (err) {
        console.warn('Error fetching homepage listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/${categoryType}?search=${encodeURIComponent(searchTerm)}`);
  };

  const categories = [
    {
      id: 'vegetables',
      title: t.categories.vegetables,
      desc: language === 'ta' ? 'புதிய அறுவடை தக்காளி, வெங்காயம் மற்றும் பழங்கள்' : 'Farm-fresh country vegetables & organic fruits',
      icon: <GiCarrot size={38} className="text-success" />,
      link: '/marketplace',
      bg: '#DCFCE7'
    },
    {
      id: 'livestock',
      title: t.categories.livestock,
      desc: language === 'ta' ? 'காங்கேயம் காளைகள், முர்ரா எருமைகள், ஆடுகள்' : 'Indigenous Kangeyam cattle, Murrah buffaloes & goats',
      icon: <GiCow size={38} className="text-secondary" />,
      link: '/livestock',
      bg: '#FEF3C7'
    },
    {
      id: 'rentals',
      title: t.categories.rentals,
      desc: language === 'ta' ? 'டிராக்டர்கள், அறுவடை இயந்திரங்கள் & ட்ரோன்கள்' : 'Tractors, combine harvesters & spraying drones',
      icon: <FaTractor size={38} className="text-primary" />,
      link: '/rentals',
      bg: '#DBEAFE'
    },
    {
      id: 'lands',
      title: t.categories.lands,
      desc: language === 'ta' ? 'மின்சார வசதியுடன் கூடிய விவசாய நிலங்கள்' : 'Verified fertile farmlands with free power & water',
      icon: <FaMapMarkedAlt size={38} className="text-success" />,
      link: '/lands',
      bg: '#E0E7FF'
    },
    {
      id: 'fertilizers',
      title: t.categories.fertilizers,
      desc: language === 'ta' ? 'இயற்கை உரம், பஞ்சகவ்யா, நுண்ணீர் பாசனம்' : 'Neem cake, Panchagavya & precision drip systems',
      icon: <GiFertilizerBag size={38} className="text-warning" />,
      link: '/fertilizers',
      bg: '#FFEDD5'
    },
    {
      id: 'aiDoctor',
      title: t.categories.aiDoctor,
      desc: language === 'ta' ? 'Google Gemini AI பயிர் நோய் கண்டறிதல்' : 'Instant crop disease diagnosis powered by Gemini AI',
      icon: <FaRobot size={38} className="text-danger" />,
      link: '/ai-doctor',
      bg: '#FCE7F3'
    }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section
        className="hero-wrapper text-center text-md-start"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(20, 83, 45, 0.90) 0%, rgba(22, 101, 52, 0.82) 100%), url("${heroBgImage}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Container>
          <Row className="align-items-center justify-content-between gy-4">
            <Col lg={7}>
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
                🌱 {t.tagline}
              </span>
              <h1 className="display-4 fw-bolder text-white mb-3" style={{ lineHeight: '1.15' }}>
                {t.heroTitle}
              </h1>
              <p className="lead text-light mb-4" style={{ opacity: 0.9, maxWidth: '600px' }}>
                {t.heroSubtitle}
              </p>

              {/* Universal Search Bar */}
              <div className="bg-white p-2 rounded-4 shadow-lg mb-4" style={{ maxWidth: '640px' }}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Select
                      value={categoryType}
                      onChange={(e) => setCategoryType(e.target.value)}
                      className="border-0 bg-light text-dark fw-semibold rounded-3 me-2"
                      style={{ maxWidth: '145px', cursor: 'pointer' }}
                    >
                      <option value="marketplace">Vegetables</option>
                      <option value="livestock">Livestock</option>
                      <option value="rentals">Rentals</option>
                      <option value="lands">Agri Lands</option>
                      <option value="fertilizers">Fertilizers</option>
                    </Form.Select>
                    <Form.Control
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 shadow-none ps-2"
                    />
                    <Button type="submit" className="btn-primary-green d-flex align-items-center gap-1 rounded-3 px-3">
                      <FaSearch /> <span className="d-none d-sm-inline">Search</span>
                    </Button>
                  </InputGroup>
                </Form>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link to="/marketplace" className="btn btn-accent-gold px-4 py-2 fw-bold shadow">
                  {t.exploreMarketplace}
                </Link>
                <Link to="/create-listing" className="btn btn-outline-light px-4 py-2 fw-semibold">
                  {t.listYourProduct}
                </Link>
                <Link to="/ai-doctor" className="btn btn-light text-success px-3 py-2 fw-bold d-flex align-items-center gap-2">
                  <FaRobot className="text-danger" /> {t.categories.aiDoctor}
                </Link>
              </div>
            </Col>

            {/* Hero Visual Card */}
            <Col lg={5} className="d-none d-lg-block">
              <div className="position-relative">
                <img
                  src={heroBgImage}
                  alt="Golden Hour Village Farmland Panorama"
                  className="rounded-4 shadow-2xl border border-3 border-white w-100"
                  style={{ height: '420px', objectFit: 'cover' }}
                />
                {/* Floating Metric 1 */}
                <div
                  className="position-absolute top-0 start-0 translate-middle-y bg-white p-3 rounded-4 shadow-lg d-flex align-items-center gap-3 ms-4"
                  style={{ borderLeft: '5px solid var(--secondary-green)' }}
                >
                  <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                    <FaSeedling size={24} />
                  </div>
                  <div>
                    <div className="fw-bolder fs-5 text-dark">100% Direct</div>
                    <small className="text-muted">Farmer to Consumer</small>
                  </div>
                </div>

                {/* Floating Metric 2 */}
                <div
                  className="position-absolute bottom-0 end-0 translate-middle-y bg-white p-3 rounded-4 shadow-lg d-flex align-items-center gap-3 me-3"
                  style={{ borderLeft: '5px solid var(--accent-gold)' }}
                >
                  <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle">
                    <FaRobot size={24} />
                  </div>
                  <div>
                    <div className="fw-bolder fs-5 text-dark">Gemini AI Vision</div>
                    <small className="text-muted">Plant Health Scanner</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. Six Core Categories Section */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <div className="text-center mb-5">
            <span className="section-badge">{language === 'ta' ? 'அனைத்தும் ஒரே இடத்தில்' : 'All In One Platform'}</span>
            <h2 className="section-title">{language === 'ta' ? 'முக்கிய வேளாண் பிரிவுகள்' : 'Ecosystem Categories'}</h2>
            <p className="section-subtitle">
              {language === 'ta'
                ? 'உங்கள் அனைத்து விவசாயத் தேவைகளுக்கும் நேரடி அணுகல்'
                : 'Browse through our specialized agricultural verticals tailored for farmers, agri-businesses, and buyers'}
            </p>
          </div>

          <Row className="g-4">
            {categories.map((cat) => (
              <Col lg={4} md={6} key={cat.id}>
                <Link to={cat.link} className="text-decoration-none text-dark">
                  <div className="category-card h-100 d-flex flex-column align-items-center text-center p-4">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-3 p-3 shadow-sm"
                      style={{ backgroundColor: cat.bg, width: '76px', height: '76px' }}
                    >
                      {cat.icon}
                    </div>
                    <h5 className="fw-bold mb-2">{cat.title}</h5>
                    <p className="text-muted small mb-3 flex-grow-1">{cat.desc}</p>
                    <div className="text-success fw-bold small d-flex align-items-center gap-1 mt-auto">
                      <span>Explore</span> <FaArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. Featured Vegetables & Produce */}
      <section className="py-5">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="section-badge">{language === 'ta' ? 'காய்கறிகள்' : 'Fresh Harvest'}</span>
              <h2 className="section-title">{language === 'ta' ? 'புதிய பண்ணை காய்கறிகள்' : 'Farm-Fresh Vegetables & Produce'}</h2>
              <p className="text-muted m-0">Harvested directly from Tamil Nadu farms with transparent pricing</p>
            </div>
            <Link to="/marketplace" className="btn btn-outline-green mt-3 mt-md-0 fw-semibold">
              View All Vegetables <FaArrowRight className="ms-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading fresh farm harvest..." />
          ) : (
            <Row className="g-4">
              {featuredProducts.map((product) => (
                <Col lg={3} md={6} sm={6} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* 4. AI Crop Disease Finder Promotional Banner */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #14532D 0%, #064E3B 100%)', color: '#FFFFFF' }}>
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
                <FaRobot className="me-1" /> {language === 'ta' ? 'செயற்கை நுண்ணறிவு மருத்துவர்' : 'AI Crop Pathology Scanner'}
              </span>
              <h2 className="display-6 fw-bold text-white mb-3">
                {t.sections.aiPromoTitle}
              </h2>
              <p className="lead text-light mb-4" style={{ opacity: 0.9 }}>
                {t.sections.aiPromoSubtitle}
              </p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-light">
                    <FaCheckCircle className="text-warning flex-shrink-0" />
                    <span>Instant leaf symptom detection</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-light">
                    <FaCheckCircle className="text-warning flex-shrink-0" />
                    <span>Organic & chemical dosage prescription</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-light">
                    <FaCheckCircle className="text-warning flex-shrink-0" />
                    <span>TNAU KVK benchmarked remedies</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-light">
                    <FaCheckCircle className="text-warning flex-shrink-0" />
                    <span>Diagnosis saved in user history</span>
                  </div>
                </div>
              </div>

              <Link to="/ai-doctor" className="btn btn-accent-gold px-4 py-2 fs-5 fw-bold shadow">
                {t.sections.tryAiFinder} <FaArrowRight className="ms-2" />
              </Link>
            </Col>

            <Col lg={5} className="text-center">
              <div className="bg-white p-3 rounded-4 shadow-2xl d-inline-block text-dark text-start" style={{ maxWidth: '380px' }}>
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
                  alt="AI Diagnostic Preview"
                  className="rounded-3 w-100 mb-3"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-danger">Detected: Early Blight</span>
                  <span className="badge bg-success">Confidence: 94%</span>
                </div>
                <h6 className="fw-bold mb-1">Tomato (Solanum lycopersicum)</h6>
                <p className="small text-muted mb-2">Concentric target-board circular brown spots with chlorotic yellow halo.</p>
                <div className="small bg-light p-2 rounded text-success fw-semibold">
                  Prescription: Mancozeb 75 WP (2.5g/L) foliar spray
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. Featured Livestock */}
      <section className="py-5" style={{ backgroundColor: '#F8FAF5' }}>
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="section-badge">{language === 'ta' ? 'கால்நடைகள்' : 'Indigenous Breeds'}</span>
              <h2 className="section-title">{language === 'ta' ? 'சிறந்த நாட்டு கால்நடைகள்' : 'Featured Livestock & Dairy Breeds'}</h2>
              <p className="text-muted m-0">Kangeyam bulls, Murrah dairy buffaloes, Jamnapari goats & fighting roosters</p>
            </div>
            <Link to="/livestock" className="btn btn-outline-green mt-3 mt-md-0 fw-semibold">
              View All Livestock <FaArrowRight className="ms-1" />
            </Link>
          </div>

          <Row className="g-4">
            {featuredLivestock.map((animal) => (
              <Col lg={3} md={6} sm={6} key={animal._id}>
                <LivestockCard animal={animal} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 6. Vehicle & Machinery Rentals */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="section-badge">{language === 'ta' ? 'வாடகை இயந்திரங்கள்' : 'Farm Mechanization'}</span>
              <h2 className="section-title">{language === 'ta' ? 'விவசாய இயந்திர வாடகை' : 'Agricultural Machinery & Equipment'}</h2>
              <p className="text-muted m-0">Hourly & daily rentals with verified drivers: tractors, harvesters & drones</p>
            </div>
            <Link to="/rentals" className="btn btn-outline-green mt-3 mt-md-0 fw-semibold">
              View All Rentals <FaArrowRight className="ms-1" />
            </Link>
          </div>

          <Row className="g-4">
            {featuredRentals.map((rental) => (
              <Col lg={4} md={6} key={rental._id}>
                <RentalCard equipment={rental} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 7. Agricultural Lands */}
      <section className="py-5">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="section-badge">{language === 'ta' ? 'விவசாய நிலங்கள்' : 'Land Marketplace'}</span>
              <h2 className="section-title">{language === 'ta' ? 'சான்றளிக்கப்பட்ட விளைநிலங்கள்' : 'Verified Agricultural Lands for Sale'}</h2>
              <p className="text-muted m-0">Clear patta, 24/7 water borewells, and free agricultural electricity connections</p>
            </div>
            <Link to="/lands" className="btn btn-outline-green mt-3 mt-md-0 fw-semibold">
              View All Farmlands <FaArrowRight className="ms-1" />
            </Link>
          </div>

          <Row className="g-4">
            {featuredLands.map((land) => (
              <Col lg={4} md={6} key={land._id}>
                <LandCard land={land} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 8. How MARUTHAM Works */}
      <section className="py-5" style={{ backgroundColor: '#F0FDF4' }}>
        <Container>
          <div className="text-center mb-5">
            <span className="section-badge">{t.sections.howItWorksTitle}</span>
            <h2 className="section-title">A Transparent 4-Step Ecosystem</h2>
            <p className="section-subtitle">{t.sections.howItWorksSubtitle}</p>
          </div>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center border">
                <div className="d-inline-flex p-3 bg-success bg-opacity-10 text-success rounded-circle mb-3 fs-3 fw-bold">
                  1
                </div>
                <h5 className="fw-bold mb-2">Farmer Lists Produce</h5>
                <p className="small text-muted m-0">
                  Farmers upload harvest details, quantity, asking price, and field location with pictures in seconds.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center border">
                <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-circle mb-3 fs-3 fw-bold">
                  2
                </div>
                <h5 className="fw-bold mb-2">Direct Buyer Connection</h5>
                <p className="small text-muted m-0">
                  Aggregators and consumers browse verified listings and connect directly via call or secure chat.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center border">
                <div className="d-inline-flex p-3 bg-info bg-opacity-10 text-info rounded-circle mb-3 fs-3 fw-bold">
                  3
                </div>
                <h5 className="fw-bold mb-2">Equipment & Land Access</h5>
                <p className="small text-muted m-0">
                  Book tractors or combine harvesters on-demand; explore title-verified agricultural lands with ease.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center border">
                <div className="d-inline-flex p-3 bg-danger bg-opacity-10 text-danger rounded-circle mb-3 fs-3 fw-bold">
                  4
                </div>
                <h5 className="fw-bold mb-2">AI Agronomy Support</h5>
                <p className="small text-muted m-0">
                  Continuous protection with Gemini AI crop disease diagnostics, weather alerts, and APMC mandi rates.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 9. Farmer Testimonials */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <div className="text-center mb-5">
            <span className="section-badge">{t.sections.farmerStoriesTitle}</span>
            <h2 className="section-title">Voices From the Soil</h2>
            <p className="section-subtitle">Real experiences from farmers who unlocked better prices and higher yields with MARUTHAM</p>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="p-4 rounded-4 border shadow-sm h-100">
                <FaQuoteLeft className="text-success mb-3" size={30} style={{ opacity: 0.3 }} />
                <p className="fst-italic text-muted mb-4">
                  "Before MARUTHAM, middle agents took 25% of our country tomato sales in the local market. Now I list my harvest directly and Chennai buyers purchase directly at my farm gate!"
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Farmer Selvakumar"
                    className="rounded-circle border border-2 border-success"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold">K. Selvakumar</div>
                    <small className="text-muted">Vegetable Farmer, Melur (Madurai)</small>
                  </div>
                </div>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card className="p-4 rounded-4 border shadow-sm h-100">
                <FaQuoteLeft className="text-success mb-3" size={30} style={{ opacity: 0.3 }} />
                <p className="fst-italic text-muted mb-4">
                  "I was able to sell my pure Kangeyam bull pair in less than 4 days to a proud organic farm in Pollachi. The transparent profile and direct calling made it completely hassle-free."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                    alt="Farmer Marimuthu"
                    className="rounded-circle border border-2 border-success"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold">M. Marimuthu</div>
                    <small className="text-muted">Cattle Breeder, Thanjavur</small>
                  </div>
                </div>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card className="p-4 rounded-4 border shadow-sm h-100">
                <FaQuoteLeft className="text-success mb-3" size={30} style={{ opacity: 0.3 }} />
                <p className="fst-italic text-muted mb-4">
                  "The AI crop disease scanner saved 2 acres of my chilli crop from whitefly leaf curl. It spotted the symptoms immediately and recommended yellow sticky traps with neem extract."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="P. Alagappan"
                    className="rounded-circle border border-2 border-success"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold">P. Alagappan</div>
                    <small className="text-muted">Progressive Farmer, Dindigul</small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 10. Call To Action Banner */}
      <section className="py-5" style={{ backgroundColor: 'var(--primary-green)', color: '#FFFFFF' }}>
        <Container>
          <div className="bg-opacity-10 bg-white p-5 rounded-5 border border-success text-center">
            <h2 className="display-6 fw-bold mb-3">{t.sections.ctaTitle}</h2>
            <p className="lead text-light mb-4 mx-auto" style={{ maxWidth: '650px', opacity: 0.9 }}>
              {t.sections.ctaSubtitle}
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/register" className="btn btn-accent-gold px-4 py-3 fw-bold fs-5 shadow">
                Join MARUTHAM Today
              </Link>
              <Link to="/create-listing" className="btn btn-outline-light px-4 py-3 fw-semibold fs-5">
                List Farm Produce Free
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;

