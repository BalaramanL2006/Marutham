import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaShieldAlt,
  FaUser,
  FaComments,
  FaHeart
} from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import LeafletMap from '../components/common/LeafletMap.jsx';

const LivestockDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/livestock/${id}`);
        if (res.data.success) {
          setAnimal(res.data.livestock);
          if (res.data.livestock.images?.length > 0) {
            setSelectedImage(res.data.livestock.images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching animal details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!animal?.seller?._id) return;

    try {
      await api.post('/messages', {
        recipientId: animal.seller._id,
        content: messageText || `Hello ${animal.seller.name}, I am interested in inspecting and purchasing "${animal.title}".`,
        itemContext: {
          itemType: 'livestock',
          itemId: animal._id,
          title: animal.title,
          price: animal.price,
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

  if (loading) return <LoadingSpinner message="Retrieving animal pedigree..." />;
  if (!animal) {
    return (
      <Container className="py-5 text-center">
        <h3>Livestock Listing Not Found</h3>
        <Link to="/livestock" className="btn btn-primary-green mt-3">Back to Livestock</Link>
      </Container>
    );
  }

  const sellerPhone = animal.sellerContact?.phone || animal.seller?.phone || '9842511223';
  const sellerName = animal.sellerContact?.name || animal.seller?.name || 'Livestock Breeder';

  return (
    <div className="livestock-detail-page py-4">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/livestock" className="text-muted">Livestock</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{animal.title}</li>
          </ol>
        </nav>

        <Row className="g-4 mb-4">
          {/* Photos */}
          <Col lg={6}>
            <Card className="border shadow-sm rounded-4 overflow-hidden p-2">
              <div className="rounded-3 overflow-hidden bg-light" style={{ height: '390px' }}>
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'}
                  alt={animal.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {animal.images?.length > 1 && (
                <div className="d-flex gap-2 mt-2 p-1 overflow-auto">
                  {animal.images.map((img, idx) => (
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

          {/* Info */}
          <Col lg={6}>
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-success px-3 py-1 rounded-pill fw-bold">
                  {animal.category} • {animal.breed}
                </span>
                <span className="badge bg-light text-dark border">
                  Status: Available
                </span>
              </div>

              <h2 className="fw-bolder mb-2 text-dark">{animal.title}</h2>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-3 small text-muted">
                <span className="d-flex align-items-center">
                  <FaMapMarkerAlt className="me-1 text-danger" />
                  {animal.location?.village ? `${animal.location.village}, ` : ''}{animal.location?.district}
                </span>
                <span>Gender: <strong>{animal.gender}</strong></span>
                <span>Age: <strong>{animal.age?.value} {animal.age?.unit}</strong></span>
                {animal.weightKg > 0 && <span>Weight: <strong>{animal.weightKg} kg</strong></span>}
              </div>

              {/* Price Box */}
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <div className="small text-muted">{language === 'ta' ? 'விலை' : 'Asking Price'}</div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-bold text-success">₹{animal.price.toLocaleString('en-IN')}</span>
                  {animal.isNegotiable && (
                    <span className="badge bg-warning text-dark">Price Negotiable</span>
                  )}
                </div>
              </div>

              {/* Milk Production if applicable */}
              {animal.milkProduction?.litersPerDay > 0 && (
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-3 text-primary d-flex align-items-center gap-3">
                  <GiMilkCarton size={32} />
                  <div>
                    <div className="fw-bold">Daily Milk Production: {animal.milkProduction.litersPerDay} Liters / Day</div>
                    <small className="text-muted">{animal.milkProduction.lactationCycle || 'Proven high fat content'}</small>
                  </div>
                </div>
              )}

              {/* Health & Vaccination */}
              <div className="mb-3">
                <h6 className="fw-bold mb-1 d-flex align-items-center gap-1 text-success">
                  <FaCheckCircle /> Health & Veterinary Status
                </h6>
                <p className="small text-muted mb-0">{animal.healthInfo}</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-bold mb-1">Breeder Description</h6>
                <p className="text-muted small" style={{ lineHeight: '1.7' }}>
                  {animal.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-3 border-top">
                <Row className="g-2">
                  <Col sm={6}>
                    <Button
                      onClick={() => setShowContactModal(true)}
                      className="btn-primary-green w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    >
                      <FaPhoneAlt /> {t.buttons.contactSeller}
                    </Button>
                  </Col>
                  <Col sm={6}>
                    <Button
                      onClick={() => setShowContactModal(true)}
                      className="btn-accent-gold w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    >
                      <FaComments /> Send In-App Enquiry
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Breeder Info & Map */}
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaUser className="text-success" />
                <span>Breeder / Livestock Owner</span>
              </h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={animal.seller?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'}
                  alt={sellerName}
                  className="rounded-circle border border-2 border-success"
                  style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-bold fs-6">{sellerName}</div>
                  <div className="small text-muted">{animal.seller?.role || 'Livestock Breeder'}</div>
                  <div className="badge bg-success bg-opacity-10 text-success small">✓ Verified Cattle Breeder</div>
                </div>
              </div>
              <p className="small text-muted mb-3">
                {animal.seller?.bio || 'Preserving native Tamil Nadu livestock bloodlines with organic fodder rearing.'}
              </p>
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex align-items-center gap-2">
                  <FaPhoneAlt className="text-success" />
                  <strong>+91 {sellerPhone}</strong>
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" />
                <span>Farm Location (OpenStreetMap)</span>
              </h5>
              <LeafletMap title={`${animal.title} - ${animal.location?.district}`} />
            </Card>
          </Col>
        </Row>

        {/* Contact Modal */}
        <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Contact Breeder: {sellerName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bg-light p-3 rounded-3 mb-3 text-center">
              <div className="small text-muted">Direct Phone Call:</div>
              <a href={`tel:${sellerPhone}`} className="fs-4 fw-bolder text-success text-decoration-none">
                📞 +91 {sellerPhone}
              </a>
              <div className="small text-muted mt-1">Farm visits welcome with prior phone appointment.</div>
            </div>

            <Form onSubmit={handleSendMessage}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Send Direct Message to Owner</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Hi ${sellerName}, I am interested in ${animal.title}. Can I visit your farm for veterinary health inspection?`}
                />
              </Form.Group>
              {messageSent && <div className="alert alert-success py-2 small">Enquiry sent to breeder inbox!</div>}
              <Button type="submit" className="btn-primary-green w-100">
                <FaComments className="me-2" /> Send Message
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default LivestockDetail;

