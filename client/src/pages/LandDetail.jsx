import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTint,
  FaBolt,
  FaRoad,
  FaFileContract,
  FaShieldAlt,
  FaCheckCircle,
  FaSeedling,
  FaComments,
  FaUser
} from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import LeafletMap from '../components/common/LeafletMap.jsx';

const LandDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();

  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lands/${id}`);
        if (res.data.success) {
          setLand(res.data.land);
          if (res.data.land.images?.length > 0) {
            setSelectedImage(res.data.land.images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching land listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLand();
  }, [id]);

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    if (!land?.seller?._id) return;

    try {
      await api.post('/messages', {
        recipientId: land.seller._id,
        content: enquiryMessage || `Hello ${land.seller.name}, I am interested in scheduling a site visit for "${land.title}".`,
        itemContext: {
          itemType: 'land',
          itemId: land._id,
          title: land.title,
          price: land.price,
          image: selectedImage
        }
      });
      setEnquirySent(true);
      setTimeout(() => {
        setEnquirySent(false);
        setShowContactModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error sending enquiry:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading land revenue records..." />;
  if (!land) {
    return (
      <Container className="py-5 text-center">
        <h3>Land Listing Not Found</h3>
        <Link to="/lands" className="btn btn-primary-green mt-3">Back to Lands</Link>
      </Container>
    );
  }

  const ownerPhone = land.sellerContact?.phone || land.seller?.phone || '9842511223';
  const ownerName = land.sellerContact?.name || land.seller?.name || 'Landowner';

  return (
    <div className="land-detail-page py-4">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/lands" className="text-muted">Lands</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{land.title}</li>
          </ol>
        </nav>

        {/* Mandatory Legal Notice */}
        <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-4 mb-4 small text-dark d-flex align-items-start gap-3">
          <FaShieldAlt className="text-warning mt-1 flex-shrink-0" size={20} />
          <div>
            <h6 className="fw-bold mb-1 text-dark">Mandatory Real Estate Due Diligence Notice</h6>
            <p className="m-0 text-muted" style={{ lineHeight: '1.6' }}>
              {land.legalDisclaimer ||
                'MARUTHAM acts as an open agricultural marketplace connecting landholders and buyers. All land measurements, patta entries, chitta extracts, Nil-Encumbrance certificates (EC), and groundwater reports must be verified independently with the sub-registrar office and licensed revenue surveyors prior to financial deposits.'}
            </p>
          </div>
        </div>

        <Row className="g-4 mb-4">
          {/* Photos */}
          <Col lg={7}>
            <Card className="border shadow-sm rounded-4 overflow-hidden p-2 mb-3">
              <div className="rounded-3 overflow-hidden bg-light" style={{ height: '400px' }}>
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                  alt={land.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {land.images?.length > 1 && (
                <div className="d-flex gap-2 mt-2 p-1 overflow-auto">
                  {land.images.map((img, idx) => (
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

            {/* Comprehensive Property Details */}
            <Card className="border shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">Land Description & Agronomic Suitability</h5>
              <p className="text-muted small mb-4" style={{ lineHeight: '1.8' }}>
                {land.description}
              </p>

              {/* Crop Suitability */}
              {land.cropSuitability?.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2 d-flex align-items-center gap-1 text-success">
                    <FaSeedling /> Ideal Crops for this Soil & Climate
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {land.cropSuitability.map((crop, idx) => (
                      <span key={idx} className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill">
                        ✓ {crop}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Documents */}
              {land.documentsAvailable?.length > 0 && (
                <div>
                  <h6 className="fw-bold mb-2 d-flex align-items-center gap-1 text-primary">
                    <FaFileContract /> Ready Documentation & Revenue Records
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {land.documentsAvailable.map((doc, idx) => (
                      <span key={idx} className="badge bg-light text-dark border p-2 px-3 rounded-pill">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Right Column: Pricing & Key Attributes */}
          <Col lg={5}>
            <Card className="border shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge bg="success" className="px-3 py-1 rounded-pill">
                  {land.totalArea} {land.areaUnit}
                </Badge>
                <Badge bg="warning" text="dark" className="px-3 py-1 rounded-pill fw-bold">
                  {land.soilType}
                </Badge>
              </div>

              <h3 className="fw-bolder mb-2">{land.title}</h3>

              <div className="d-flex align-items-center gap-2 small text-muted mb-3">
                <FaMapMarkerAlt className="text-danger" />
                <span>
                  {land.location?.village ? `${land.location.village}, ` : ''}
                  {land.location?.taluk ? `${land.location.taluk}, ` : ''}
                  {land.location?.district}, Tamil Nadu
                </span>
              </div>

              {/* Price Box */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="small text-muted">{language === 'ta' ? 'மொத்த கேட்கப்படும் தொகை' : 'Total Asking Price'}</div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-bold text-success">
                    ₹{(land.price / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="small text-muted mt-1">
                  Rate: <strong>₹{Math.round(land.price / land.totalArea).toLocaleString('en-IN')}</strong> / {land.areaUnit}
                </div>
              </div>

              {/* Attributes Checklist */}
              <div className="d-flex flex-column gap-2 mb-4 small">
                <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaTint className="text-primary" /> Water Source
                  </span>
                  <strong>{land.waterSource} ({land.borewellCount || 1} Borewell)</strong>
                </div>

                <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaBolt className="text-warning" /> Free Agri Power
                  </span>
                  <span className="fw-bold text-success">
                    {land.freeElectricity ? '✓ Active Connection (7.5 HP)' : 'Commercial Line'}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaRoad className="text-secondary" /> Road Access
                  </span>
                  <strong>{land.roadAccess}</strong>
                </div>

                <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaShieldAlt className="text-success" /> Fencing
                  </span>
                  <strong>{land.fencingAvailable ? 'Fully Fenced Perimeter' : 'Open Bunds'}</strong>
                </div>
              </div>

              {/* Contact Actions */}
              <Button
                onClick={() => setShowContactModal(true)}
                className="btn-primary-green w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 mb-2"
              >
                <FaPhoneAlt /> Contact Landowner Directly
              </Button>

              <Button
                onClick={() => setShowContactModal(true)}
                className="btn-accent-gold w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <FaComments /> Schedule Field Site Visit
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Map & Coordinates */}
        <Card className="border shadow-sm rounded-4 p-4 mt-4">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FaMapMarkerAlt className="text-danger" />
            <span>Land Geographic Coordinates (OpenStreetMap)</span>
          </h5>
          <LeafletMap
            lat={land.location?.coordinates?.lat || 8.8711}
            lng={land.location?.coordinates?.lng || 77.4988}
            title={`${land.title} - ${land.location?.district}`}
          />
        </Card>

        {/* Contact Modal */}
        <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Contact Landowner: {ownerName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bg-light p-3 rounded-3 mb-3 text-center">
              <div className="small text-muted">Direct Mobile:</div>
              <a href={`tel:${ownerPhone}`} className="fs-4 fw-bolder text-success text-decoration-none">
                📞 +91 {ownerPhone}
              </a>
              <div className="small text-muted mt-1">Direct owner contact. No brokerage commission on MARUTHAM.</div>
            </div>

            <Form onSubmit={handleSendEnquiry}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Send Direct Message / Schedule Inspection</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  placeholder={`Hi ${ownerName}, I am interested in viewing your ${land.totalArea} ${land.areaUnit} land in ${land.location?.district}. Please let me know when we can conduct a site inspection.`}
                />
              </Form.Group>
              {enquirySent && <div className="alert alert-success py-2 small">Enquiry sent to landowner inbox!</div>}
              <Button type="submit" className="btn-primary-green w-100">
                <FaComments className="me-2" /> Send Enquiry
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default LandDetail;

