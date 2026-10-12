// Dynamic API Configuration
// 1. Explicit window override (e.g., set via script or production config)
// 2. If running locally on separate frontend port 3000, connect to backend at localhost:4000/api
// 3. In production or unified host, use same-origin relative path /api
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) || (
    isLocalhost && window.location.port === '3000'
        ? 'http://localhost:4000/api'
        : (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:4000/api')
);

// Log configuration
console.log('🔧 Frontend Configuration:');
console.log('  API URL:', API_BASE_URL);
console.log('  Current URL:', window.location.href);
console.log('  Protocol:', window.location.protocol);

if (window.location.protocol === 'file:') {
    console.warn('⚠️ WARNING: File opened directly (file:// protocol)');
    console.warn('⚠️ CORS will block backend requests!');
    console.warn('⚠️ Solution: Serve this file through a local HTTP server');
    console.warn('  - Python: python -m http.server 8000');
    console.warn('  - Node: npx http-server');
    console.warn('  - Then open: http://localhost:8000');
}

// Default verified catalog for standalone and fallback operation
export const DEFAULT_PRODUCTS = [
    // T-Shirts (8 products - different colors)
    { id: 'p1',  title: 'Classic Tee - White',  price: 199.99, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p2',  title: 'Classic Tee - Black',  price: 199.99, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p3',  title: 'Classic Tee - Navy',   price: 219.99, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p4',  title: 'Classic Tee - Olive',  price: 219.99, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p5',  title: 'Classic Tee - Grey',   price: 189.99, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p6',  title: 'Classic Tee - Maroon', price: 219.99, image: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p7',  title: 'Classic Tee - Red',    price: 229.99, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },
    { id: 'p8',  title: 'Classic Tee - Blue',   price: 209.99, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80', category: 't-shirts' },

    // Shirts (8 products - different colors)
    { id: 'p9',  title: 'Linen Shirt - Sky Blue',  price: 399.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p10', title: 'Linen Shirt - White',     price: 399.99, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p11', title: 'Oxford Shirt - Navy',     price: 449.99, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p12', title: 'Oxford Shirt - Pink',     price: 449.99, image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p13', title: 'Checked Shirt - Green',   price: 425.99, image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p14', title: 'Denim Shirt - Indigo',    price: 469.99, image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p15', title: 'Casual Shirt - Burgundy', price: 439.99, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', category: 'shirts' },
    { id: 'p16', title: 'Formal Shirt - Beige',    price: 459.99, image: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&auto=format&fit=crop&q=80', category: 'shirts' },

    // Jeans (8 products - different colors)
    { id: 'p17', title: 'Denim Jeans - Dark Blue',   price: 49.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p18', title: 'Denim Jeans - Black',       price: 49.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p19', title: 'Denim Jeans - Grey',        price: 47.99, image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p20', title: 'Slim Fit Jeans - Blue',     price: 52.99, image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p21', title: 'Tapered Jeans - Navy',      price: 54.99, image: 'https://images.unsplash.com/photo-1511105612320-2e62a04dd044?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p22', title: 'Relaxed Jeans - Light',     price: 45.99, image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p23', title: 'Slim Fit Jeans - Charcoal',  price: 51.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', category: 'jeans' },
    { id: 'p24', title: 'Classic Jeans - Stone',     price: 48.99, image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80', category: 'jeans' },

    // Jackets (8 products - different colors)
    { id: 'p25', title: 'Leather Jacket - Black', price: 129.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p26', title: 'Leather Jacket - Brown', price: 129.99, image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p27', title: 'Bomber Jacket - Olive',  price: 99.99,  image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p28', title: 'Bomber Jacket - Navy',   price: 99.99,  image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p29', title: 'Denim Jacket - Blue',    price: 89.99,  image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p30', title: 'Puffer Jacket - Grey',   price: 109.99, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p31', title: 'Leather Jacket - Tan',   price: 124.99, image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop&q=80', category: 'jackets' },
    { id: 'p32', title: 'Bomber Jacket - Red',    price: 104.99, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80', category: 'jackets' }
];

// Shared state for products
let allProducts = DEFAULT_PRODUCTS;

export function getAllProducts() {
    return allProducts;
}

export function setAllProducts(products) {
    allProducts = products;
}

// Utility Functions
export function getAuthHeaders(authToken) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
}

// API Functions
export async function fetchProducts(category = null) {
    try {
        const url = category ? `${API_BASE_URL}/products?category=${category}` : `${API_BASE_URL}/products`;
        console.log('Fetching products from:', url);
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const products = data.products || [];
            if (products.length > 0) {
                if (!category) {
                    setAllProducts(products);
                }
                return { products, error: null };
            }
        }
    } catch (error) {
        console.warn('Backend unavailable, using static catalog fallback:', error.message);
    }
    // Fallback to verified catalog
    const filtered = category ? DEFAULT_PRODUCTS.filter(p => p.category === category) : DEFAULT_PRODUCTS;
    if (!category) {
        setAllProducts(DEFAULT_PRODUCTS);
    }
    return { products: filtered, error: null };
}

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, token: data.token, user: data.user };
        } else {
            return { success: false, error: data.error || 'Login failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
}

export async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, token: data.token, user: data.user };
        } else {
            return { success: false, error: data.error || 'Registration failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
}

export async function subscribeNewsletter(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return response.ok ? { success: true } : { success: false, error: data.error };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

export async function checkout(items, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/checkout`, {
            method: 'POST',
            headers: getAuthHeaders(authToken),
            body: JSON.stringify({
                items: items.map(item => ({ productId: item.productId, quantity: item.quantity, size: item.size || 'M' })),
                paymentMethod: 'card',
                upiId: '',
                upiApp: ''
            })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, orderId: data.orderId, total: data.total };
        } else {
            return { success: false, error: data.error || 'Checkout failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
}

// Create order (new payment flow)
export async function createOrder(items) {
    try {
        const authToken = localStorage.getItem('authToken');
        const headers = getAuthHeaders(authToken);
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                items: items.map(item => ({ 
                    productId: item.productId, 
                    quantity: item.quantity, 
                    size: item.size || 'M' 
                }))
            })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, orderId: data.orderId, total: data.total };
        } else {
            return { success: false, error: data.error || 'Order creation failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
}

// Create Razorpay order
export async function createRazorpayOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/create-razorpay-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, ...data };
        } else {
            return { success: false, error: data.error || 'Failed to create Razorpay order' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Verify Razorpay payment
export async function verifyPayment(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, ...data };
        } else {
            return { success: false, error: data.error || 'Payment verification failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Confirm COD order
export async function confirmCOD(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cod-confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, ...data };
        } else {
            return { success: false, error: data.error || 'COD confirmation failed' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

export async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            console.log('✓ Backend connection successful');
            return true;
        } else {
            console.error('✗ Backend responded with error:', response.status);
            return false;
        }
    } catch (error) {
        console.error('✗ Backend connection failed:', error);
        console.error('Make sure the backend server is running: node server.js');
        return false;
    }
}

