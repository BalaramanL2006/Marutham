import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, InputGroup } from 'react-bootstrap';
import {
  FaCloudSun,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaUmbrella,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import api from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const WeatherMarket = () => {
  const { language, t } = useLanguage();

  const [selectedDistrict, setSelectedDistrict] = useState('madurai');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Market Prices State
  const [marketPrices, setMarketPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [priceSearch, setPriceSearch] = useState('');
  const [priceDistrict, setPriceDistrict] = useState('All');
  const [priceCategory, setPriceCategory] = useState('All');

  // Fetch Weather
  const fetchWeather = async (district) => {
    try {
      setWeatherLoading(true);
      const res = await api.get(`/weather?district=${district}`);
      if (res.data.success) {
        setWeatherData(res.data);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch Market Prices
  const fetchMarketPrices = async () => {
    try {
      setPricesLoading(true);
      const params = {};
      if (priceDistrict && priceDistrict !== 'All') params.district = priceDistrict;
      if (priceCategory && priceCategory !== 'All') params.category = priceCategory;
      if (priceSearch) params.search = priceSearch;

      const res = await api.get('/market-prices', { params });
      if (res.data.success) {
        setMarketPrices(res.data.prices || []);
      }
    } catch (err) {
      console.error('Error fetching market prices:', err);
    } finally {
      setPricesLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
  }, [selectedDistrict]);

  useEffect(() => {
    fetchMarketPrices();
  }, [priceDistrict, priceCategory]);

  const handlePriceSearch = (e) => {
    e.preventDefault();
    fetchMarketPrices();
  };

  const districts = [
    { id: 'madurai', name: 'Madurai' },
    { id: 'coimbatore', name: 'Coimbatore' },
    { id: 'thanjavur', name: 'Thanjavur' },
    { id: 'tirunelveli', name: 'Tirunelveli' },
    { id: 'trichy', name: 'Tiruchirappalli' },
    { id: 'salem', name: 'Salem' },
    { id: 'erode', name: 'Erode' },
    { id: 'chennai', name: 'Chennai' }
  ];

  return (
    <div className="weather-market-page py-4">
      <Container>
        {/* Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
          <Row className="align-items-center">
            <Col md={8}>
              <span className="section-badge mb-1">
                ☀️ {language === 'ta' ? 'வேளாண் வானிலை & விலை நிலவரம்' : 'Agro-Meteorology & Mandi Intelligence'}
              </span>
              <h1 className="fw-bolder fs-2 mb-1">
                {language === 'ta' ? 'வானிலை மற்றும் சந்தை விலை நிலவரம்' : 'Weather & Daily APMC Market Prices'}
              </h1>
              <p className="text-muted small m-0">
                Real-time agrometeorological advisories and verified daily agricultural produce rates from regulated Tamil Nadu wholesale markets.
              </p>
            </Col>
            <Col md={4} className="mt-3 mt-md-0 text-md-end">
              <span className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold small">
                Live Data Feed Active
              </span>
            </Col>
          </Row>
        </div>

        {/* Section 1: Weather Widget */}
        <Card className="border shadow-sm rounded-4 p-4 mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
              <FaCloudSun className="text-warning" size={24} />
              <span>Agro-Weather Forecast: {weatherData?.location}</span>
            </h5>

            {/* District Selector */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-semibold">Select District:</span>
              <Form.Select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                size="sm"
                style={{ width: '160px' }}
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Form.Select>
            </div>
          </div>

          {weatherLoading ? (
            <LoadingSpinner message="Consulting agrometeorological radar..." />
          ) : weatherData ? (
            <div>
              {/* Current Weather Grid */}
              <Row className="g-3 mb-4">
                <Col lg={3} sm={6}>
                  <div className="bg-light p-3 rounded-3 border h-100 text-center">
                    <div className="display-4 fw-bolder text-success">
                      {weatherData.current?.temperature}°C
                    </div>
                    <div className="fw-semibold text-dark">{weatherData.current?.condition}</div>
                    <small className="text-muted">Feels like {weatherData.current?.feelsLike}°C</small>
                  </div>
                </Col>

                <Col lg={3} sm={6}>
                  <div className="bg-light p-3 rounded-3 border h-100 d-flex flex-column justify-content-center">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <FaTint className="text-primary" /> Relative Humidity
                      </span>
                      <strong>{weatherData.current?.humidity}%</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <FaWind className="text-secondary" /> Wind Speed
                      </span>
                      <strong>{weatherData.current?.windSpeed} km/h</strong>
                    </div>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="p-3 rounded-3 border bg-success bg-opacity-10 h-100 border-success">
                    <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                      <FaShieldAlt /> Farmer Crop Weather Advisory
                    </h6>
                    <p className="small text-dark mb-0" style={{ lineHeight: '1.6' }}>
                      {weatherData.current?.advisory}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Forecast Strip */}
              {weatherData.forecast?.length > 0 && (
                <div>
                  <h6 className="fw-bold text-muted small text-uppercase mb-2">7-Day Meteorological Outlook</h6>
                  <Row className="g-2">
                    {weatherData.forecast.map((day, idx) => (
                      <Col key={idx} xs={6} md={3} lg>
                        <div className="bg-light p-2 rounded-3 text-center border">
                          <div className="small fw-bold text-dark">{day.date}</div>
                          <div className="fw-bold text-success fs-5">{day.maxTemp}° / <span className="text-muted fs-6">{day.minTemp}°</span></div>
                          <div className="small text-primary d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <FaUmbrella size={10} /> {day.rainProbability || 10}% rain
                          </div>
                          <div className="small text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                            {day.condition}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>
          ) : null}
        </Card>

        {/* Section 2: APMC Mandi Market Prices */}
        <Card className="border shadow-sm rounded-4 p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
            <div>
              <h5 className="fw-bold m-0">Daily Agricultural Commodity Mandi Rates</h5>
              <small className="text-muted">Direct wholesale benchmark from Tamil Nadu Uzhavar Sandhai & APMC markets</small>
            </div>

            {/* Search & Filters */}
            <div className="d-flex flex-wrap gap-2">
              <Form.Select
                value={priceDistrict}
                onChange={(e) => setPriceDistrict(e.target.value)}
                size="sm"
                style={{ width: '140px' }}
              >
                <option value="All">All Markets</option>
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai (Koyambedu)</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="Dindigul">Dindigul</option>
                <option value="Erode">Erode</option>
                <option value="Tirunelveli">Tirunelveli</option>
              </Form.Select>

              <Form.Select
                value={priceCategory}
                onChange={(e) => setPriceCategory(e.target.value)}
                size="sm"
                style={{ width: '130px' }}
              >
                <option value="All">All Commodities</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains & Paddy</option>
                <option value="Fruits">Fruits</option>
                <option value="Commercial">Commercial (Cotton/Turmeric)</option>
              </Form.Select>
            </div>
          </div>

          {pricesLoading ? (
            <LoadingSpinner message="Gathering daily APMC mandi updates..." />
          ) : marketPrices.length === 0 ? (
            <div className="text-center py-4 text-muted">No price records found for this filter.</div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Commodity / Crop</th>
                    <th>Wholesale Market</th>
                    <th>Variety</th>
                    <th>Unit</th>
                    <th className="text-end">Min Price</th>
                    <th className="text-end">Max Price</th>
                    <th className="text-end">Modal / Avg Price</th>
                    <th className="text-center">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {marketPrices.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-dark">{item.productName}</td>
                      <td className="small text-muted">{item.marketName}</td>
                      <td>
                        <span className="badge bg-light text-dark border small">{item.variety}</span>
                      </td>
                      <td className="small text-muted">{item.unit}</td>
                      <td className="text-end text-muted">₹{item.minPrice}</td>
                      <td className="text-end text-muted">₹{item.maxPrice}</td>
                      <td className="text-end fw-bolder fs-6 text-success">₹{item.avgPrice}</td>
                      <td className="text-center">
                        {item.trend === 'up' && (
                          <span className="badge bg-danger bg-opacity-10 text-danger" title="Price Increased">
                            <FaArrowUp /> Rising
                          </span>
                        )}
                        {item.trend === 'down' && (
                          <span className="badge bg-success bg-opacity-10 text-success" title="Price Decreased">
                            <FaArrowDown /> Falling
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="badge bg-light text-muted border" title="Stable Price">
                            <FaMinus /> Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="small text-muted text-end mt-2">
            Data Source: Tamil Nadu Agricultural Marketing Board & Regulated Market Committees.
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default WeatherMarket;

