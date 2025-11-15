import { testBackendConnection } from './api.js';
import { updateCartUI } from './cart.js';
import { updateAuthUI } from './auth.js';
import { renderProducts, initializeUI } from './ui.js';

// Expose renderProducts on window for onclick handlers in HTML
window.renderProducts = renderProducts;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    updateCartUI();
    updateAuthUI();
    initializeUI();
    
    // Test connection and then load products
    testBackendConnection().then(isConnected => {
        if (!isConnected) {
            console.warn('Backend not connected. Products may not load.');
        }
        renderProducts();
    });
});

