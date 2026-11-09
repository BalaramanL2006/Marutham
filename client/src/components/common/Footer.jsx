import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLeaf, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext.jsx';

const Footer = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="mt-5 pt-5 pb-3 border-top" style={{ backgroundColor: '#0B2917', color: '#E2E8F0' }}>
      <Container>
        <Row className="gy-4">
          {/* Col 1: Brand Info */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center me-2 rounded-circle"
                style={{ width: '40px', height: '40px', backgroundColor: '#166534', color: '#EAB308' }}
              >
                <FaLeaf size={20} />
              </div>
              <h4 className="m-0 text-white fw-bold">{t.brand}</h4>
            </div>
            <p className="small text-light" style={{ opacity: 0.85, lineHeight: '1.7' }}>
              {language === 'ta'
                ? 'மருதம் என்பது தமிழ்நாட்டின் விவசாயிகள், கால்நடை வளர்ப்போர், வாடகை இயந்திரங்கள், விளைநிலங்கள் மற்றும் நுகர்வோரை இணைக்கும் முன்னோடி ஒருங்கிணைந்த வேளாண் இணைய தளம்.'
                : 'MARUTHAM is Tamil Nadu\'s premier integrated digital agriculture ecosystem uniting farmers, buyers, livestock breeders, equipment owners, and landowners through transparent technology.'}
            </p>
            <div className="d-flex align-items-center gap-2 mt-3 text-warning small">
              <FaShieldAlt /> <span>Government TNAU KVK Agronomy Guidelines Compliant</span>
            </div>
          </Col>

          {/* Col 2: Ecosystem Quick Links */}
          <Col lg={2} md={6} sm={6}>
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'சேவைகள்' : 'Ecosystem'}
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2" style={{ opacity: 0.85 }}>
              <li><Link to="/marketplace" className="text-light hover-gold">{t.categories.vegetables}</Link></li>
              <li><Link to="/livestock" className="text-light hover-gold">{t.categories.livestock}</Link></li>
              <li><Link to="/rentals" className="text-light hover-gold">{t.categories.rentals}</Link></li>
              <li><Link to="/lands" className="text-light hover-gold">{t.categories.lands}</Link></li>
              <li><Link to="/fertilizers" className="text-light hover-gold">{t.categories.fertilizers}</Link></li>
              <li><Link to="/ai-doctor" className="text-light hover-gold">{t.categories.aiDoctor}</Link></li>
            </ul>
          </Col>

          {/* Col 3: Resources & Community */}
          <Col lg={3} md={6} sm={6}>
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'அறிவுக் களஞ்சியம்' : 'Agri Intelligence'}
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2" style={{ opacity: 0.85 }}>
              <li><Link to="/knowledge" className="text-light hover-gold">{t.nav.knowledge}</Link></li>
              <li><Link to="/weather" className="text-light hover-gold">Mandi Daily Produce Prices</Link></li>
              <li><Link to="/weather" className="text-light hover-gold">Agro-Meteorological Forecasts</Link></li>
              <li><Link to="/community" className="text-light hover-gold">Tamil Nadu Farmers Forum</Link></li>
              <li><Link to="/create-listing" className="text-warning fw-semibold">Farmer Seller Registration</Link></li>
            </ul>
          </Col>

          {/* Col 4: Contact & Support */}
          <Col lg={3} md={6}>
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'தொடர்புக்கு' : 'Support & Helpline'}
            </h6>
            <div className="small d-flex flex-column gap-2 text-light" style={{ opacity: 0.85 }}>
              <div className="d-flex align-items-center">
                <FaPhoneAlt className="me-2 text-warning" />
                <span>+91 98425 11223 / 1800-425-166</span>
              </div>
              <div className="d-flex align-items-center">
                <FaEnvelope className="me-2 text-warning" />
                <span>support@marutham.agri</span>
              </div>
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 mt-1 text-warning" />
                <span>Madurai - Coimbatore Agri Corridor, Tamil Nadu, India</span>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }} />

        {/* Legal Disclaimer & Copyright */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted text-center text-md-start">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">MARUTHAM</strong> (மருதம்). All rights reserved.
          </div>
          <div style={{ maxWidth: '620px', fontSize: '0.75rem', opacity: 0.7 }}>
            Disclaimer: MARUTHAM connects farmers and rural businesses. All land documents and pesticide dosages should be independently verified through local revenue officers & KVK agronomy specialists before transactions.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

