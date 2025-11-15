// API Configuration
export const API_BASE_URL = 'http://localhost:4000/api';

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

// Shared state for products
let allProducts = [];

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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const products = data.products || [];
        console.log('Products fetched:', products.length);
        if (!category) {
            setAllProducts(products);
        }
        return { products, error: null };
    } catch (error) {
        console.error('Error fetching products:', error);
        const errorMessage = error.message.includes('Failed to fetch') || error.message.includes('NetworkError') 
            ? 'Cannot connect to backend server. Make sure the server is running on http://localhost:4000'
            : `Error: ${error.message}`;
        return { products: [], error: errorMessage };
    }
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
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

