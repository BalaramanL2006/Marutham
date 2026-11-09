import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaPhoneAlt } from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';
import { useLanguage } from '../../context/LanguageContext.jsx';

const LivestockCard = ({ animal }) => {
  const { language, t } = useLanguage();
  const image = (animal.images && animal.images[0]) || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80';

  return (
    <Card className="marutham-card h-100 border-0">
      <div className="position-relative overflow-hidden" style={{ height: '210px' }}>
        <Link to={`/livestock/${animal._id}`}>
          <img src={image} alt={animal.title} className="card-img-zoom w-100 h-100" style={{ objectFit: 'cover' }} />
        </Link>
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          <Badge bg="success" className="px-2 py-1 shadow-sm">
            {animal.category}
          </Badge>
          <Badge bg="warning" text="dark" className="px-2 py-1 shadow-sm fw-bold">
            {animal.breed}
          </Badge>
        </div>
        {animal.vaccinationProof && (
          <div className="position-absolute bottom-0 start-0 m-2 bg-white bg-opacity-90 px-2 py-1 rounded-pill small fw-semibold text-success">
            ✓ Vaccinated
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
          <span className="d-flex align-items-center text-truncate">
            <FaMapMarkerAlt className="me-1 text-danger" size={12} />
            <span>{animal.location?.district || 'Tamil Nadu'}</span>
          </span>
          <span className="badge bg-light text-dark border">
            {animal.gender} • {animal.age?.value} {animal.age?.unit || 'yrs'}
          </span>
        </div>

        <Card.Title as="h6" className="fw-bold mb-2 text-truncate" title={animal.title}>
          <Link to={`/livestock/${animal._id}`} className="text-dark hover-green">
            {animal.title}
          </Link>
        </Card.Title>

        {animal.milkProduction?.litersPerDay > 0 && (
          <div className="d-flex align-items-center gap-1 small text-primary mb-2 bg-light p-1 rounded">
            <GiMilkCarton size={15} />
            <span>Milk Yield: <strong>{animal.milkProduction.litersPerDay} L / day</strong></span>
          </div>
        )}

        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{language === 'ta' ? 'விலை' : 'Price'}</div>
            <div className="fw-bolder fs-5 text-success">
              ₹{animal.price.toLocaleString('en-IN')}
            </div>
          </div>
          <Link to={`/livestock/${animal._id}`} className="btn btn-outline-green btn-sm px-3 py-1">
            {t.buttons.viewDetails}
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LivestockCard;

