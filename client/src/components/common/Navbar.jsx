import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import {
  FaLeaf,
  FaShoppingCart,
  FaGlobeAmericas,
  FaCloudSun,
  FaRobot,
  FaBookOpen,
  FaUsers,
  FaTractor,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaUserShield,
  FaThLarge,
  FaBars,
  FaSearch
} from 'react-icons/fa';
import { GiCow, GiCarrot, GiFertilizerBag } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const AppNavbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCloseMenu = () => setShowMenu(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Navbar className="marutham-navbar py-2">
        <Container fluid className="px-2 px-lg-4">
          <div className="d-flex align-items-center justify-content-between w-100 gap-2">
            {/* LEFT: MARUTHAM Logo → Home */}
            <div className="d-flex align-items-center flex-shrink-0">
              {/* Brand Logo and Name */}
              <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-1 me-md-2">
                <div
                  className="d-flex align-items-center justify-content-center me-2 shadow-sm rounded-circle"
                  style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-green)', color: '#FFFFFF' }}
                >
                  <FaLeaf size={20} className="text-warning" />
                </div>
                <div>
                  <div className="fw-bolder fs-4 lh-1" style={{ color: 'var(--primary-green)', letterSpacing: '0.04em' }}>
                    {t.brand}
                  </div>
                  <small className="text-muted text-uppercase d-none d-sm-block" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>
                    {language === 'ta' ? 'வேளாண் சூழலமைப்பு' : 'Agri Ecosystem'}
                  </small>
                </div>
              </Navbar.Brand>

              {/* Home Button */}
              <Nav.Link as={NavLink} to="/" className="nav-link-custom ms-1 ms-md-2">
                {t.nav.home}
              </Nav.Link>
            </div>

            {/* CENTER: Search Bar (Desktop & Tablet) */}
            <form
              onSubmit={handleSearchSubmit}
              className="navbar-search-form flex-grow-1 mx-2 mx-lg-4 d-none d-md-block"
              style={{ maxWidth: '480px' }}
            >
              <div className="input-group navbar-search-group">
                <span className="input-group-text navbar-search-icon">
                  <FaSearch className="text-muted" size={14} />
                </span>
                <input
                  type="search"
                  className="form-control navbar-search-input"
                  placeholder={language === 'ta' ? 'பொருட்கள், கால்நடைகள், சேவைகளைத் தேடுங்கள்...' : 'Search products, livestock, services...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products, livestock, services"
                />
                <button
                  type="submit"
                  className="btn navbar-search-btn"
                  title="Search"
                >
                  <FaSearch size={13} className="me-1 d-none d-lg-inline" />
                  <span>{language === 'ta' ? 'தேடு' : 'Search'}</span>
                </button>
              </div>
            </form>

            {/* RIGHT: Tamil Language Selector → Cart → Login → Register → Hamburger Menu (☰) */}
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              {/* 1. Tamil Language Selector */}
              <button
                onClick={toggleLanguage}
                className="btn btn-sm btn-outline-success d-flex align-items-center py-1 px-2 rounded-pill fw-semibold"
                title="Change Language / மொழியை மாற்றவும்"
              >
                <FaGlobeAmericas className="me-1" />
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>

              {/* 2. Cart Icon */}
              <Link
                to="/cart"
                className="btn btn-light position-relative p-2 rounded-circle border shadow-sm text-dark"
                title="Shopping Cart"
              >
                <FaShoppingCart size={16} />
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

              {/* 3. Login & Register (or User Profile if logged in) */}
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
                      <span className="d-none d-xl-inline" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  <Link to="/login" className="btn btn-sm btn-outline-green py-1 px-2 px-sm-3">
                    {t.nav.login}
                  </Link>
                  <Link to="/register" className="btn btn-sm btn-primary-green py-1 px-2 px-sm-3">
                    {t.nav.register}
                  </Link>
                </div>
              )}

              {/* 4. Hamburger Menu (☰) at Extreme Right End */}
              <button
                type="button"
                onClick={() => setShowMenu(true)}
                className="btn hamburger-btn-circle"
                aria-label="Open Navigation Categories"
                title={language === 'ta' ? 'பிரிவுகள் மெனு' : 'Categories Menu'}
              >
                <FaBars size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (visible only below md) */}
          <div className="d-block d-md-none w-100 pt-2 pb-1">
            <form onSubmit={handleSearchSubmit} className="navbar-search-form w-100">
              <div className="input-group navbar-search-group">
                <span className="input-group-text navbar-search-icon">
                  <FaSearch className="text-muted" size={13} />
                </span>
                <input
                  type="search"
                  className="form-control navbar-search-input py-1"
                  placeholder={language === 'ta' ? 'பொருட்கள், சேவைகள் தேடுங்கள்...' : 'Search products, services...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="btn navbar-search-btn py-1 px-3"
                  title="Search"
                >
                  <FaSearch size={13} />
                </button>
              </div>
            </form>
          </div>
        </Container>
      </Navbar>

      {/* Hamburger Navigation Drawer (Smooth Offcanvas from End/Right) */}
      <Offcanvas
        show={showMenu}
        onHide={handleCloseMenu}
        placement="end"
        className="marutham-offcanvas shadow-lg"
      >
        <Offcanvas.Header closeButton className="border-bottom pb-3">
          <Offcanvas.Title className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center me-2 rounded-circle"
              style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-green)', color: '#FFFFFF' }}
            >
              <FaLeaf size={18} className="text-warning" />
            </div>
            <div>
              <div className="fw-bold fs-5 lh-1" style={{ color: 'var(--primary-green)' }}>
                {t.brand}
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                {language === 'ta' ? 'விவசாயப் பிரிவுகள்' : 'Agricultural Categories'}
              </small>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-3">
          <Nav className="flex-column">
            {/* 1. Marketplace */}
            <NavLink
              to="/marketplace"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <GiCarrot className="me-3 text-success fs-5 flex-shrink-0" />
              <span>{t.nav.marketplace}</span>
            </NavLink>

            {/* 2. Livestock */}
            <NavLink
              to="/livestock"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <GiCow className="me-3 text-secondary fs-5 flex-shrink-0" />
              <span>{t.nav.livestock}</span>
            </NavLink>

            {/* 3. Rentals */}
            <NavLink
              to="/rentals"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaTractor className="me-3 text-primary fs-5 flex-shrink-0" />
              <span>{t.nav.rentals}</span>
            </NavLink>

            {/* 4. Lands */}
            <NavLink
              to="/lands"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaMapMarkedAlt className="me-3 text-success fs-5 flex-shrink-0" />
              <span>{t.nav.lands}</span>
            </NavLink>

            {/* 5. AI Disease Finder */}
            <NavLink
              to="/ai-doctor"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaRobot className="me-3 text-warning fs-5 flex-shrink-0" />
              <span className="flex-grow-1">{t.nav.aiDoctor}</span>
              <span className="badge bg-danger ms-2" style={{ fontSize: '0.62rem' }}>AI</span>
            </NavLink>

            {/* 6. Fertilizers */}
            <NavLink
              to="/fertilizers"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <GiFertilizerBag className="me-3 text-warning fs-5 flex-shrink-0" />
              <span>{language === 'ta' ? 'உரங்கள்' : 'Fertilizers'}</span>
            </NavLink>

            {/* 7. Agri Guide */}
            <NavLink
              to="/knowledge"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaBookOpen className="me-3 text-muted fs-5 flex-shrink-0" />
              <span>{t.nav.knowledge}</span>
            </NavLink>

            {/* 8. Community */}
            <NavLink
              to="/community"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaUsers className="me-3 text-info fs-5 flex-shrink-0" />
              <span>{t.nav.community}</span>
            </NavLink>

            {/* 9. Weather & Mandi */}
            <NavLink
              to="/weather"
              className={({ isActive }) => `offcanvas-nav-link ${isActive ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaCloudSun className="me-3 text-warning fs-5 flex-shrink-0" />
              <span>{t.nav.weather}</span>
            </NavLink>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppNavbar;
