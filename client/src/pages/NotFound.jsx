import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5 text-center my-5" style={{ maxWidth: '500px' }}>
      <div className="display-1 text-success mb-3">🌱</div>
      <h1 className="fw-bolder text-dark mb-2">404 - Page Not Found</h1>
      <p className="text-muted mb-4">
        The agricultural plot or listing you are looking for has been moved, reaped, or does not exist.
      </p>
      <Link to="/" className="btn btn-primary-green px-4 py-2 d-inline-flex align-items-center gap-2">
        <FaHome /> Return to MARUTHAM Home
      </Link>
    </Container>
  );
};

export default NotFound;

