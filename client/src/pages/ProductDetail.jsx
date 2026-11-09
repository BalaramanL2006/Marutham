import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaShoppingCart,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaLeaf,
  FaStar,
  FaCalendarAlt,
  FaShieldAlt,
  FaUser,
  FaMinus,
  FaPlus,
  FaComments
} from 'react-icons/fa';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import LeafletMap from '../components/common/LeafletMap.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          if (res.data.product.images?.length > 0) {
            setSelectedImage(res.data.product.images[0]);
          }
          if (res.data.product.minOrderQuantity) {
            setQuantity(res.data.product.minOrderQuantity);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!product?.seller?._id) return;

    try {
      await api.post('/messages', {
        recipientId: product.seller._id,
        content: messageText || `Hello ${product.seller.name}, I am interested in purchasing ${quantity} ${product.unit} of "${product.title}".`,
        itemContext: {
          itemType: 'product',
          itemId: product._id,
          title: product.title,
          price: product.price,
          image: selectedImage
        }
      });
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
        setShowContactModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading harvest details..." />;
  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h3>Product Not Found</h3>
        <Link to="/marketplace" className="btn btn-primary-green mt-3">Back to Marketplace</Link>
      </Container>
    );
  }

  const sellerPhone = product.sellerContact?.phone || product.seller?.phone || '9842511223';
  const sellerName = product.sellerContact?.name || product.seller?.name || 'Local Farmer';

  return (
    <div className="product-detail-page py-4">
      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/marketplace" className="text-muted">Marketplace</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
          </ol>
        </nav>

        <Row className="g-4 mb-4">
          {/* Left Column: Image Gallery */}
          <Col lg={6}>
            <Card className="border shadow-sm rounded-4 overflow-hidden p-2">
              <div className="rounded-3 overflow-hidden bg-light" style={{ height: '380px' }}>
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'}
                  alt={product.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="d-flex gap-2 mt-2 p-1 overflow-auto">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumb ${idx}`}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded-2 border ${selectedImage === img ? 'border-success border-2' : ''}`}
                      style={{ width: '70px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Right Column: Details & Pricing */}
          <Col lg={6}>
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-bold">
                  {product.category}
                </span>
                <span className="d-flex align-items-center gap-1 small fw-bold text-warning">
                  <FaStar /> {product.rating || '4.9'} ({product.reviewsCount || '15'} reviews)
                </span>
              </div>

              <h2 className="fw-bolder mb-2 text-dark">{product.title}</h2>

              {/* Badges & Location */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 small text-muted">
                <span className="d-flex align-items-center">
                  <FaMapMarkerAlt className="me-1 text-danger" />
                  {product.location?.city ? `${product.location.city}, ` : ''}{product.location?.district || 'Tamil Nadu'}
                </span>
                {product.isOrganic && (
                  <span className="badge badge-organic">
                    🌱 {language === 'ta' ? 'இயற்கை வேளாண்மை' : 'Certified Organic Farm'}
                  </span>
                )}
                {product.harvestDate && (
                  <span className="d-flex align-items-center gap-1">
                    <FaCalendarAlt className="text-secondary" />
                    Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Price Box */}
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <div className="small text-muted">{language === 'ta' ? 'நேரடி பண்ணை விலை' : 'Farm-Gate Asking Price'}</div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-bold text-success">₹{product.price}</span>
                  <span className="text-muted fw-semibold">/ {product.unit}</span>
                </div>
                <div className="small text-muted mt-1">
                  Available in Stock: <strong>{product.quantity} {product.unit}</strong> | Minimum Order: <strong>{product.minOrderQuantity || 1} {product.unit}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-bold mb-1">About This Harvest</h6>
                <p className="text-muted small" style={{ lineHeight: '1.7' }}>
                  {product.description}
                </p>
              </div>

              {/* Quantity Picker & Add to Cart */}
              <div className="mt-auto pt-3 border-top">
                <Row className="g-2 align-items-center mb-3">
                  <Col sm={4}>
                    <div className="d-flex align-items-center justify-content-between border rounded-3 p-1">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setQuantity(prev => Math.max(product.minOrderQuantity || 1, prev - 1))}
                      >
                        <FaMinus size={11} />
                      </Button>
                      <span className="fw-bold px-2">{quantity} {product.unit}</span>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                      >
                        <FaPlus size={11} />
                      </Button>
                    </div>
                  </Col>

                  <Col sm={4}>
                    <Button
                      onClick={() => addToCart(product, quantity)}
                      className="btn-primary-green w-100 d-flex align-items-center justify-content-center gap-2"
                      disabled={product.quantity <= 0}
                    >
                      <FaShoppingCart /> {t.buttons.addToCart}
                    </Button>
                  </Col>

                  <Col sm={4}>
                    <Button
                      onClick={() => setShowContactModal(true)}
                      className="btn-accent-gold w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaPhoneAlt /> {t.buttons.contactSeller}
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Farmer Info & Field Location Map */}
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaUser className="text-success" />
                <span>Farmer Information</span>
              </h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={product.seller?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                  alt={sellerName}
                  className="rounded-circle border border-2 border-success"
                  style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-bold fs-6">{sellerName}</div>
                  <div className="small text-muted">{product.seller?.role || 'Verified Farmer'}</div>
                  <div className="badge bg-success bg-opacity-10 text-success small">✓ Identity Verified</div>
                </div>
              </div>
              <p className="small text-muted mb-3">
                {product.seller?.bio || 'Dedicated organic vegetable cultivator adhering to good agricultural practices (GAP).'}
              </p>
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex align-items-center gap-2">
                  <FaPhoneAlt className="text-success" />
                  <strong>+91 {sellerPhone}</strong>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaEnvelope className="text-secondary" />
                  <span>{product.seller?.email || 'farmer@marutham.com'}</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" />
                <span>Harvest Origin Location (OpenStreetMap)</span>
              </h5>
              <LeafletMap title={`${product.title} - ${product.location?.district}`} />
            </Card>
          </Col>
        </Row>

        {/* Contact Farmer Modal */}
        <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Contact Farmer: {sellerName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bg-light p-3 rounded-3 mb-3 text-center">
              <div className="small text-muted">Direct Calling Number:</div>
              <a href={`tel:${sellerPhone}`} className="fs-4 fw-bolder text-success text-decoration-none">
                📞 +91 {sellerPhone}
              </a>
              <div className="small text-muted mt-1">Available 7:00 AM – 8:00 PM</div>
            </div>

            <Form onSubmit={handleSendMessage}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Send Direct In-App Message / Enquiry</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Hi ${sellerName}, I would like to purchase ${quantity} ${product.unit} of ${product.title}. Please confirm delivery.`}
                />
              </Form.Group>
              {messageSent && <div className="alert alert-success py-2 small">Message sent to farmer inbox!</div>}
              <Button type="submit" className="btn-primary-green w-100">
                <FaComments className="me-2" /> Send Enquiry Message
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default ProductDetail;

