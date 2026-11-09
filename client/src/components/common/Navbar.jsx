import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import {
  FaLeaf,
  FaShoppingCart,
  FaUserCircle,
  FaPlusCircle,
  FaGlobeAmericas,
  FaCloudSun,
  FaRobot,
  FaBookOpen,
  FaUsers,
  FaTractor,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaUserShield,
  FaThLarge
} from 'react-icons/fa';
import { GiCow, GiCarrot } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const AppNavbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="marutham-navbar">
      <Container fluid className="px-lg-4">
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-3">
          <div
            className="d-flex align-items-center justify-content-center me-2 shadow-sm rounded-circle"
            style={{ width: '42px', height: '42px', backgroundColor: 'var(--primary-green)', color: '#FFFFFF' }}
          >
            <FaLeaf size={22} className="text-warning" />
          </div>
          <div>
            <div className="fw-bolder fs-4 lh-1" style={{ color: 'var(--primary-green)', letterSpacing: '0.04em' }}>
              {t.brand}
            </div>
            <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              {language === 'ta' ? 'வேளாண் சூழலமைப்பு' : 'Agri Ecosystem'}
            </small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="marutham-nav-collapse" className="border-0 shadow-none" />

        <Navbar.Collapse id="marutham-nav-collapse">
          {/* Main Navigation links */}
          <Nav className="mx-auto my-2 my-lg-0 align-items-lg-center">
            <Nav.Link as={NavLink} to="/" className="nav-link-custom">
              {t.nav.home}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/marketplace" className="nav-link-custom d-flex align-items-center">
              <GiCarrot className="me-1 text-success" /> {t.nav.marketplace}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/livestock" className="nav-link-custom d-flex align-items-center">
              <GiCow className="me-1 text-secondary" /> {t.nav.livestock}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/rentals" className="nav-link-custom d-flex align-items-center">
              <FaTractor className="me-1 text-primary" /> {t.nav.rentals}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/lands" className="nav-link-custom d-flex align-items-center">
              <FaMapMarkedAlt className="me-1 text-success" /> {t.nav.lands}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/ai-doctor" className="nav-link-custom d-flex align-items-center">
              <FaRobot className="me-1 text-warning" />
              <span>{t.nav.aiDoctor}</span>
              <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>AI</span>
            </Nav.Link>

            <Nav.Link as={NavLink} to="/fertilizers" className="nav-link-custom">
              {language === 'ta' ? 'உரங்கள்' : 'Fertilizers'}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/knowledge" className="nav-link-custom d-flex align-items-center">
              <FaBookOpen className="me-1 text-muted" /> {t.nav.knowledge}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/community" className="nav-link-custom d-flex align-items-center">
              <FaUsers className="me-1 text-info" /> {t.nav.community}
            </Nav.Link>

            <Nav.Link as={NavLink} to="/weather" className="nav-link-custom d-flex align-items-center">
              <FaCloudSun className="me-1 text-warning" /> {t.nav.weather}
            </Nav.Link>
          </Nav>

          {/* Right Action Controls */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="btn btn-sm btn-outline-success d-flex align-items-center py-1 px-2 rounded-pill fw-semibold"
              title="Change Language / மொழியை மாற்றவும்"
            >
              <FaGlobeAmericas className="me-1" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="btn btn-light position-relative p-2 rounded-circle border shadow-sm text-dark me-1"
              title="Shopping Cart"
            >
              <FaShoppingCart size={17} />
              {cartCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.65rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <NavDropdown
                align="end"
                title={
                  <span className="d-inline-flex align-items-center fw-semibold text-dark">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={user?.name}
                      className="rounded-circle me-1 border border-success"
                      style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                    />
                    <span className="d-none d-sm-inline" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                  </span>
                }
                id="user-dropdown"
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-bold text-truncate">{user?.name}</div>
                  <small className="text-muted d-block text-capitalize">Role: {user?.role}</small>
                </div>
                <NavDropdown.Item as={Link} to="/dashboard">
                  <FaThLarge className="me-2 text-primary" /> {t.nav.dashboard}
                </NavDropdown.Item>
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin" className="text-danger fw-semibold">
                    <FaUserShield className="me-2" /> {t.nav.admin} Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> {t.nav.logout}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex align-items-center gap-1">
                <Link to="/login" className="btn btn-sm btn-outline-green py-1 px-3">
                  {t.nav.login}
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary-green py-1 px-3">
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* List Your Product CTA */}
            <Link to="/create-listing" className="btn btn-accent-gold btn-sm d-flex align-items-center py-2 px-3 shadow-sm ms-1">
              <FaPlusCircle className="me-1" />
              <span>{t.listYourProduct}</span>
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

