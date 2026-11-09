import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Table, Badge, Button, Form, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaUser,
  FaList,
  FaShoppingBag,
  FaCalendarCheck,
  FaHeart,
  FaRobot,
  FaCog,
  FaBell,
  FaPlus,
  FaComments,
  FaTrash,
  FaExternalLinkAlt
} from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [activeKey, setActiveKey] = useState(searchParams.get('tab') || 'overview');

  // Dashboard Data State
  const [myOrders, setMyOrders] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [orderRes, bookingRes, ownerBookingRes, diseaseRes, notifRes, productRes] = await Promise.allSettled([
        api.get('/orders/my'),
        api.get('/bookings/my'),
        api.get('/bookings/owner'),
        api.get('/disease/history'),
        api.get('/notifications'),
        api.get('/products') // to filter user's listings
      ]);

      if (orderRes.status === 'fulfilled' && orderRes.value.data.orders) {
        setMyOrders(orderRes.value.data.orders);
      }
      if (bookingRes.status === 'fulfilled' && bookingRes.value.data.bookings) {
        setMyBookings(bookingRes.value.data.bookings);
      }
      if (ownerBookingRes.status === 'fulfilled' && ownerBookingRes.value.data.bookings) {
        setOwnerBookings(ownerBookingRes.value.data.bookings);
      }
      if (diseaseRes.status === 'fulfilled' && diseaseRes.value.data.history) {
        setDiseaseHistory(diseaseRes.value.data.history);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value.data.notifications) {
        setNotifications(notifRes.value.data.notifications);
      }
      if (productRes.status === 'fulfilled' && productRes.value.data.products) {
        setMyListings(productRes.value.data.products.filter(p => p.seller?._id === user?._id || p.seller === user?._id));
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', { name, phone, bio });
      if (res.data.success) {
        updateUser(res.data.user);
        setSettingsSuccess('Profile updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        setOwnerBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  return (
    <div className="user-dashboard-page py-4">
      <Container>
        {/* User Header Profile Card */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col sm={8}>
              <div className="d-flex align-items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                  alt={user?.name}
                  className="rounded-circle border border-3 border-success shadow-sm"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                <div>
                  <h3 className="fw-bolder m-0 text-dark">{user?.name}</h3>
                  <div className="small text-muted d-flex align-items-center gap-2">
                    <span className="badge bg-success text-capitalize">{user?.role}</span>
                    <span>•</span>
                    <span>{user?.email}</span>
                    <span>•</span>
                    <span>{user?.location?.district}, Tamil Nadu</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col sm={4} className="text-sm-end mt-3 mt-sm-0">
              <Link to="/create-listing" className="btn btn-accent-gold fw-bold shadow-sm">
                <FaPlus className="me-1" /> Create New Listing
              </Link>
            </Col>
          </Row>
        </div>

        {/* Tabbed Navigation */}
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Row className="g-4">
            <Col lg={3}>
              <Card className="border shadow-sm rounded-4 p-2 sticky-top" style={{ top: '90px' }}>
                <Nav variant="pills" className="flex-column gap-1">
                  <Nav.Item>
                    <Nav.Link eventKey="overview" className="d-flex align-items-center gap-2 py-2 fw-semibold">
                      <FaUser /> Overview & Stats
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders" className="d-flex align-items-center justify-content-between py-2 fw-semibold">
                      <span className="d-flex align-items-center gap-2">
                        <FaShoppingBag /> My Orders
                      </span>
                      <Badge bg="secondary" pill>{myOrders.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bookings" className="d-flex align-items-center justify-content-between py-2 fw-semibold">
                      <span className="d-flex align-items-center gap-2">
                        <FaCalendarCheck /> Machinery Bookings
                      </span>
                      <Badge bg="secondary" pill>{myBookings.length + ownerBookings.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="listings" className="d-flex align-items-center justify-content-between py-2 fw-semibold">
                      <span className="d-flex align-items-center gap-2">
                        <FaList /> My Produce Listings
                      </span>
                      <Badge bg="secondary" pill>{myListings.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="disease" className="d-flex align-items-center justify-content-between py-2 fw-semibold">
                      <span className="d-flex align-items-center gap-2">
                        <FaRobot /> AI Disease History
                      </span>
                      <Badge bg="secondary" pill>{diseaseHistory.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications" className="d-flex align-items-center justify-content-between py-2 fw-semibold">
                      <span className="d-flex align-items-center gap-2">
                        <FaBell /> Notifications
                      </span>
                      <Badge bg="success" pill>{notifications.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings" className="d-flex align-items-center gap-2 py-2 fw-semibold">
                      <FaCog /> Account Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card>
            </Col>

            {/* Tab Content */}
            <Col lg={9}>
              <Tab.Content>
                {/* 1. Overview */}
                <Tab.Pane eventKey="overview">
                  <Row className="g-3 mb-4">
                    <Col md={4} sm={6}>
                      <Card className="border shadow-sm rounded-4 p-3 bg-light">
                        <div className="small text-muted mb-1">Purchases & Orders</div>
                        <h3 className="fw-bolder text-success m-0">{myOrders.length}</h3>
                        <small className="text-muted">Total placed orders</small>
                      </Card>
                    </Col>
                    <Col md={4} sm={6}>
                      <Card className="border shadow-sm rounded-4 p-3 bg-light">
                        <div className="small text-muted mb-1">Machinery Rentals</div>
                        <h3 className="fw-bolder text-primary m-0">{myBookings.length}</h3>
                        <small className="text-muted">Tractor & Drone hires</small>
                      </Card>
                    </Col>
                    <Col md={4} sm={6}>
                      <Card className="border shadow-sm rounded-4 p-3 bg-light">
                        <div className="small text-muted mb-1">Crop AI Diagnoses</div>
                        <h3 className="fw-bolder text-danger m-0">{diseaseHistory.length}</h3>
                        <small className="text-muted">Plant health scans</small>
                      </Card>
                    </Col>
                  </Row>

                  {/* Recent Activity */}
                  <Card className="border shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold mb-3">Quick Navigation & Ecosystem Services</h5>
                    <Row className="g-3">
                      <Col sm={6}>
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-bold">AI Crop Disease Finder</div>
                            <small className="text-muted">Diagnose leaf spots & fungal infections</small>
                          </div>
                          <Link to="/ai-doctor" className="btn btn-sm btn-outline-success">Open</Link>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-bold">Daily Mandi Prices</div>
                            <small className="text-muted">Track regulated wholesale market rates</small>
                          </div>
                          <Link to="/weather" className="btn btn-sm btn-outline-success">View</Link>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-bold">Farmers Community</div>
                            <small className="text-muted">Share agronomy experiences & queries</small>
                          </div>
                          <Link to="/community" className="btn btn-sm btn-outline-success">Explore</Link>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-bold">Post New Farm Produce</div>
                            <small className="text-muted">Direct sale with zero commission</small>
                          </div>
                          <Link to="/create-listing" className="btn btn-sm btn-success">Create</Link>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Tab.Pane>

                {/* 2. My Orders */}
                <Tab.Pane eventKey="orders">
                  <Card className="border shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">My Agricultural Orders ({myOrders.length})</h5>
                    {myOrders.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        No orders placed yet. <Link to="/marketplace" className="text-success fw-bold">Shop vegetables & fertilizers</Link>.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Items</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myOrders.map((ord) => (
                              <tr key={ord._id}>
                                <td className="small font-monospace">#{ord._id.slice(-6)}</td>
                                <td className="small text-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="small">
                                    {ord.items?.map((it, i) => (
                                      <div key={i}>{it.quantity}x {it.title}</div>
                                    ))}
                                  </div>
                                </td>
                                <td className="fw-bold text-success">₹{ord.totalAmount}</td>
                                <td>
                                  <Badge bg={ord.orderStatus === 'delivered' ? 'success' : 'primary'} className="text-capitalize">
                                    {ord.orderStatus}
                                  </Badge>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark border small">
                                    {ord.paymentMethod}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card>
                </Tab.Pane>

                {/* 3. Machinery Bookings */}
                <Tab.Pane eventKey="bookings">
                  <Card className="border shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold mb-3">My Equipment Bookings ({myBookings.length})</h5>
                    {myBookings.length === 0 ? (
                      <div className="text-center py-3 text-muted">
                        No equipment booked yet. <Link to="/rentals" className="text-success fw-bold">Explore tractors & drones</Link>.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Machinery</th>
                              <th>Start Date</th>
                              <th>Duration</th>
                              <th>Total Cost</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myBookings.map((b) => (
                              <tr key={b._id}>
                                <td className="fw-bold">{b.equipment?.title || 'Farm Machinery'}</td>
                                <td className="small text-muted">{new Date(b.startDate).toLocaleDateString()}</td>
                                <td className="small">{b.duration} {b.rentalType}</td>
                                <td className="fw-bold text-success">₹{b.totalPrice}</td>
                                <td>
                                  <Badge bg={b.status === 'confirmed' ? 'success' : b.status === 'rejected' ? 'danger' : 'warning'}>
                                    {b.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card>

                  {/* Owner Bookings if user has equipment */}
                  {ownerBookings.length > 0 && (
                    <Card className="border shadow-sm rounded-4 p-4">
                      <h5 className="fw-bold mb-3 text-primary">Incoming Rental Requests for My Fleet ({ownerBookings.length})</h5>
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Customer</th>
                              <th>Machine</th>
                              <th>Dates</th>
                              <th>Amount</th>
                              <th>Current Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerBookings.map((b) => (
                              <tr key={b._id}>
                                <td>
                                  <div className="fw-semibold">{b.renter?.name}</div>
                                  <small className="text-muted">{b.contactNumber}</small>
                                </td>
                                <td>{b.equipment?.title}</td>
                                <td className="small">{new Date(b.startDate).toLocaleDateString()}</td>
                                <td className="fw-bold text-success">₹{b.totalPrice}</td>
                                <td>
                                  <Badge bg={b.status === 'confirmed' ? 'success' : 'warning'}>{b.status}</Badge>
                                </td>
                                <td>
                                  {b.status === 'pending' && (
                                    <div className="d-flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleBookingStatusChange(b._id, 'confirmed')}
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleBookingStatusChange(b._id, 'rejected')}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card>
                  )}
                </Tab.Pane>

                {/* 4. My Listings */}
                <Tab.Pane eventKey="listings">
                  <Card className="border shadow-sm rounded-4 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold m-0">My Farm Listings ({myListings.length})</h5>
                      <Link to="/create-listing" className="btn btn-sm btn-primary-green">
                        <FaPlus className="me-1" /> Add New Listing
                      </Link>
                    </div>

                    {myListings.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        You have not posted any produce listings yet.
                        <div className="mt-2">
                          <Link to="/create-listing" className="btn btn-outline-success btn-sm">List Your Harvest Now</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Available Stock</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myListings.map((p) => (
                              <tr key={p._id}>
                                <td className="fw-bold">{p.title}</td>
                                <td><Badge bg="light" text="dark" className="border">{p.category}</Badge></td>
                                <td className="text-success fw-bold">₹{p.price} / {p.unit}</td>
                                <td>{p.quantity} {p.unit}</td>
                                <td>
                                  <Badge bg={p.status === 'available' ? 'success' : 'danger'}>{p.status}</Badge>
                                </td>
                                <td>
                                  <Link to={`/products/${p._id}`} className="btn btn-sm btn-link text-primary p-0">
                                    <FaExternalLinkAlt />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card>
                </Tab.Pane>

                {/* 5. AI Disease History */}
                <Tab.Pane eventKey="disease">
                  <Card className="border shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Previous AI Crop Diagnoses ({diseaseHistory.length})</h5>
                    {diseaseHistory.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        No previous scans found.
                        <div className="mt-2">
                          <Link to="/ai-doctor" className="btn btn-primary-green btn-sm">Diagnose Plant Health</Link>
                        </div>
                      </div>
                    ) : (
                      <Row className="g-3">
                        {diseaseHistory.map((rec) => (
                          <Col md={6} key={rec._id}>
                            <Card className="border shadow-sm rounded-3 overflow-hidden p-3 h-100">
                              <div className="d-flex gap-3">
                                <img
                                  src={rec.imageUrl?.startsWith('/uploads') ? rec.imageUrl : rec.imageUrl}
                                  alt={rec.possibleDisease}
                                  className="rounded-3 border"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div>
                                  <span className="badge bg-success bg-opacity-10 text-success small mb-1">
                                    {rec.detectedCrop}
                                  </span>
                                  <h6 className="fw-bold mb-1 text-dark">{rec.possibleDisease}</h6>
                                  <small className="text-muted d-block">
                                    {new Date(rec.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card>
                </Tab.Pane>

                {/* 6. Notifications */}
                <Tab.Pane eventKey="notifications">
                  <Card className="border shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Ecosystem Notifications ({notifications.length})</h5>
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-muted">No notifications right now. All caught up!</div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {notifications.map((n) => (
                          <div key={n._id} className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{n.title}</div>
                              <small className="text-muted">{n.message}</small>
                            </div>
                            <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </Tab.Pane>

                {/* 7. Settings */}
                <Tab.Pane eventKey="settings">
                  <Card className="border shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Profile & Farm Information</h5>
                    {settingsSuccess && <Alert variant="success">{settingsSuccess}</Alert>}

                    <Form onSubmit={handleUpdateProfile}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-muted">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-muted">Contact Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-muted">Farm Bio & Agronomic Background</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </Form.Group>

                      <Button type="submit" className="btn-primary-green px-4 py-2 fw-bold">
                        Save Profile Changes
                      </Button>
                    </Form>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default UserDashboard;

