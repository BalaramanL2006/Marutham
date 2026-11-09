import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" style={{ color: 'var(--secondary-green)', width: '3rem', height: '3rem' }} />
      <span className="mt-3 text-muted fw-semibold">{message}</span>
    </div>
  );
};

export default LoadingSpinner;

