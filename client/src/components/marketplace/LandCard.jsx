import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTint, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext.jsx';

const LandCard = ({ land }) => {
  const { language, t } = useLanguage();
  const image = (land.images && land.images[0]) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';

  return (
    <Card className="marutham-card h-100 border-0">
      <div className="position-relative overflow-hidden" style={{ height: '210px' }}>
        <Link to={`/lands/${land._id}`}>
          <img src={image} alt={land.title} className="card-img-zoom w-100 h-100" style={{ objectFit: 'cover' }} />
        </Link>
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          <Badge bg="success" className="px-2 py-1 shadow-sm">
            {land.totalArea} {land.areaUnit}
          </Badge>
          <Badge bg="warning" text="dark" className="px-2 py-1 shadow-sm fw-bold">
            {land.soilType}
          </Badge>
        </div>
        {land.isVerifiedListing && (
          <div className="position-absolute bottom-0 end-0 m-2 bg-white bg-opacity-90 px-2 py-1 rounded-pill small fw-semibold text-success d-flex align-items-center gap-1">
            <FaShieldAlt size={11} /> Verified Title
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
          <span className="d-flex align-items-center text-truncate">
            <FaMapMarkerAlt className="me-1 text-danger" size={12} />
            <span>{land.location?.village ? `${land.location.village}, ` : ''}{land.location?.district}</span>
          </span>
          {land.freeElectricity && (
            <span className="text-warning fw-semibold d-flex align-items-center gap-1" title="Free Agri Electricity Connection">
              <FaBolt size={11} /> Free Power
            </span>
          )}
        </div>

        <Card.Title as="h6" className="fw-bold mb-2 text-truncate" title={land.title}>
          <Link to={`/lands/${land._id}`} className="text-dark hover-green">
            {land.title}
          </Link>
        </Card.Title>

        <div className="small text-muted d-flex align-items-center gap-2 mb-2 bg-light p-1 rounded">
          <FaTint className="text-primary" />
          <span>Water: <strong>{land.waterSource}</strong></span>
        </div>

        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{language === 'ta' ? 'மொத்த விலை' : 'Total Price'}</div>
            <div className="fw-bolder fs-5 text-success">
              ₹{(land.price / 100000).toFixed(1)} Lakhs
            </div>
          </div>
          <Link to={`/lands/${land._id}`} className="btn btn-outline-green btn-sm px-3 py-1">
            {t.buttons.viewDetails}
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LandCard;

