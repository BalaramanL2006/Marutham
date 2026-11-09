import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Livestock from '../models/Livestock.js';
import RentalEquipment from '../models/RentalEquipment.js';
import AgriculturalLand from '../models/AgriculturalLand.js';
import AgricultureArticle from '../models/AgricultureArticle.js';
import CommunityPost from '../models/CommunityPost.js';
import Order from '../models/Order.js';

export const seedDatabase = async (force = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      console.log('🌱 Database already populated with records. Skipping seed.');
      return;
    }

    console.log('🌾 Populating MARUTHAM ecosystem with rich agricultural data...');

    if (force) {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Livestock.deleteMany({});
      await RentalEquipment.deleteMany({});
      await AgriculturalLand.deleteMany({});
      await AgricultureArticle.deleteMany({});
      await CommunityPost.deleteMany({});
      await Order.deleteMany({});
    }

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'MARUTHAM Admin',
      email: 'admin@marutham.com',
      password: 'admin123',
      phone: '9840123456',
      role: 'admin',
      location: { district: 'Chennai', state: 'Tamil Nadu' },
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      bio: 'Head of MARUTHAM Digital Agriculture Ecosystem Operations.'
    });

    const farmerSelvam = await User.create({
      name: 'K. Selvakumar',
      email: 'selvam@marutham.com',
      password: 'farmer123',
      phone: '9842511223',
      role: 'farmer',
      location: { villageOrArea: 'Melur', district: 'Madurai', state: 'Tamil Nadu' },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Natural & organic vegetable farmer with 18 years of field cultivation experience.'
    });

    const farmerMarimuthu = await User.create({
      name: 'M. Marimuthu',
      email: 'marimuthu@marutham.com',
      password: 'farmer123',
      phone: '9443198765',
      role: 'farmer',
      location: { villageOrArea: 'Papanasam', district: 'Thanjavur', state: 'Tamil Nadu' },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Cauvery delta paddy cultivator and livestock breeder specialized in indigenous cattle.'
    });

    const serviceProviderVelu = await User.create({
      name: 'Velu Agro Equipment Rentals',
      email: 'velu@marutham.com',
      password: 'service123',
      phone: '9789065432',
      role: 'service_provider',
      location: { villageOrArea: 'Pollachi', district: 'Coimbatore', state: 'Tamil Nadu' },
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      bio: 'Modern agricultural machinery rental fleet including tractors, harvesters, and sprayers.'
    });

    const buyerAnand = await User.create({
      name: 'Anand Kumar (Green Basket Mart)',
      email: 'anand@marutham.com',
      password: 'buyer123',
      phone: '9841054321',
      role: 'buyer',
      location: { district: 'Chennai', state: 'Tamil Nadu' },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Wholesale aggregator procuring fresh farm-gate harvest directly from Tamil Nadu farmers.'
    });

    console.log('✅ Demo users seeded successfully');

    // 2. Seed Vegetables & Fruits
    await Product.create([
      {
        title: 'Fresh Farm Country Tomatoes (நாட்டு தக்காளி)',
        category: 'Vegetables',
        subcategory: 'Tomatoes',
        price: 32,
        unit: 'kg',
        quantity: 850,
        minOrderQuantity: 5,
        description: 'Juicy, naturally ripened heirloom country tomatoes harvested fresh at dawn from fertile red soil plots in Melur. Rich in lycopene and traditional tangy aroma.',
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Melur', district: 'Madurai', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        isOrganic: true,
        harvestDate: new Date(),
        rating: 4.9,
        reviewsCount: 28
      },
      {
        title: 'Premium Small Shallots / Sambhar Onion (சின்ன வெங்காயம்)',
        category: 'Vegetables',
        subcategory: 'Onions',
        price: 72,
        unit: 'kg',
        quantity: 1200,
        minOrderQuantity: 10,
        description: 'Top-grade dried shallots with paper-thin ruby skins and intense pungent flavor. Essential for traditional South Indian cuisine and long shelf storage.',
        images: [
          'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Perambalur', district: 'Perambalur', state: 'Tamil Nadu' },
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        isOrganic: false,
        harvestDate: new Date(),
        rating: 4.8,
        reviewsCount: 34
      },
      {
        title: 'Tender Organic Moringa / Drumstick (முருங்கைக்காய்)',
        category: 'Vegetables',
        subcategory: 'Drumsticks',
        price: 58,
        unit: 'kg',
        quantity: 450,
        minOrderQuantity: 2,
        description: 'PKM-1 variety fleshy, tender drumsticks with thick pulp and zero bitterness. Grown with vermicompost and cow dung manure in Dindigul.',
        images: [
          'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Oddanchatram', district: 'Dindigul', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        isOrganic: true,
        harvestDate: new Date(),
        rating: 4.9,
        reviewsCount: 19
      },
      {
        title: 'Traditional Red Banana (செவ்வாழை பழம்)',
        category: 'Fruits',
        subcategory: 'Bananas',
        price: 85,
        unit: 'kg',
        quantity: 320,
        minOrderQuantity: 3,
        description: 'Nutrient-packed Sevvazhai red bananas known for high beta-carotene and natural sweet creamy taste. Grown along the lush Thamirabarani riverbed.',
        images: [
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Ambasamudram', district: 'Tirunelveli', state: 'Tamil Nadu' },
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        isOrganic: true,
        harvestDate: new Date(),
        rating: 5.0,
        reviewsCount: 42
      },
      {
        title: 'Spicy Green Chilli Bullet (பச்சை மிளகாய்)',
        category: 'Vegetables',
        subcategory: 'Chillies',
        price: 44,
        unit: 'kg',
        quantity: 600,
        minOrderQuantity: 5,
        description: 'Vibrant green, highly pungent fresh green chillies harvested at peak crispiness. Excellent for spice processing and commercial culinary kitchens.',
        images: [
          'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Sathyamangalam', district: 'Erode', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        isOrganic: false,
        harvestDate: new Date(),
        rating: 4.7,
        reviewsCount: 15
      },
      {
        title: 'Neem Cake Organic Manure 50kg (தூய வேப்பம் புண்ணாக்கு)',
        category: 'Organic Fertilizers',
        subcategory: 'Soil Conditioners',
        price: 1350,
        unit: 'packet',
        quantity: 80,
        minOrderQuantity: 1,
        description: '100% pure expeller cold-pressed neem cake. Enhances nitrogen uptake, eliminates soil nematodes, and protects root systems from subterranean pests.',
        images: [
          'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Erode', district: 'Erode', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        isOrganic: true,
        rating: 4.9,
        reviewsCount: 31
      },
      {
        title: 'Panchagavya Organic Bio-Stimulant 5L (பாரம்பரிய பஞ்சகவ்யா)',
        category: 'Organic Fertilizers',
        subcategory: 'Bio Growth Stimulants',
        price: 650,
        unit: 'piece',
        quantity: 110,
        minOrderQuantity: 1,
        description: 'Crafted using five indigenous cow products (milk, curd, ghee, urine, dung) fermented with sugarcane juice, tender coconut water, and ripe bananas. Fast-tracks vegetative vigor.',
        images: [
          'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        isOrganic: true,
        rating: 5.0,
        reviewsCount: 22
      },
      {
        title: 'Premium Drip Irrigation Kit 16mm (1 Acre Complete Set)',
        category: 'Irrigation Equipment',
        subcategory: 'Drip Systems',
        price: 8900,
        unit: 'piece',
        quantity: 25,
        minOrderQuantity: 1,
        description: 'Complete 1-acre micro irrigation set including 16mm inline dripper lateral tubes, screen filter, venturi fertigation injector, flush valves, and micro fittings.',
        images: [
          'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'
        ],
        location: { city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
        seller: serviceProviderVelu._id,
        sellerContact: { name: serviceProviderVelu.name, phone: serviceProviderVelu.phone },
        isOrganic: false,
        rating: 4.8,
        reviewsCount: 16
      }
    ]);
    console.log('✅ Products & fertilizers seeded');

    // 3. Seed Livestock
    await Livestock.create([
      {
        title: 'Pure Breed Kangeyam Bull Pair (காங்கேயம் காளை ஜோடி)',
        category: 'Cows',
        breed: 'Kangeyam Indigenous',
        age: { value: 3, unit: 'years' },
        gender: 'Pair',
        healthInfo: 'Excellent vigor, strong hooves, vaccinated against FMD and black quarter.',
        milkProduction: { litersPerDay: 0 },
        weightKg: 820,
        price: 165000,
        isNegotiable: true,
        images: [
          'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Magnificent pair of drought-hardy Kangeyam bulls trained for ploughing and bullock cart transit. Acclaimed for tireless field endurance in tough soils.',
        location: { village: 'Kangeyam', city: 'Tiruppur', district: 'Tiruppur', state: 'Tamil Nadu' },
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        status: 'available',
        vaccinationProof: true
      },
      {
        title: 'High Yield Murrah Buffalo with Female Calf (முர்ரா எருமை)',
        category: 'Buffaloes',
        breed: 'Murrah Dairy Line',
        age: { value: 4, unit: 'years' },
        gender: 'Female',
        healthInfo: 'Second lactation cycle, calm temperament, tested tuberculosis free.',
        milkProduction: { litersPerDay: 14, lactationCycle: '2nd Calving' },
        weightKg: 540,
        price: 88000,
        isNegotiable: true,
        images: [
          'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Prime quality Murrah dairy buffalo yielding 14 liters high-fat milk (7.8% fat) daily. Delivered with 20-day-old female calf.',
        location: { village: 'Thiruvaiyaru', city: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        status: 'available',
        vaccinationProof: true
      },
      {
        title: 'Breeding Jamnapari Buck & Goat Trio (ஜமுனாபாரி ஆடுகள்)',
        category: 'Goats',
        breed: 'Pure Jamnapari',
        age: { value: 18, unit: 'months' },
        gender: 'Pair',
        healthInfo: 'Fully dewormed, vaccinated against PPR and Enterotoxaemia.',
        milkProduction: { litersPerDay: 2.5 },
        weightKg: 65,
        price: 36000,
        isNegotiable: true,
        images: [
          'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Long-eared majestic Jamnapari goats. Ideal foundation breeding stock for intensive stall-fed meat and milk farming.',
        location: { village: 'Sankarankovil', city: 'Tenkasi', district: 'Tenkasi', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        status: 'available',
        vaccinationProof: true
      },
      {
        title: 'Original Tamil Nadu Aseel Fighting Rooster (அசல் சண்டை சேவல்)',
        category: 'Chickens',
        breed: 'Aseel Peela / Kattu Seval',
        age: { value: 14, unit: 'months' },
        gender: 'Male',
        healthInfo: 'Vaccinated with Lasota & F1, muscular build and tall aggressive posture.',
        milkProduction: { litersPerDay: 0 },
        weightKg: 3.8,
        price: 8500,
        isNegotiable: false,
        images: [
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Pure line Aseel rooster with broad chest, bone-heavy bone structure, and glistening plumage. Raised freely in open coconut orchards.',
        location: { village: 'Usilampatti', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        status: 'available',
        vaccinationProof: true
      }
    ]);
    console.log('✅ Livestock seeded');

    // 4. Seed Rentals & Equipment
    await RentalEquipment.create([
      {
        title: 'Mahindra 575 DI 45HP Tractor + Rotavator & MB Plough',
        category: 'Tractors',
        brandModel: 'Mahindra 575 DI Sarpanch (45 HP)',
        powerHp: '45 HP',
        rentalPricePerHour: 650,
        rentalPricePerDay: 4800,
        securityDeposit: 2000,
        withDriver: true,
        driverChargesIncluded: true,
        fuelPolicy: 'Client arranges diesel or reimburses at pump price.',
        images: [
          'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Well-maintained Mahindra 575 DI tractor equipped with Shaktiman rotavator, cultivator, and double reversible disc plough. Includes an experienced field driver.',
        location: { area: 'Pollachi Taluk', city: 'Pollachi', district: 'Coimbatore', state: 'Tamil Nadu' },
        owner: serviceProviderVelu._id,
        ownerContact: { name: serviceProviderVelu.name, phone: serviceProviderVelu.phone },
        status: 'available',
        rating: 4.9
      },
      {
        title: 'Kubota Combine Paddy Harvester DC-68G (அறுவடை இயந்திரம்)',
        category: 'Harvesters',
        brandModel: 'Kubota DC-68G Rubber Track',
        powerHp: '68 HP Turbo',
        rentalPricePerHour: 2200,
        rentalPricePerDay: 16000,
        securityDeposit: 5000,
        withDriver: true,
        driverChargesIncluded: true,
        fuelPolicy: 'Machine delivered with full tank; customer tops up fuel as needed.',
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Rubber-crawler combine harvester specifically designed for marshy delta wetlands. Clean grain threshing with less than 1.5% field loss.',
        location: { area: 'Cauvery Basin', city: 'Kumbakonam', district: 'Thanjavur', state: 'Tamil Nadu' },
        owner: serviceProviderVelu._id,
        ownerContact: { name: serviceProviderVelu.name, phone: serviceProviderVelu.phone },
        status: 'available',
        rating: 5.0
      },
      {
        title: 'High-Tech Agricultural Drone Spraying Rig (16-Liter T16)',
        category: 'Agricultural Drones',
        brandModel: 'Agras 16L Precision Spray Drone',
        powerHp: 'Electric Quad-Battery System',
        rentalPricePerHour: 950,
        rentalPricePerDay: 6500,
        securityDeposit: 3000,
        withDriver: true,
        driverChargesIncluded: true,
        fuelPolicy: 'DGCA Certified Drone Pilot + Field Assistant included. Zero fuel needed (battery generator provided).',
        images: [
          'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Complete 10-acre foliage spray in under 45 minutes! Precise micron droplet dispersion for pesticides, foliar nutrients, and bio-fungicides with zero crop trampling.',
        location: { area: 'Madurai Bypass', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
        owner: serviceProviderVelu._id,
        ownerContact: { name: serviceProviderVelu.name, phone: serviceProviderVelu.phone },
        status: 'available',
        rating: 4.9
      }
    ]);
    console.log('✅ Rental equipment seeded');

    // 5. Seed Agricultural Lands
    await AgriculturalLand.create([
      {
        title: '4.5 Acres Fertile Red Soil Land with 2 Borewells & Free Agri Power',
        totalArea: 4.5,
        areaUnit: 'Acres',
        price: 3600000,
        pricePerUnit: 800000,
        location: {
          village: 'Alangulam',
          taluk: 'Tenkasi Taluk',
          district: 'Tirunelveli',
          state: 'Tamil Nadu',
          coordinates: { lat: 8.8711, lng: 77.4988 }
        },
        soilType: 'Red Soil',
        waterSource: 'Borewell Available',
        borewellCount: 2,
        freeElectricity: true,
        roadAccess: 'Tar Road Frontage',
        fencingAvailable: true,
        cropSuitability: ['Country Tomatoes', 'Cotton', 'Moringa', 'Pomegranate', 'Groundnut'],
        documentsAvailable: ['Clear Patta', 'Chitta 2026', 'Nil Encumbrance Certificate 30 Years', 'FMB Sketch'],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Prime agricultural property with continuous 3.5-inch water supply from 2 energetic borewells. Comes with active Tamil Nadu TANGEDCO Free Agri Power connection (7.5 HP). Entire boundary barbed-wire fenced with iron gate.',
        seller: farmerSelvam._id,
        sellerContact: { name: farmerSelvam.name, phone: farmerSelvam.phone },
        status: 'available',
        isVerifiedListing: true
      },
      {
        title: '8.2 Acres Canal-Fed Cauvery Delta Paddy Farmland',
        totalArea: 8.2,
        areaUnit: 'Acres',
        price: 9840000,
        pricePerUnit: 1200000,
        location: {
          village: 'Thirunageswaram',
          taluk: 'Kumbakonam',
          district: 'Thanjavur',
          state: 'Tamil Nadu',
          coordinates: { lat: 10.9602, lng: 79.4326 }
        },
        soilType: 'Alluvial Soil',
        waterSource: 'Canal Irrigation',
        borewellCount: 1,
        freeElectricity: true,
        roadAccess: 'Tar Road Frontage',
        fencingAvailable: false,
        cropSuitability: ['Kuruvai Paddy', 'Samba Rice', 'Blackgram', 'Sugarcane'],
        documentsAvailable: ['Computer Patta', 'Adangal', 'Legal Heir Clear Title'],
        images: [
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Pristine granary land situated inside the famed Cauvery irrigation branch channel network. Consistently yields 40+ bags per acre. Direct 24ft panchayat tar road access.',
        seller: farmerMarimuthu._id,
        sellerContact: { name: farmerMarimuthu.name, phone: farmerMarimuthu.phone },
        status: 'available',
        isVerifiedListing: true
      },
      {
        title: '11.5 Acres Coconut & Cocoa Integrated Agro-Farm',
        totalArea: 11.5,
        areaUnit: 'Acres',
        price: 18400000,
        pricePerUnit: 1600000,
        location: {
          village: 'Anaimalai Foot Hills',
          taluk: 'Pollachi',
          district: 'Coimbatore',
          state: 'Tamil Nadu',
          coordinates: { lat: 10.5841, lng: 76.9372 }
        },
        soilType: 'Clay Loam',
        waterSource: 'Open Well',
        borewellCount: 3,
        freeElectricity: true,
        roadAccess: 'NH/SH Highway Proximity',
        fencingAvailable: true,
        cropSuitability: ['Coconut (850 palms)', 'Cocoa Intercrop', 'Nutmeg', 'Vanilla'],
        documentsAvailable: ['Clear Single Owner Patta', 'EC for 40 Years', 'Survey Map'],
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Fully revenue-generating plantation with 850 bearing Chowghat Green and West Coast Tall coconut trees. Automated drip fertigation unit and 2-room worker quarters on-site.',
        seller: serviceProviderVelu._id,
        sellerContact: { name: serviceProviderVelu.name, phone: serviceProviderVelu.phone },
        status: 'available',
        isVerifiedListing: true
      }
    ]);
    console.log('✅ Agricultural land listings seeded');

    // 6. Seed Knowledge Hub Articles
    await AgricultureArticle.create([
      {
        title: 'System of Rice Intensification (SRI): A Comprehensive Guide to Doubling Paddy Yields',
        slug: 'system-of-rice-intensification-sri-guide',
        category: 'Crop Cultivation',
        summary: 'How square planting, single-seedling transplanting, and cono-weeder aeration reduce seed and water costs while increasing grain tillers.',
        content: `The System of Rice Intensification (SRI), developed to enhance food security with fewer inputs, is transforming delta agriculture. Unlike traditional continuous flooding, SRI keeps soils moist rather than waterlogged.

Key Principles of SRI:
1. Young Seedlings: Transplant 10 to 12-day-old single seedlings with seed and soil intact.
2. Wide Spacing: Maintain 25cm x 25cm square pattern to give each root system room to breathe.
3. Cono-Weeding: Run a rotary cono-weeder 4 times at 10-day intervals. This incorporates weeds back into the mud as green manure and aerates roots.
4. Alternate Wetting & Drying: Irrigate with 2.5cm water only when microscopic hairline cracks appear on soil surface.

Benefits recorded by TNAU include 30-40% water savings, 80% reduction in seed quantity, and 15-30% boost in overall harvest output.`,
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
        readTime: '6 min read',
        author: { name: 'Dr. S. Ramanathan', role: 'Chief Agronomist, TNAU' },
        tags: ['Paddy', 'SRI Method', 'Water Conservation', 'Rice Cultivation'],
        featured: true
      },
      {
        title: 'Preparation & Application of Traditional Panchagavya and Jeevamrutha',
        slug: 'traditional-panchagavya-jeevamrutha-guide',
        category: 'Organic Farming',
        summary: 'Step-by-step masterclass on fermenting beneficial soil microbes using indigenous cow dung, urine, jaggery, and pulse flour.',
        content: `Organic farming relies on living soil teeming with beneficial bacteria and mycorrhizal fungi. Panchagavya and Jeevamrutha provide natural bio-enzymes and micro-nutrients that chemical fertilizers cannot replicate.

How to make 200L Jeevamrutha:
- 10 kg fresh Desi Cow Dung
- 10 Liters Cow Urine (Gomutra)
- 2 kg Organic Jaggery
- 2 kg Besan / Gram Flour
- 1 handful of virgin soil from bund or banyan tree base
- 200 Liters non-chlorinated water

Stir clockwise twice daily for 4 to 5 days under shade. Filter and apply through irrigation channels or spray @ 10% concentration every 15 days.`,
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
        readTime: '4 min read',
        author: { name: 'V. Sundaramurthy', role: 'Senior Organic Farming Consultant' },
        tags: ['Organic Farming', 'Panchagavya', 'Jeevamrutha', 'Soil Health'],
        featured: true
      },
      {
        title: 'Government Solar Pump Subsidy Schemes in Tamil Nadu: How to Apply',
        slug: 'tamil-nadu-solar-pump-subsidy-scheme-guide',
        category: 'Government Schemes',
        summary: 'Detailed roadmap to obtaining up to 70% state subsidy for standalone AC/DC agricultural solar pump sets under the PM-KUSUM initiative.',
        content: `The Department of Agricultural Engineering in Tamil Nadu, in coordination with the central PM-KUSUM component-B scheme, offers 70% financial subsidy for farmers installing 5 HP, 7.5 HP, and 10 HP solar-powered irrigation water pumps.

Eligibility Requirements:
- Land ownership patta / chitta in farmer's name.
- Valid functional open well or borewell with adequate ground aquifer test.
- Priority given to tail-end delta farmers and rainfed dry tracts.
- Applications submitted online through the Uzhavan App or local Assistant Executive Engineer (AE) office.`,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        readTime: '5 min read',
        author: { name: 'MARUTHAM Policy Desk', role: 'Agri Extension Coordinator' },
        tags: ['Subsidies', 'PM KUSUM', 'Solar Pumps', 'Govt Schemes'],
        featured: false
      }
    ]);
    console.log('✅ Knowledge hub articles seeded');

    // 7. Seed Community Posts
    await CommunityPost.create([
      {
        author: farmerSelvam._id,
        title: 'Overcoming Whitefly Attack on Summer Chillies with Yellow Sticky Traps & Neem Oil',
        content: 'Fellow farmers, last month my G-4 chilli plants began curling at the tips due to whiteflies. Instead of heavy chemical insecticides, I set up 20 yellow sticky traps per acre and sprayed 5% NSKE (Neem Seed Kernel Extract) with soapnut. Within 10 days the pest population dropped by 80%! Sharing this practical experience to help others.',
        category: 'Pest Control',
        tags: ['Chilli', 'Whitefly', 'NeemOil', 'IPM'],
        images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80'],
        likes: [farmerMarimuthu._id, buyerAnand._id],
        commentsCount: 2
      },
      {
        author: farmerMarimuthu._id,
        title: 'Bumper Harvest: 42 Bags of Samba CR-1009 Sub-1 Paddy in Thanjavur!',
        content: 'Delighted to share our monsoon harvest results. Despite unseasonal cyclone rains in November, the flood-submergence tolerant CR-1009 Sub-1 rice stood strong and recovered quickly. Highly recommend this variety for low-lying delta riverbeds.',
        category: 'Success Stories',
        tags: ['PaddyHarvest', 'Thanjavur', 'CR1009', 'FarmerPride'],
        images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'],
        likes: [farmerSelvam._id, serviceProviderVelu._id, buyerAnand._id],
        commentsCount: 4
      }
    ]);
    console.log('✅ Community posts seeded');

    console.log('🎉 MARUTHAM database seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

