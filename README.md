# 🌱 MARUTHAM (மருதம்) – Integrated Agriculture Ecosystem

> **"One Platform. Every Agricultural Need."**

MARUTHAM is a complete, modern, responsive, full-stack digital agriculture ecosystem designed to connect farmers, wholesale buyers, livestock breeders, agricultural machinery owners, and farmland owners across Tamil Nadu through a unified platform.

---

## 🌟 Key Features & Ecosystem Modules

### 1. 🥕 Vegetable & Fruits Marketplace
- Direct farm-gate produce listings with high-resolution imagery, variety, unit prices (₹/kg), and available stock.
- Multi-parameter filtering by crop category, certified organic tag, price slider, and Tamil Nadu district.
- Direct buyer-to-farmer communication and integrated shopping basket with cash-on-delivery and digital payment options.

### 2. 🐄 Indigenous Livestock Marketplace
- Purebred livestock listings for Kangeyam cattle, Murrah dairy buffaloes, Jamnapari breeding goats, and Aseel fighting roosters.
- Detailed veterinary pedigree: age, gender, lactation cycle, daily milk yields, and vaccination verification proofs.
- Direct phone dialing and in-app negotiation messaging.

### 3. 🚜 Agricultural Machinery & Drone Rentals
- Custom hiring fleet of heavy-duty tractors (with rotavator, disc plough, and cultivator attachments), combine rubber-track paddy harvesters, and precision spraying drones.
- Dynamic rental cost estimator supporting both hourly and daily booking intervals.
- Driver/operator inclusion options and reservation request management for fleet owners.

### 4. 🏞️ Agricultural Land Marketplace
- Verified agricultural properties, coconut groves, Cauvery delta wetland plots, and organic farmlands.
- Critical agronomic specifications: total extent in acres/cents, soil type classification, borewells, free agricultural power (TANGEDCO), and road connectivity.
- Interactive OpenStreetMap / Leaflet location rendering.
- **Mandatory Legal Disclaimer:** Comprehensive notice guiding buyers to verify patta, chitta, encumbrance certificates (EC), and revenue boundaries independently.

### 5. 🌾 Fertilizers, Seeds & Farm Equipment
- Cold-pressed pure neem cake, vermicompost, traditional fermented Panchagavya, and Bio-NPK consortia.
- Certified hybrid vegetable seeds and inline drip irrigation hardware bundles.

### 6. 🤖 AI Crop Disease Finder (Powered by Google Gemini Vision)
- Multimodal AI pathology engine analyzing photos of infected leaves, stems, or fruits.
- Immediate diagnostic reports containing:
  - Identified botanical crop name
  - Pathogen and disease name (or Healthy Foliage verification)
  - Diagnostic confidence rating
  - Visible leaf symptoms
  - Biological causes
  - Curative spray prescriptions with exact dosages benchmarked to TNAU guidelines
  - Long-term preventive agronomic practices
- 1-Click quick test demonstration samples for instant evaluation.
- Analysis history persistence.

### 7. 📖 Agriculture Knowledge Hub
- Agronomy manuals on the System of Rice Intensification (SRI), bio-fertilizer formulations, drip fertigation, and pest vector management.
- Comprehensive guides on Tamil Nadu solar pump subsidies and PM-KUSUM initiatives.

### 8. 💬 Farmers Community Forum
- Farmer social discussion feed with category filters, image attachments, like toggles, community comments, and moderation reporting queues.

### 9. ☀️ Agrometeorology & Mandi Market Prices
- Live 7-day meteorological forecast with district-level temperature, humidity, wind velocity, and farmer agronomy advisories.
- Real-time wholesale mandi rates from regulated market committees across Tamil Nadu (Madurai Mattuthavani, Koyambedu, Coimbatore Gandhi Market, Thanjavur Uzhavar Sandhai, etc.).

### 10. 👤 Personal User Dashboard & 🛡️ Admin Console
- **User Dashboard:** Order tracking, rental booking status, my produce listings, disease history, and profile customization.
- **Admin Console:** Platform analytics, registered user management with role promotions, community report queue moderation, and order volume auditing.

### 11. 🌐 Dual-Language Support (English / தமிழ்)
- Instant toggle between English and Tamil with contextual agricultural terminology.

---

## 💻 Technology Stack

- **Frontend:** React 18, Vite, Bootstrap 5, React Bootstrap, React Router DOM v6, React Icons, Context API, Leaflet / React-Leaflet, Axios.
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, bcryptjs, Multer file upload, Socket.IO.
- **AI Vision:** Google Gemini API (`@google/generative-ai`) with intelligent botanical diagnostic knowledge fallback.
- **Database & Zero-Config Storage:** Auto-detects local MongoDB daemon or transparently spins up an in-memory database with rich Tamil Nadu agricultural seed data.

---

## 🚀 Quick Start Guide

### 1. Installation
All client and server dependencies are already installed in this repository. To reinstall at any time:
```bash
npm run install-all
```

### 2. Environment Configuration
The backend configuration is located in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/marutham
JWT_SECRET=marutham_jwt_secret_super_secure_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Optionally paste your Google Gemini API key into `GEMINI_API_KEY` for live image vision diagnostics).*

### 3. Running the Full-Stack Application

#### Unified Mode (Frontend + Backend on single port `5000`):
```bash
cd server
npm start
```
Open your browser at: **`http://localhost:5000`**

#### Development Mode (With Vite Hot-Reload on `5173`):
Terminal 1 (Backend API):
```bash
cd server
npm start
```
Terminal 2 (Frontend Client):
```bash
cd client
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

For quick evaluation, click the **"One-Click Quick Demo Login"** buttons on the Login screen, or use:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@marutham.com` | `admin123` |
| **Farmer (Selvakumar)** | `selvam@marutham.com` | `farmer123` |
| **Farmer (Marimuthu)** | `marimuthu@marutham.com` | `farmer123` |
| **Machinery Provider (Velu)**| `velu@marutham.com` | `service123` |
| **Buyer (Anand)** | `anand@marutham.com` | `buyer123` |

---

## 🎨 Brand Color Palette

- **Primary Green:** `#14532D`
- **Secondary Green:** `#166534`
- **Light Green:** `#DCFCE7`
- **Background:** `#F8FAF5`
- **Accent Gold:** `#EAB308`
- **Text:** `#1F2937`

