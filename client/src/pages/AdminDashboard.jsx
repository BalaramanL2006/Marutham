import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tab, Nav, Alert, Modal, Form } from 'react-bootstrap';
import {
  FaUserShield,
  FaUsers,
  FaTractor,
  FaShoppingBag,
  FaCalendarCheck,
  FaFlag,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSeedling,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { GiCow, GiCarrot } from 'react-icons/gi';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reportsRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.stats);
        setRecentOrders(statsRes.value.data.recentOrders || []);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        setUsersList(usersRes.value.data.users || []);
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value.data.success) {
        setReportedPosts(reportsRes.value.data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { role: newRole });
      if (res.data.success) {
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        setActionAlert(`User role updated to ${newRole}`);
        setTimeout(() => setActionAlert(''), 2500);
      }
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsersList(prev => prev.filter(u => u._id !== userId));
        setActionAlert('User removed successfully');
        setTimeout(() => setActionAlert(''), 2500);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleReportAction = async (postId, action) => {
    try {
      const res = await api.delete(`/admin/reports/${postId}?action=${action}`);
      if (res.data.success) {
        setReportedPosts(prev => prev.filter(p => p._id !== postId));
        setActionAlert(action === 'dismiss' ? 'Report dismissed' : 'Post removed from community');
        setTimeout(() => setActionAlert(''), 2500);
      }
    } catch (err) {
      console.error('Error handling report:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Accessing administrative control..." />;

  return (
    <div className="admin-dashboard-page py-4">
      <Container>
        {/* Admin Header */}
        <div className="bg-dark text-white p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-danger bg-opacity-25 rounded-circle text-warning">
              <FaUserShield size={36} />
            </div>
            <div>
              <h2 className="fw-bolder m-0">MARUTHAM Administrative Console</h2>
              <small className="text-light" style={{ opacity: 0.8 }}>
                Ecosystem oversight, content moderation, order flows, and farmer verifications
              </small>
            </div>
          </div>
          <span className="badge bg-danger px-3 py-2 fs-6 rounded-pill">
            System Admin Active
          </span>
        </div>

        {actionAlert && <Alert variant="success" className="py-2 small">{actionAlert}</Alert>}

        {/* Analytic Metrics Summary Cards */}
        {stats && (
          <Row className="g-3 mb-4">
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <FaUsers className="text-primary mx-auto mb-2" size={24} />
                <div className="small text-muted">Total Users</div>
                <h4 className="fw-bolder text-dark m-0">{stats.totalUsers}</h4>
              </Card>
            </Col>
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <FaSeedling className="text-success mx-auto mb-2" size={24} />
                <div className="small text-muted">Farmers</div>
                <h4 className="fw-bolder text-success m-0">{stats.totalFarmers}</h4>
              </Card>
            </Col>
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <GiCarrot className="text-warning mx-auto mb-2" size={26} />
                <div className="small text-muted">Products</div>
                <h4 className="fw-bolder text-dark m-0">{stats.totalProducts}</h4>
              </Card>
            </Col>
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <GiCow className="text-secondary mx-auto mb-2" size={26} />
                <div className="small text-muted">Livestock</div>
                <h4 className="fw-bolder text-dark m-0">{stats.totalLivestock}</h4>
              </Card>
            </Col>
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <FaTractor className="text-info mx-auto mb-2" size={24} />
                <div className="small text-muted">Fleet Rentals</div>
                <h4 className="fw-bolder text-dark m-0">{stats.totalRentals}</h4>
              </Card>
            </Col>
            <Col lg={2} sm={4} xs={6}>
              <Card className="border shadow-sm rounded-4 p-3 text-center bg-light">
                <FaMapMarkedAlt className="text-danger mx-auto mb-2" size={24} />
                <div className="small text-muted">Farmlands</div>
                <h4 className="fw-bolder text-dark m-0">{stats.totalLands}</h4>
              </Card>
            </Col>
          </Row>
        )}

        <Tab.Container defaultActiveKey="users">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="users" className="fw-semibold">
                <FaUsers className="me-1" /> Registered Accounts ({usersList.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reports" className="fw-semibold">
                <FaFlag className="me-1 text-danger" /> Reported Community Posts ({reportedPosts.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="orders" className="fw-semibold">
                <FaShoppingBag className="me-1 text-success" /> Recent Transactions ({recentOrders.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* 1. Users Tab */}
            <Tab.Pane eventKey="users">
              <Card className="border shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-3">User Management & Permissions</h5>
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>User</th>
                        <th>Email & Contact</th>
                        <th>District</th>
                        <th>Assigned Role</th>
                        <th>Verified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                                alt={u.name}
                                className="rounded-circle border"
                                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                              />
                              <span className="fw-bold">{u.name}</span>
                            </div>
                          </td>
                          <td className="small">
                            <div>{u.email}</div>
                            <div className="text-muted">{u.phone}</div>
                          </td>
                          <td className="small">{u.location?.district || 'Tamil Nadu'}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              style={{ width: '130px' }}
                            >
                              <option value="farmer">Farmer</option>
                              <option value="buyer">Buyer</option>
                              <option value="service_provider">Service</option>
                              <option value="admin">Admin</option>
                            </Form.Select>
                          </td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-success">
                              ✓ Verified
                            </span>
                          </td>
                          <td>
                            {u._id !== user._id && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteUser(u._id)}
                                title="Remove User"
                              >
                                <FaTrash size={12} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Tab.Pane>

            {/* 2. Reported Posts Tab */}
            <Tab.Pane eventKey="reports">
              <Card className="border shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-3">Community Moderation Queue ({reportedPosts.length})</h5>
                {reportedPosts.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    🎉 Excellent! Zero reported posts in the moderation queue.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Author</th>
                          <th>Post Title & Content</th>
                          <th>Report Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportedPosts.map((p) => (
                          <tr key={p._id}>
                            <td className="fw-bold">{p.author?.name}</td>
                            <td>
                              <div className="fw-bold">{p.title}</div>
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '350px' }}>
                                {p.content}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-danger bg-opacity-10 text-danger">
                                {p.reportReason || 'User flagged for review'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => handleReportAction(p._id, 'dismiss')}
                                >
                                  <FaCheck /> Dismiss
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReportAction(p._id, 'delete')}
                                >
                                  <FaTrash /> Delete Post
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card>
            </Tab.Pane>

            {/* 3. Recent Orders */}
            <Tab.Pane eventKey="orders">
              <Card className="border shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-3">Ecosystem Order Volume</h5>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-4 text-muted">No orders recorded.</div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total Amount</th>
                          <th>Payment Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((ord) => (
                          <tr key={ord._id}>
                            <td className="font-monospace small">#{ord._id.slice(-6)}</td>
                            <td>
                              <div className="fw-semibold">{ord.buyer?.name}</div>
                              <small className="text-muted">{ord.buyer?.phone}</small>
                            </td>
                            <td className="fw-bold text-success">₹{ord.totalAmount}</td>
                            <td><span className="badge bg-light text-dark border">{ord.paymentMethod}</span></td>
                            <td><Badge bg="success">{ord.orderStatus}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
