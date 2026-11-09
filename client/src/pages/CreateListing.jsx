import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaPlusCircle,
  FaUpload,
  FaCheckCircle,
  FaShieldAlt,
  FaLeaf,
  FaTractor,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { GiCow, GiCarrot, GiFertilizerBag } from 'react-icons/gi';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const CreateListing = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [listingType, setListingType] = useState('produce'); // 'produce', 'livestock', 'rental', 'land', 'fertilizer'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Common Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(user?.location?.district || 'Madurai');
  const [areaOrVillage, setAreaOrVillage] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Produce Specific
  const [produceCategory, setProduceCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('kg');
  const [isOrganic, setIsOrganic] = useState(false);

  // Livestock Specific
  const [livestockCategory, setLivestockCategory] = useState('Cows');
  const [breed, setBreed] = useState('Kangeyam Indigenous');
  const [ageValue, setAgeValue] = useState('3');
  const [gender, setGender] = useState('Female');
  const [milkYield, setMilkYield] = useState('0');

  // Rental Specific
  const [rentalCategory, setRentalCategory] = useState('Tractors');
  const [hourlyPrice, setHourlyPrice] = useState('650');
  const [dailyPrice, setDailyPrice] = useState('4800');
  const [powerHp, setPowerHp] = useState('45 HP');
  const [withDriver, setWithDriver] = useState(true);

  // Land Specific
  const [totalArea, setTotalArea] = useState('3.5');
  const [areaUnit, setAreaUnit] = useState('Acres');
  const [soilType, setSoilType] = useState('Red Soil');
  const [waterSource, setWaterSource] = useState('Borewell Available');
  const [freeElectricity, setFreeElectricity] = useState(true);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=/create-listing');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      images.forEach(img => {
        formData.append('images', img);
      });

      if (listingType === 'produce' || listingType === 'fertilizer') {
        formData.append('category', listingType === 'produce' ? produceCategory : 'Organic Fertilizers');
        formData.append('price', price);
        formData.append('unit', unit);
        formData.append('quantity', quantity);
        formData.append('isOrganic', isOrganic);
        formData.append('location', JSON.stringify({ district, city: areaOrVillage }));

        const res = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          setSuccess(true);
          setTimeout(() => navigate('/marketplace'), 1500);
        }
      } else if (listingType === 'livestock') {
        formData.append('category', livestockCategory);
        formData.append('breed', breed);
        formData.append('price', price);
        formData.append('gender', gender);
        formData.append('age', JSON.stringify({ value: Number(ageValue), unit: 'years' }));
        formData.append('milkProduction', JSON.stringify({ litersPerDay: Number(milkYield) }));
        formData.append('location', JSON.stringify({ district, village: areaOrVillage }));

        const res = await api.post('/livestock', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          setSuccess(true);
          setTimeout(() => navigate('/livestock'), 1500);
        }
      } else if (listingType === 'rental') {
        formData.append('category', rentalCategory);
        formData.append('rentalPricePerHour', hourlyPrice);
        formData.append('rentalPricePerDay', dailyPrice || price);
        formData.append('powerHp', powerHp);
        formData.append('withDriver', withDriver);
        formData.append('location', JSON.stringify({ district, area: areaOrVillage }));

        const res = await api.post('/rentals', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          setSuccess(true);
          setTimeout(() => navigate('/rentals'), 1500);
        }
      } else if (listingType === 'land') {
        formData.append('totalArea', totalArea);
        formData.append('areaUnit', areaUnit);
        formData.append('price', price);
        formData.append('soilType', soilType);
        formData.append('waterSource', waterSource);
        formData.append('freeElectricity', freeElectricity);
        formData.append('location', JSON.stringify({ district, village: areaOrVillage }));

        const res = await api.post('/lands', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          setSuccess(true);
          setTimeout(() => navigate('/lands'), 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-listing-page py-4">
      <Container style={{ maxWidth: '800px' }}>
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
          <div className="text-center mb-4">
            <span className="section-badge mb-2">
              🌱 {language === 'ta' ? 'புதிய பதிவு' : 'MARUTHAM Marketplace Listing'}
            </span>
            <h2 className="fw-bolder fs-2 mb-1">
              {language === 'ta' ? 'உங்கள் விளைபொருளை பதிவேற்றவும்' : 'List Your Agricultural Asset or Produce'}
            </h2>
            <p className="text-muted small">
              Reach tens of thousands of buyers, farmers, and contractors with 0% intermediary commission.
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div className="d-flex flex-wrap gap-2 justify-content-center mb-4 pb-3 border-bottom">
            <Button
              variant={listingType === 'produce' ? 'success' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 rounded-pill px-3 py-2 fw-semibold"
              onClick={() => setListingType('produce')}
            >
              <GiCarrot /> Vegetables & Fruits
            </Button>
            <Button
              variant={listingType === 'livestock' ? 'success' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 rounded-pill px-3 py-2 fw-semibold"
              onClick={() => setListingType('livestock')}
            >
              <GiCow /> Livestock
            </Button>
            <Button
              variant={listingType === 'rental' ? 'success' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 rounded-pill px-3 py-2 fw-semibold"
              onClick={() => setListingType('rental')}
            >
              <FaTractor /> Machinery Rental
            </Button>
            <Button
              variant={listingType === 'land' ? 'success' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 rounded-pill px-3 py-2 fw-semibold"
              onClick={() => setListingType('land')}
            >
              <FaMapMarkedAlt /> Farmland
            </Button>
            <Button
              variant={listingType === 'fertilizer' ? 'success' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 rounded-pill px-3 py-2 fw-semibold"
              onClick={() => setListingType('fertilizer')}
            >
              <GiFertilizerBag /> Fertilizers & Seeds
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Listing published successfully! Redirecting...</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Common Title & District */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Listing Title</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  listingType === 'produce' ? 'e.g. Fresh Melur Country Tomatoes' :
                  listingType === 'livestock' ? 'e.g. Pure Kangeyam Bull Pair' :
                  listingType === 'rental' ? 'e.g. Mahindra 575 DI Tractor with Rotavator' :
                  listingType === 'land' ? 'e.g. 4 Acres Red Soil Farmland with 2 Borewells' :
                  'e.g. Pure Neem Cake Organic Manure 50kg'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="g-3 mb-3">
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
                    <option value="Tiruppur">Tiruppur</option>
                    <option value="Salem">Salem</option>
                    <option value="Theni">Theni</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Village / Taluk / Local Area</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Melur / Alangulam"
                    value={areaOrVillage}
                    onChange={(e) => setAreaOrVillage(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Produce Specific Fields */}
            {listingType === 'produce' && (
              <Row className="g-3 mb-3">
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Category</Form.Label>
                    <Form.Select value={produceCategory} onChange={(e) => setProduceCategory(e.target.value)}>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Price per kg/unit (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 35"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Available Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Check
                    type="checkbox"
                    id="org-chk"
                    label="Certified Organic / Natural Zero-Chemical Farming"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="small text-success fw-semibold"
                  />
                </Col>
              </Row>
            )}

            {/* Livestock Specific Fields */}
            {listingType === 'livestock' && (
              <Row className="g-3 mb-3">
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Category</Form.Label>
                    <Form.Select value={livestockCategory} onChange={(e) => setLivestockCategory(e.target.value)}>
                      <option value="Cows">Cows</option>
                      <option value="Buffaloes">Buffaloes</option>
                      <option value="Goats">Goats</option>
                      <option value="Sheep">Sheep</option>
                      <option value="Chickens">Chickens</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Breed Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Kangeyam / Murrah"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Total Asking Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 85000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Gender</Form.Label>
                    <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Pair">Pair</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Age (Years)</Form.Label>
                    <Form.Control
                      type="number"
                      value={ageValue}
                      onChange={(e) => setAgeValue(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Daily Milk Yield (Liters)</Form.Label>
                    <Form.Control
                      type="number"
                      value={milkYield}
                      onChange={(e) => setMilkYield(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Rental Specific Fields */}
            {listingType === 'rental' && (
              <Row className="g-3 mb-3">
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Machinery Category</Form.Label>
                    <Form.Select value={rentalCategory} onChange={(e) => setRentalCategory(e.target.value)}>
                      <option value="Tractors">Tractor</option>
                      <option value="Harvesters">Combine Harvester</option>
                      <option value="Agricultural Drones">Agricultural Drone</option>
                      <option value="Sprayers">Sprayers</option>
                      <option value="Rotavators">Rotavator</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Hourly Rate (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="650"
                      value={hourlyPrice}
                      onChange={(e) => setHourlyPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Daily Rate (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="4800"
                      value={dailyPrice}
                      onChange={(e) => setDailyPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Land Specific Fields */}
            {listingType === 'land' && (
              <Row className="g-3 mb-3">
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Total Land Extent</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      value={totalArea}
                      onChange={(e) => setTotalArea(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Area Unit</Form.Label>
                    <Form.Select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                      <option value="Acres">Acres</option>
                      <option value="Cents">Cents</option>
                      <option value="Hectares">Hectares</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Total Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 3500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Soil Type</Form.Label>
                    <Form.Select value={soilType} onChange={(e) => setSoilType(e.target.value)}>
                      <option value="Red Soil">Red Soil</option>
                      <option value="Black Cotton Soil">Black Cotton Soil</option>
                      <option value="Alluvial Soil">Alluvial Soil</option>
                      <option value="Clay Loam">Clay Loam</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Water Source</Form.Label>
                    <Form.Select value={waterSource} onChange={(e) => setWaterSource(e.target.value)}>
                      <option value="Borewell Available">Borewell Available</option>
                      <option value="Canal Irrigation">Canal Irrigation</option>
                      <option value="Open Well">Open Well</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Detailed Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe condition, variety, field notes, harvest schedule..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Photos Upload */}
            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-muted">Upload Photos (up to 5)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <div className="d-flex gap-2 mt-2">
                  {imagePreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="preview"
                      className="rounded-2 border"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              )}
            </Form.Group>

            <Button
              type="submit"
              className="btn-primary-green w-100 py-3 fw-bold fs-6 shadow-sm"
              disabled={submitting}
            >
              {submitting ? 'Publishing Listing...' : 'Publish Listing on MARUTHAM'}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default CreateListing;

