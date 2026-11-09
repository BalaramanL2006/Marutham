import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaTruck
} from 'react-icons/fa';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Shipping form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.location?.address || 'Plot 14, Farmer Colony');
  const [city, setCity] = useState(user?.location?.city || 'Madurai');
  const [district, setDistrict] = useState(user?.location?.district || 'Madurai');
  const [pincode, setPincode] = useState(user?.location?.pincode || '625001');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const deliveryCharge = subtotal > 1000 ? 0 : 50;
  const finalTotal = subtotal + (items.length > 0 ? deliveryCharge : 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (items.length === 0) return;

    try {
      setOrderSubmitting(true);
      setErrorMessage('');

      const orderData = {
        items: items.map(item => ({
          product: item.product?._id || item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          district,
          state: 'Tamil Nadu',
          pincode
        },
        paymentMethod,
        deliveryNotes
      };

      const res = await api.post('/orders', orderData);
      if (res.data.success) {
        setOrderId(res.data.order?._id);
        setOrderSuccess(true);
        clearCart();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please check inputs.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <Container className="py-5" style={{ maxWidth: '640px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-5 text-center">
          <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-flex mx-auto mb-3">
            <FaCheckCircle size={48} />
          </div>
          <h3 className="fw-bolder text-dark mb-2">Order Confirmed!</h3>
          <p className="text-muted small mb-3">
            Thank you for supporting our local farmers. Your order has been placed successfully and the harvest will be dispatched shortly.
          </p>
          <div className="bg-light p-3 rounded-3 small mb-4">
            Order Reference: <strong>#{orderId}</strong> | Payment: <strong>{paymentMethod}</strong>
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/dashboard" className="btn btn-primary-green px-4 py-2">
              View Order in Dashboard
            </Link>
            <Link to="/marketplace" className="btn btn-outline-green px-4 py-2">
              Continue Shopping
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <div className="cart-page py-4">
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <h2 className="fw-bolder m-0 d-flex align-items-center gap-2">
            <FaShoppingCart className="text-success" />
            <span>Shopping Cart ({items.length} items)</span>
          </h2>
          <Link to="/marketplace" className="text-decoration-none small text-success fw-bold d-flex align-items-center gap-1">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-5 rounded-4 border text-center my-4">
            <div className="display-4 text-muted mb-3">🛒</div>
            <h4 className="fw-bold">Your Farm Basket is Empty</h4>
            <p className="text-muted small mb-4">
              Explore our marketplace to buy fresh vegetables, organic fertilizers, and hybrid seeds directly from farmers.
            </p>
            <Link to="/marketplace" className="btn btn-primary-green px-4 py-2">
              Explore Farm Harvest
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {/* Left: Cart Items List */}
            <Col lg={7}>
              <Card className="border shadow-sm rounded-4 p-3 mb-4">
                <div className="table-responsive">
                  <Table className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const prod = item.product || {};
                        const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80';

                        return (
                          <tr key={idx}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={image}
                                  alt={prod.title}
                                  className="rounded-3"
                                  style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                    {prod.title}
                                  </h6>
                                  <small className="text-muted">₹{prod.price} / {prod.unit}</small>
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="d-inline-flex align-items-center border rounded-2 p-1">
                                <button
                                  onClick={() => updateQuantity(prod._id, (item.quantity || 1) - 1)}
                                  className="btn btn-sm btn-link p-0 text-dark"
                                >
                                  <FaMinus size={10} />
                                </button>
                                <span className="px-2 small fw-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(prod._id, (item.quantity || 1) + 1)}
                                  className="btn btn-sm btn-link p-0 text-dark"
                                >
                                  <FaPlus size={10} />
                                </button>
                              </div>
                            </td>

                            <td className="text-end fw-bold text-success">
                              ₹{(prod.price || 0) * (item.quantity || 1)}
                            </td>

                            <td className="text-end">
                              <button
                                onClick={() => removeFromCart(prod._id)}
                                className="btn btn-sm btn-link text-danger p-0"
                                title="Remove item"
                              >
                                <FaTrash size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card>

              {/* Delivery info */}
              <div className="p-3 bg-light rounded-4 border d-flex align-items-center gap-3">
                <FaTruck className="text-success fs-3 flex-shrink-0" />
                <div className="small">
                  <strong>Direct Farm Logistics:</strong> Orders over ₹1,000 enjoy free local farm-gate transit. Deliveries packaged carefully in ventilated organic crates.
                </div>
              </div>
            </Col>

            {/* Right: Checkout & Address Summary */}
            <Col lg={5}>
              <Card className="border shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold mb-3">Order & Delivery Details</h5>

                {errorMessage && <Alert variant="danger" className="py-2 small">{errorMessage}</Alert>}

                <Form onSubmit={handlePlaceOrder}>
                  <Row className="g-2 mb-2">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-muted">Recipient Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          size="sm"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-muted">Mobile Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          size="sm"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-semibold text-muted">Delivery Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      size="sm"
                      required
                    />
                  </Form.Group>

                  <Row className="g-2 mb-3">
                    <Col xs={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-muted">City</Form.Label>
                        <Form.Control
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          size="sm"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-muted">District</Form.Label>
                        <Form.Control
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          size="sm"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-muted">Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          size="sm"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Payment Method */}
                  <div className="mb-3">
                    <Form.Label className="small fw-semibold text-muted">Payment Method</Form.Label>
                    <div className="d-flex flex-column gap-1">
                      <Form.Check
                        type="radio"
                        id="pay-cod"
                        name="paymentMethod"
                        label="Cash on Delivery (COD)"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="small"
                      />
                      <Form.Check
                        type="radio"
                        id="pay-razor"
                        name="paymentMethod"
                        label="Razorpay Online / UPI / NetBanking"
                        checked={paymentMethod === 'Razorpay Online'}
                        onChange={() => setPaymentMethod('Razorpay Online')}
                        className="small"
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Items Subtotal:</span>
                      <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Delivery Logistics:</span>
                      <span>{deliveryCharge === 0 ? <strong className="text-success">FREE</strong> : `₹${deliveryCharge}`}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fs-6 fw-bold text-dark">
                      <span>Total Amount:</span>
                      <span className="text-success fs-5">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary-green w-100 py-3 fw-bold fs-6 shadow-sm"
                    disabled={orderSubmitting}
                  >
                    {orderSubmitting ? 'Processing Order...' : `Place Order • ₹${finalTotal}`}
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Cart;

