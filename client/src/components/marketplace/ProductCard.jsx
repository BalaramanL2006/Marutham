import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaShoppingCart, FaHeart, FaStar, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const image = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
  const displayImage = image.startsWith('/uploads') ? image : image;

  return (
    <Card className="marutham-card h-100 border-0">
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <Link to={`/products/${product._id}`}>
          <img
            src={displayImage}
            alt={product.title}
            className="card-img-zoom w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </Link>
        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          {product.isOrganic && (
            <span className="badge badge-organic">
              🌱 {language === 'ta' ? 'இயற்கை' : 'Organic'}
            </span>
          )}
          <span className="badge bg-dark bg-opacity-75 text-white" style={{ fontSize: '0.7rem' }}>
            {product.category}
          </span>
        </div>

        {/* Rating */}
        <div className="position-absolute bottom-0 end-0 m-2 bg-white px-2 py-1 rounded-pill shadow-sm d-flex align-items-center gap-1 small fw-bold">
          <FaStar className="text-warning" size={12} />
          <span>{product.rating || '4.8'}</span>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Location & Seller */}
        <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
          <span className="d-flex align-items-center text-truncate" style={{ maxWidth: '65%' }}>
            <FaMapMarkerAlt className="me-1 text-danger flex-shrink-0" size={12} />
            <span className="text-truncate">{product.location?.district || 'Tamil Nadu'}</span>
          </span>
          <span className="text-success fw-semibold small">
            {product.quantity > 0 ? `${product.quantity} ${product.unit} left` : 'Out of stock'}
          </span>
        </div>

        {/* Title */}
        <Card.Title as="h6" className="fw-bold mb-2" style={{ minHeight: '2.5rem', lineHeight: '1.3' }}>
          <Link to={`/products/${product._id}`} className="text-dark hover-green">
            {product.title}
          </Link>
        </Card.Title>

        {/* Price & Cart Action */}
        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{language === 'ta' ? 'விலை' : 'Price'}</div>
            <div className="fw-bolder fs-5 text-success">
              ₹{product.price} <span className="fs-6 text-muted fw-normal">/ {product.unit}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary-green btn-sm d-flex align-items-center gap-1 px-3 py-2"
            disabled={product.quantity <= 0}
            title="Add to Cart"
          >
            <FaShoppingCart size={13} />
            <span className="d-none d-sm-inline">{t.buttons.addToCart}</span>
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

