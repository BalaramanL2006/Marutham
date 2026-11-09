import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLeaf, FaLock, FaEnvelope, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="login-page py-5">
      <Container style={{ maxWidth: '480px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 p-3"
              style={{ backgroundColor: 'var(--primary-green)', color: 'var(--accent-gold)' }}
            >
              <FaLeaf size={32} />
            </div>
            <h3 className="fw-bolder text-dark mb-1">Welcome Back</h3>
            <p className="text-muted small">Sign in to your MARUTHAM Agriculture Ecosystem account</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="farmer@marutham.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-primary-green w-100 py-2 fw-bold fs-6 mb-3"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="mt-3 p-3 bg-light rounded-3 border">
            <div className="small fw-bold text-dark mb-2 d-flex align-items-center gap-1">
              <FaUserCheck className="text-success" /> One-Click Quick Demo Login:
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button
                variant="outline-success"
                size="sm"
                className="py-1 px-2 small"
                onClick={() => fillDemo('farmer@marutham.com', 'farmer123')}
              >
                Farmer (Selvam)
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                className="py-1 px-2 small"
                onClick={() => fillDemo('admin@marutham.com', 'admin123')}
              >
                Admin (Full Access)
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="py-1 px-2 small"
                onClick={() => fillDemo('buyer@marutham.com', 'buyer123')}
              >
                Buyer (Anand)
              </Button>
            </div>
          </div>

          <div className="text-center mt-4 small text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-success fw-bold">
              Register as Farmer or Buyer
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Login;

