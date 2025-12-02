require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const { nanoid } = require('nanoid');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;
const api = '/api';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Check if Razorpay credentials are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  WARNING: Razorpay credentials not found in .env file');
  console.warn('⚠️  Payment features will not work. Please create .env file with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
}

// In-memory data
const products = [
  // T-Shirts (8 products - different colors)
  { id: 'p1',  title: 'Classic Tee - White',  price: 199.99, image: 'https://images.bewakoof.com/original/men-s-white-t-shirt-mt3290b-601824-1687785224-1.jpg', category: 't-shirts' },
  { id: 'p2',  title: 'Classic Tee - Black',  price: 199.99, image: 'https://handcmediastorage.blob.core.windows.net/productimages/TH/THPZA001-A01-170421-1400px-1820px.jpg', category: 't-shirts' },
  { id: 'p3',  title: 'Classic Tee - Navy',   price: 219.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/navy_blue_plain_t-shirt_men_base_700x933.jpg', category: 't-shirts' },
  { id: 'p4',  title: 'Classic Tee - Olive',  price: 219.99, image: 'https://tearbird.com/wp-content/uploads/2023/09/Olive-Green.png', category: 't-shirts' },
  { id: 'p5',  title: 'Classic Tee - Grey',   price: 189.99, image: 'https://i5.walmartimages.com/seo/Gildan-Men-Grey-T-Shirts-Value-Pack-Shirts-Single-OR-6-12-T-shirts-Gray-T-shirt-Casual-Shirt-Basic_cc967d88-fc47-4877-91d1-49a929f89718.3feb7f05585289862b2c8f3f26ec47d3.jpeg', category: 't-shirts' },
  { id: 'p6',  title: 'Classic Tee - Maroon', price: 219.99, image: 'https://tse4.mm.bing.net/th/id/OIP.3Lt1xfzBrFppdFHiqpNHlAHaI4?rs=1&pid=ImgDetMain&o=7&rm=3', category: 't-shirts' },
  { id: 'p7',  title: 'Classic Tee - Red', price: 229.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/red_plain_t-shirt_men_base_700x933.jpg', category: 't-shirts' },
  { id: 'p8',  title: 'Classic Tee - Blue', price: 209.99, image: 'https://i.pinimg.com/originals/99/04/9f/99049fc9fe55dbecb498657fcfefe208.jpg', category: 't-shirts' },

  // Shirts (8 products - different colors)
  { id: 'p9',  title: 'Linen Shirt - Sky Blue',  price: 399.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/sky_blue_linen_shirt_men_base_700x933.jpg', category: 'shirts' },
  { id: 'p10', title: 'Linen Shirt - White',     price: 399.99, image: 'https://placehold.co/800x800/FFFFFF/000000?text=White+Shirt', category: 'shirts' },
  { id: 'p11', title: 'Oxford Shirt - Navy',     price: 449.99, image: 'https://placehold.co/800x800/001f3f/FFFFFF?text=Navy+Shirt', category: 'shirts' },
  { id: 'p12', title: 'Oxford Shirt - Pink',     price: 449.99, image: 'https://placehold.co/800x800/FF69B4/000000?text=Pink+Shirt', category: 'shirts' },
  { id: 'p13', title: 'Checked Shirt - Green',   price: 425.99, image: 'https://placehold.co/800x800/228B22/FFFFFF?text=Green+Shirt', category: 'shirts' },
  { id: 'p14', title: 'Denim Shirt - Indigo',    price: 469.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/indigo_denim_shirt_men_base_700x933.jpg', category: 'shirts' },
  { id: 'p15', title: 'Casual Shirt - Burgundy', price: 439.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/burgundy_casual_shirt_men_base_700x933.jpg', category: 'shirts' },
  { id: 'p16', title: 'Formal Shirt - Beige', price: 459.99, image: 'https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images/beige_formal_shirt_men_base_700x933.jpg', category: 'shirts' },

  // Jeans (8 products - different colors)
  { id: 'p17', title: 'Denim Jeans - Dark Blue', price: 49.99, image: 'https://placehold.co/800x800/0A2342/FFFFFF?text=Dark+Blue+Jeans', category: 'jeans' },
  { id: 'p18', title: 'Denim Jeans - Black',     price: 49.99, image: 'https://placehold.co/800x800/000000/FFFFFF?text=Black+Jeans', category: 'jeans' },
  { id: 'p19', title: 'Denim Jeans - Grey',      price: 47.99, image: 'https://placehold.co/800x800/808080/FFFFFF?text=Grey+Jeans',  category: 'jeans' },
  { id: 'p20', title: 'Slim Fit Jeans - Blue',   price: 52.99, image: 'https://placehold.co/800x800/1E90FF/000000?text=Blue+Jeans', category: 'jeans' },
  { id: 'p21', title: 'Tapered Jeans - Navy',    price: 54.99, image: 'https://placehold.co/800x800/001f3f/FFFFFF?text=Navy+Jeans', category: 'jeans' },
  { id: 'p22', title: 'Relaxed Jeans - Light',   price: 45.99, image: 'https://placehold.co/800x800/ADD8E6/000000?text=Light+Jeans',   category: 'jeans' },
  { id: 'p23', title: 'Slim Fit Jeans - Charcoal', price: 51.99, image: 'https://placehold.co/800x800/36454F/FFFFFF?text=Charcoal+Jeans', category: 'jeans' },
  { id: 'p24', title: 'Classic Jeans - Stone', price: 48.99, image: 'https://placehold.co/800x800/928E85/FFFFFF?text=Stone+Jeans', category: 'jeans' },

  // Jackets (8 products - different colors)
  { id: 'p25', title: 'Leather Jacket - Black', price: 129.99, image: 'https://placehold.co/800x800/000000/FFFFFF?text=Black+Jacket', category: 'jackets' },
  { id: 'p26', title: 'Leather Jacket - Brown', price: 129.99, image: 'https://placehold.co/800x800/8B4513/FFFFFF?text=Brown+Jacket', category: 'jackets' },
  { id: 'p27', title: 'Bomber Jacket - Olive',  price: 99.99,  image: 'https://placehold.co/800x800/556B2F/FFFFFF?text=Olive+Jacket', category: 'jackets' },
  { id: 'p28', title: 'Bomber Jacket - Navy',   price: 99.99,  image: 'https://placehold.co/800x800/001f3f/FFFFFF?text=Navy+Jacket', category: 'jackets' },
  { id: 'p29', title: 'Denim Jacket - Blue',    price: 89.99,  image: 'https://placehold.co/800x800/1E3A8A/FFFFFF?text=Blue+Denim+Jacket', category: 'jackets' },
  { id: 'p30', title: 'Puffer Jacket - Grey',   price: 109.99, image: 'https://placehold.co/800x800/808080/FFFFFF?text=Grey+Jacket', category: 'jackets' },
  { id: 'p31', title: 'Leather Jacket - Tan', price: 124.99, image: 'https://placehold.co/800x800/D2B48C/000000?text=Tan+Jacket', category: 'jackets' },
  { id: 'p32', title: 'Bomber Jacket - Red', price: 104.99, image: 'https://placehold.co/800x800/DC143C/FFFFFF?text=Red+Jacket', category: 'jackets' }
];

const users = new Map(); // email -> { id, name, email, passwordHash }
const tokens = new Map(); // token -> userId
const orders = new Map(); // userId -> [orders]

// In-memory order storage (orderId -> order)
const allOrders = new Map(); // orderId -> { id, items, totalAmount, status, paymentMethod, razorpayOrderId, razorpayPaymentId, createdAt, ... }

function makeAuth(token) {
  const userId = tokens.get(token);
  if (!userId) return null;
  return [...users.values()].find(u => u.id === userId) || null;
}

app.get(api + '/products', (req, res) => {
  const { category } = req.query;
  const filtered = category ? products.filter(p => p.category === category) : products;
  res.json({ products: filtered });
});

app.post(api + '/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.has(email)) return res.status(400).json({ error: 'Email already registered' });
  const user = { id: nanoid(), name, email, passwordHash: password };
  users.set(email, user);
  const token = nanoid();
  tokens.set(token, user.id);
  res.json({ token, user: { id: user.id, name, email } });
});

app.post(api + '/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.get(email);
  if (!user || user.passwordHash !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = nanoid();
  tokens.set(token, user.id);
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

app.get(api + '/orders', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = token ? makeAuth(token) : null;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  // Get orders from user-specific Map
  let userOrders = orders.get(user.id) || [];
  
  // Also check allOrders for any orders with this user's ID (for backward compatibility)
  // This ensures we don't miss any orders
  for (const [orderId, order] of allOrders.entries()) {
    if (order.userId === user.id && !userOrders.find(o => o.id === orderId || o.orderId === orderId)) {
      userOrders.push(order);
    }
  }
  
  res.json({ orders: userOrders });
});

// Legacy checkout endpoint (kept for backward compatibility, but redirects to new flow)
app.post(api + '/checkout', (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Empty cart' });
  
  // Use new order creation endpoint
  const withDetails = items.map(i => {
    const p = products.find(x => x.id === i.productId);
    return { ...i, title: p?.title || 'Unknown', price: p?.price || 0 };
  });
  const total = withDetails.reduce((s, i) => s + i.quantity * i.price, 0);
  const orderId = nanoid();
  
  const order = {
    id: orderId,
    items: withDetails,
    totalAmount: total,
    status: 'created',
    paymentMethod: null,
    createdAt: new Date().toISOString()
  };
  
  allOrders.set(orderId, order);
  
  res.json({ orderId, total: total });
});

// New order creation endpoint
app.post(api + '/orders', (req, res) => {
  const { items } = req.body || {};
  
  // Get authenticated user (optional - orders can be created without auth, but will be linked if auth provided)
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = token ? makeAuth(token) : null;
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Empty cart' });
  }
  
  // Calculate total and enrich items with product details
  const withDetails = items.map(i => {
    const p = products.find(x => x.id === i.productId);
    if (!p) {
      return null;
    }
    return {
      productId: i.productId,
      title: p.title,
      price: p.price,
      image: p.image,
      quantity: i.quantity || 1,
      size: i.size || 'M'
    };
  }).filter(Boolean);
  
  if (withDetails.length === 0) {
    return res.status(400).json({ error: 'No valid products found' });
  }
  
  const totalAmount = withDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderId = nanoid();
  
  const order = {
    id: orderId,
    orderId: orderId, // Add orderId field for consistency with test expectations
    items: withDetails,
    totalAmount: totalAmount,
    status: 'created',
    paymentMethod: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    createdAt: new Date().toISOString(),
    userId: user ? user.id : null // Store user ID for reference
  };
  
  // Store in allOrders (for order lookup by ID)
  allOrders.set(orderId, order);
  
  // If user is authenticated, also store in user-specific orders Map
  if (user) {
    if (!orders.has(user.id)) {
      orders.set(user.id, []);
    }
    orders.get(user.id).push(order);
    console.log(`Order created: ${orderId}, Total: ₹${totalAmount.toFixed(2)}, User: ${user.email}`);
  } else {
    console.log(`Order created: ${orderId}, Total: ₹${totalAmount.toFixed(2)} (unauthenticated)`);
  }
  
  res.json({ 
    orderId, 
    total: totalAmount 
  });
});

// Create Razorpay order
app.post(api + '/payment/create-razorpay-order', async (req, res) => {
  const { orderId } = req.body || {};
  
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  
  const order = allOrders.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (order.status !== 'created') {
    return res.status(400).json({ error: 'Order already processed' });
  }
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ 
      error: 'Razorpay credentials not configured',
      message: 'Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file to enable payment processing'
    });
  }
  
  try {
    // Convert amount from rupees to paise
    const amountInPaise = Math.round(order.totalAmount * 100);
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: orderId,
        totalItems: order.items.length
      }
    });
    
    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    allOrders.set(orderId, order);
    
    console.log(`Razorpay order created: ${razorpayOrder.id} for order: ${orderId}`);
    
    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      orderId: orderId
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: error.message });
  }
});

// Verify Razorpay payment
app.post(api + '/payment/verify', (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification data' });
  }
  
  const order = allOrders.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ 
      error: 'Razorpay secret not configured',
      message: 'Please configure RAZORPAY_KEY_SECRET in your .env file to enable payment verification'
    });
  }
  
  // Verify signature
  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  if (generatedSignature !== razorpay_signature) {
    console.error(`Payment verification failed for order: ${orderId}`);
    return res.status(400).json({ error: 'Invalid payment signature' });
  }
  
  // Payment verified - update order
  order.status = 'paid';
  order.paymentMethod = 'online';
  order.razorpayOrderId = razorpay_order_id;
  order.razorpayPaymentId = razorpay_payment_id;
  order.paidAt = new Date().toISOString();
  allOrders.set(orderId, order);
  
  console.log(`Payment verified for order: ${orderId}`);
  
  res.json({ 
    success: true, 
    message: 'Payment verified successfully',
    orderId: orderId
  });
});

// Confirm COD order
app.post(api + '/orders/:id/cod-confirm', (req, res) => {
  const { id } = req.params;
  
  const order = allOrders.get(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (order.status !== 'created') {
    return res.status(400).json({ error: 'Order already processed' });
  }
  
  // Update order for COD
  order.status = 'cod-confirmed';
  order.paymentMethod = 'cod';
  order.confirmedAt = new Date().toISOString();
  allOrders.set(id, order);
  
  console.log(`COD order confirmed: ${id}`);
  
  res.json({ 
    success: true,
    message: 'COD order confirmed',
    orderId: id
  });
});

// Email validation regex pattern
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.post(api + '/newsletter/subscribe', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log('========================================');
  console.log('  Backend API Server Running');
  console.log('========================================');
  console.log(`  API: http://localhost:${port}${api}`);
  console.log('========================================');
  console.log('\nStart the frontend server separately on port 3000\n');
});
