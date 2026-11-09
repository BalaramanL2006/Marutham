import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [district, setDistrict] = useState('Madurai');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register({
        name,
        email,
        phone,
        password,
        role,
        district,
        state: 'Tamil Nadu'
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page py-5">
      <Container style={{ maxWidth: '540px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 p-3"
              style={{ backgroundColor: 'var(--primary-green)', color: 'var(--accent-gold)' }}
            >
              <FaLeaf size={32} />
            </div>
            <h3 className="fw-bolder text-dark mb-1">Create Account</h3>
            <p className="text-muted small">Join the MARUTHAM Digital Agriculture Ecosystem</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Full Name / Farm Enterprise Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. S. Murugesan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Password (min 6 characters)</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </Form.Group>

            <Row className="g-2 mb-4">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Primary Role</Form.Label>
                  <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="farmer">Farmer / Agricultural Producer</option>
                    <option value="buyer">Wholesale Buyer / Consumer</option>
                    <option value="service_provider">Machinery Service Provider</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Tamil Nadu District</Form.Label>
                  <Form.Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Dindigul">Dindigul</option>
                    <option value="Erode">Erode</option>
                    <option value="Salem">Salem</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Trichy">Tiruchirappalli</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="btn-primary-green w-100 py-2 fw-bold fs-6 mb-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register on MARUTHAM'}
            </Button>
          </Form>

          <div className="text-center mt-3 small text-muted">
            Already registered?{' '}
            <Link to="/login" className="text-success fw-bold">
              Sign In Here
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Register;

