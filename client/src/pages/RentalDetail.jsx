import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTractor,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaGasPump,
  FaShieldAlt,
  FaCheckCircle,
  FaUser
} from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import LeafletMap from '../components/common/LeafletMap.jsx';

const RentalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  // Booking Form State
  const [rentalType, setRentalType] = useState('daily');
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [fieldAddress, setFieldAddress] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ success: false, message: '' });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rentals/${id}`);
        if (res.data.success) {
          setRental(res.data.rental);
          if (res.data.rental.images?.length > 0) {
            setSelectedImage(res.data.rental.images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching rental equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id]);

  if (loading) return <LoadingSpinner message="Checking machinery readiness..." />;
  if (!rental) {
    return (
      <Container className="py-5 text-center">
        <h3>Machinery Listing Not Found</h3>
        <Link to="/rentals" className="btn btn-primary-green mt-3">Back to Rentals</Link>
      </Container>
    );
  }

  // Cost calculation
  const unitRate = rentalType === 'hourly' ? rental.rentalPricePerHour : rental.rentalPricePerDay;
  const estimatedCost = unitRate * Number(duration);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await api.post('/bookings', {
        equipmentId: rental._id,
        startDate,
        endDate,
        rentalType,
        duration: Number(duration),
        totalPrice: estimatedCost,
        contactNumber: contactPhone || user.phone,
        notes: bookingNotes,
        fieldLocation: { address: fieldAddress, district: rental.location?.district }
      });

      if (res.data.success) {
        setBookingStatus({
          success: true,
          message: 'Booking request sent successfully! The fleet owner will review and confirm availability.'
        });
      }
    } catch (err) {
      setBookingStatus({
        success: false,
        message: err.response?.data?.message || 'Failed to submit booking request.'
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const ownerPhone = rental.ownerContact?.phone || rental.owner?.phone || '9789065432';
  const ownerName = rental.ownerContact?.name || rental.owner?.name || 'Agro Equipment Fleet';

  return (
    <div className="rental-detail-page py-4">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/rentals" className="text-muted">Rentals</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{rental.title}</li>
          </ol>
        </nav>

        <Row className="g-4 mb-4">
          {/* Photos */}
          <Col lg={7}>
            <Card className="border shadow-sm rounded-4 overflow-hidden p-2 mb-3">
              <div className="rounded-3 overflow-hidden bg-light" style={{ height: '400px' }}>
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80'}
                  alt={rental.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {rental.images?.length > 1 && (
                <div className="d-flex gap-2 mt-2 p-1 overflow-auto">
                  {rental.images.map((img, idx) => (
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

            {/* Description & Technical Specs */}
            <Card className="border shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">Equipment Overview & Capability</h5>
              <p className="text-muted small" style={{ lineHeight: '1.7' }}>
                {rental.description}
              </p>

              <Row className="g-3 mt-1">
                <Col sm={6}>
                  <div className="bg-light p-3 rounded-3">
                    <div className="small text-muted">Brand & Model</div>
                    <div className="fw-bold text-dark">{rental.brandModel}</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="bg-light p-3 rounded-3">
                    <div className="small text-muted">Engine / Power Rating</div>
                    <div className="fw-bold text-dark">{rental.powerHp || 'Commercial Heavy Duty'}</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="bg-light p-3 rounded-3">
                    <div className="small text-muted">Operator Service</div>
                    <div className="fw-bold text-success d-flex align-items-center gap-1">
                      <FaUserCheck /> {rental.withDriver ? 'Experienced Driver Included' : 'Self-Operated'}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="bg-light p-3 rounded-3">
                    <div className="small text-muted">Fuel Policy</div>
                    <div className="fw-bold text-dark d-flex align-items-center gap-1">
                      <FaGasPump size={13} /> {rental.fuelPolicy || 'Customer fills fuel'}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Booking Request Form & Pricing */}
          <Col lg={5}>
            <Card className="border shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge bg="dark" className="px-3 py-1 rounded-pill">
                  {rental.category}
                </Badge>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                  ✓ Available for Hire
                </span>
              </div>

              <h3 className="fw-bolder mb-2">{rental.title}</h3>

              <div className="d-flex align-items-center gap-2 small text-muted mb-3">
                <FaMapMarkerAlt className="text-danger" />
                <span>{rental.location?.area ? `${rental.location.area}, ` : ''}{rental.location?.district}</span>
              </div>

              {/* Price Rates */}
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <Row className="text-center">
                  <Col xs={6} className="border-end">
                    <div className="small text-muted">Hourly Rate</div>
                    <div className="fw-bolder fs-4 text-success">₹{rental.rentalPricePerHour}</div>
                    <small className="text-muted">/ hour</small>
                  </Col>
                  <Col xs={6}>
                    <div className="small text-muted">Daily Rate (8 hrs)</div>
                    <div className="fw-bolder fs-4 text-success">₹{rental.rentalPricePerDay}</div>
                    <small className="text-muted">/ day</small>
                  </Col>
                </Row>
              </div>

              {/* Booking Submission Form */}
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaCalendarAlt className="text-success" />
                <span>Reserve Equipment</span>
              </h5>

              {bookingStatus.message && (
                <Alert variant={bookingStatus.success ? 'success' : 'danger'} className="py-2 small">
                  {bookingStatus.message}
                </Alert>
              )}

              <Form onSubmit={handleBookingSubmit}>
                <Row className="g-2 mb-2">
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">Rental Basis</Form.Label>
                      <Form.Select
                        value={rentalType}
                        onChange={(e) => setRentalType(e.target.value)}
                        size="sm"
                      >
                        <option value="hourly">Hourly Basis</option>
                        <option value="daily">Daily Basis</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        Duration ({rentalType === 'hourly' ? 'Hours' : 'Days'})
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max={rentalType === 'hourly' ? 24 : 30}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        size="sm"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-2 mb-2">
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        size="sm"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        size="sm"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold text-muted">Farm Field Address / Landmark</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Survey No. 42, Near Melur Canal"
                    value={fieldAddress}
                    onChange={(e) => setFieldAddress(e.target.value)}
                    size="sm"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted">Farmer Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Your 10-digit mobile number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    size="sm"
                    required
                  />
                </Form.Group>

                {/* Total Cost Estimation */}
                <div className="bg-success bg-opacity-10 p-3 rounded-3 mb-3 border border-success d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small text-muted">Estimated Rental Charge:</div>
                    <div className="small text-muted">
                      ({duration} {rentalType === 'hourly' ? 'hours' : 'days'} × ₹{unitRate})
                    </div>
                  </div>
                  <div className="fs-4 fw-bolder text-success">
                    ₹{estimatedCost.toLocaleString('en-IN')}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-primary-green w-100 py-2 fw-bold fs-6 mb-2"
                  disabled={bookingSubmitting}
                >
                  {bookingSubmitting ? 'Submitting Request...' : 'Submit Rental Booking Request'}
                </Button>
              </Form>

              <div className="text-center mt-2">
                <a href={`tel:${ownerPhone}`} className="text-decoration-none small text-success fw-bold">
                  📞 Or Call Owner Directly: +91 {ownerPhone}
                </a>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Map */}
        <Card className="border shadow-sm rounded-4 p-4 mt-4">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FaMapMarkerAlt className="text-danger" />
            <span>Machine Fleet Base Location</span>
          </h5>
          <LeafletMap title={`${rental.title} Base Station`} />
        </Card>
      </Container>
    </div>
  );
};

export default RentalDetail;

