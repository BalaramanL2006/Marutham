import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTractor, FaCalendarAlt, FaUserCheck } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext.jsx';

const RentalCard = ({ equipment }) => {
  const { language, t } = useLanguage();
  const image = (equipment.images && equipment.images[0]) || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80';

  return (
    <Card className="marutham-card h-100 border-0">
      <div className="position-relative overflow-hidden" style={{ height: '210px' }}>
        <Link to={`/rentals/${equipment._id}`}>
          <img src={image} alt={equipment.title} className="card-img-zoom w-100 h-100" style={{ objectFit: 'cover' }} />
        </Link>
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          <Badge bg="dark" className="px-2 py-1 shadow-sm">
            {equipment.category}
          </Badge>
          {equipment.withDriver && (
            <Badge bg="info" text="dark" className="px-2 py-1 shadow-sm fw-bold">
              <FaUserCheck className="me-1" /> Driver Available
            </Badge>
          )}
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
          <span className="d-flex align-items-center text-truncate">
            <FaMapMarkerAlt className="me-1 text-danger" size={12} />
            <span>{equipment.location?.district || 'Tamil Nadu'}</span>
          </span>
          <span className="text-secondary fw-semibold">{equipment.powerHp || 'High Power'}</span>
        </div>

        <Card.Title as="h6" className="fw-bold mb-2 text-truncate" title={equipment.title}>
          <Link to={`/rentals/${equipment._id}`} className="text-dark hover-green">
            {equipment.title}
          </Link>
        </Card.Title>

        <p className="small text-muted mb-2 text-truncate">{equipment.brandModel}</p>

        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold fs-5 text-success">
              ₹{equipment.rentalPricePerHour} <span className="fs-6 text-muted fw-normal">/ hr</span>
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
              ₹{equipment.rentalPricePerDay} / day
            </div>
          </div>
          <Link to={`/rentals/${equipment._id}`} className="btn btn-primary-green btn-sm px-3 py-1">
            {t.buttons.bookNow}
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RentalCard;

