import React from 'react';
import { Alert } from 'react-bootstrap';

const AlertBanner = ({ variant = 'danger', message, onClose }) => {
  if (!message) return null;
  return (
    <Alert variant={variant} dismissible={!!onClose} onClose={onClose} className="border-0 shadow-sm rounded-3">
      {message}
    </Alert>
  );
};

export default AlertBanner;

