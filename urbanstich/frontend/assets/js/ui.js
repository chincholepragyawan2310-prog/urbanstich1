import { fetchProducts, loginUser, registerUser, subscribeNewsletter, checkout, createOrder } from './api.js';
import { getCart, setCart, addToCart, quickAddToCart, updateQuantity, removeFromCart, openCart, closeCart, updateCartUI } from './cart.js';
import { getAuthToken, getCurrentUser, setAuth, logout, updateAuthUI } from './auth.js';

// Product rendering function
export async function renderProducts(category = null) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    container.innerHTML = '<div class="text-center py-8 col-span-full"><div class="loading-spinner mx-auto mb-4"></div><p class="text-gray-600">Loading products...</p></div>';

    const result = await fetchProducts(category);
    const products = result.products || [];
    
    if (result.error) {
        const isCorsError = result.error.includes('Failed to fetch') || result.error.includes('NetworkError');
        container.innerHTML = `
            <div class="text-center py-8 col-span-full">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-red-800 font-bold mb-2">Connection Error</h3>
                    <p class="text-red-600 text-sm mb-4">${result.error}</p>
                    ${isCorsError ? `
                    <div class="text-left bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-gray-700 mb-4">
                        <p class="font-semibold mb-2 text-yellow-800">⚠ CORS Issue Detected</p>
                        <p class="mb-2">If you opened this file directly (file://), you need to serve it through a local server:</p>
                        <ul class="list-disc list-inside space-y-1 ml-2">
                            <li>Python: <code class="bg-yellow-100 px-2 py-1 rounded">python -m http.server 8000</code></li>
                            <li>Node.js: Use <code class="bg-yellow-100 px-2 py-1 rounded">npx http-server</code></li>
                            <li>Then open: <code class="bg-yellow-100 px-2 py-1 rounded">http://localhost:8000</code></li>
                        </ul>
                    </div>
                    ` : ''}
                    <div class="text-left bg-white p-4 rounded text-sm text-gray-700">
                        <p class="font-semibold mb-2">To fix this:</p>
                        <ol class="list-decimal list-inside space-y-1">
                            <li>Open terminal in the backend directory</li>
                            <li>Run: <code class="bg-gray-100 px-2 py-1 rounded">node server.js</code></li>
                            <li>Make sure server is running on port 4000</li>
                            <li>Check browser console (F12) for more details</li>
                        </ol>
                    </div>
                    <button onclick="location.reload()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Retry</button>
                </div>
            </div>
        `;
        return;
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 col-span-full">
                <p class="text-gray-600 mb-4">No products found</p>
                <button onclick="window.renderProducts()" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Refresh</button>
            </div>
        `;
        return;
    }

    container.innerHTML = products.slice(0, 8).map(product => `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div class="relative">
                <img src="${product.image}" alt="${product.title}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/400x400?text=Image+Not+Found'">
                <div class="quick-view absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-center py-2">
                    <button class="quick-add-btn w-full hover:bg-opacity-90" data-product-id="${product.id}">Quick Add</button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold mb-2">${product.title}</h3>
                <p class="text-orange-500 font-bold">$${product.price ? product.price.toFixed(2) : '0.00'}</p>
                <button class="add-to-cart-btn mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Initialize all UI event handlers
export function initializeUI() {
    // Form Handlers
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            const buttonText = document.getElementById('loginButtonText');
            const spinner = document.getElementById('loginSpinner');

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (buttonText) buttonText.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');

            const result = await loginUser(email, password);
            
            if (buttonText) buttonText.classList.remove('hidden');
            if (spinner) spinner.classList.add('hidden');

            if (result.success) {
                setAuth(result.token, result.user);
                updateAuthUI();
                document.getElementById('loginModal')?.classList.remove('active');
                loginForm.reset();
                alert('Login successful!');
            } else {
                alert(result.error || 'Login failed');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName')?.value;
            const email = document.getElementById('registerEmail')?.value;
            const password = document.getElementById('registerPassword')?.value;
            const buttonText = document.getElementById('registerButtonText');
            const spinner = document.getElementById('registerSpinner');

            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (buttonText) buttonText.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');

            const result = await registerUser(name, email, password);
            
            if (buttonText) buttonText.classList.remove('hidden');
            if (spinner) spinner.classList.add('hidden');

            if (result.success) {
                setAuth(result.token, result.user);
                updateAuthUI();
                document.getElementById('registerModal')?.classList.remove('active');
                registerForm.reset();
                alert('Registration successful!');
            } else {
                alert(result.error || 'Registration failed');
            }
        });
    }

    // Newsletter Subscription
    const subscribeBtn = document.getElementById('subscribeButton');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', async () => {
            const email = document.getElementById('newsletterEmail')?.value;
            const messageEl = document.getElementById('newsletterMessage');
            
            if (!email) {
                if (messageEl) {
                    messageEl.textContent = 'Please enter an email address';
                    messageEl.className = 'mt-2 text-sm text-red-500';
                }
                return;
            }

            const result = await subscribeNewsletter(email);
            if (messageEl) {
                if (result.success) {
                    messageEl.textContent = 'Successfully subscribed!';
                    messageEl.className = 'mt-2 text-sm text-green-500';
                    const emailInput = document.getElementById('newsletterEmail');
                    if (emailInput) emailInput.value = '';
                } else {
                    messageEl.textContent = result.error || 'Subscription failed';
                    messageEl.className = 'mt-2 text-sm text-red-500';
                }
            }
        });
    }

    // Checkout - New Payment Flow
    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }

            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';

            // Create order
            const result = await createOrder(cart);
            
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'CHECKOUT';

            if (result.success) {
                // Save order to localStorage
                const orderData = {
                    orderId: result.orderId,
                    total: result.total,
                    items: cart
                };
                localStorage.setItem('currentOrder', JSON.stringify(orderData));
                
                // Clear cart
                setCart([]);
                closeCart();
                
                // Redirect to payment page
                window.location.href = 'payment.html';
            } else {
                alert(result.error || 'Failed to create order. Please try again.');
            }
        });
    }

    // Modal Handlers
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            document.getElementById('loginModal')?.classList.add('active');
        });
    }

    const closeLoginModal = document.getElementById('closeLoginModal');
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            document.getElementById('loginModal')?.classList.remove('active');
        });
    }

    const showRegister = document.getElementById('showRegister');
    if (showRegister) {
        showRegister.addEventListener('click', () => {
            document.getElementById('loginModal')?.classList.remove('active');
            document.getElementById('registerModal')?.classList.add('active');
        });
    }

    const closeRegisterModal = document.getElementById('closeRegisterModal');
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', () => {
            document.getElementById('registerModal')?.classList.remove('active');
        });
    }

    const showLogin = document.getElementById('showLogin');
    if (showLogin) {
        showLogin.addEventListener('click', () => {
            document.getElementById('registerModal')?.classList.remove('active');
            document.getElementById('loginModal')?.classList.add('active');
        });
    }

    // Cart Handlers
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCart();
        });
    }

    // Close modals on outside click
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const cartSidebar = document.getElementById('cartSidebar');

    // Continue Shopping - Event delegation
    if (cartSidebar) {
        cartSidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.textContent.includes('Continue Shopping')) {
                e.preventDefault();
                closeCart();
            }
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                registerModal.classList.remove('active');
            }
        });
    }

    if (cartSidebar) {
        // Handle click events within cart sidebar
        cartSidebar.addEventListener('click', (e) => {
            // Don't prevent default for links and buttons
            if (e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    }

    // Category Links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            renderProducts(category);
            window.scrollTo({ top: document.getElementById('featuredProducts')?.offsetTop - 100 || 0, behavior: 'smooth' });
        });
    });

    // Men Dropdown Button Handler
    const menDropdownButton = document.getElementById('menDropdownButton');
    const menDropdown = document.getElementById('menDropdown');
    const menDropdownMenu = document.getElementById('menDropdownMenu');
    
    console.log('Men dropdown elements:', { menDropdownButton, menDropdown, menDropdownMenu });
    
    if (menDropdownButton && menDropdown && menDropdownMenu) {
        // Click handler for the button
        menDropdownButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Men button clicked, toggling dropdown');
            const isActive = menDropdown.classList.contains('active');
            if (isActive) {
                menDropdown.classList.remove('active');
                menDropdownMenu.style.display = 'none';
            } else {
                menDropdown.classList.add('active');
                menDropdownMenu.style.display = 'block';
            }
        });
        
        // Prevent dropdown from closing when clicking inside menu
        menDropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    } else {
        console.error('Men dropdown elements not found!');
    }

    // Dropdown category links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const category = link.getAttribute('data-category');
            renderProducts(category);
            // Close dropdown after selection
            const menDropdown = document.getElementById('menDropdown');
            const menDropdownMenu = document.getElementById('menDropdownMenu');
            if (menDropdown && menDropdownMenu) {
                menDropdown.classList.remove('active');
                menDropdownMenu.style.display = 'none';
            }
            window.scrollTo({ top: document.getElementById('featuredProducts')?.offsetTop - 100 || 0, behavior: 'smooth' });
        });
    });

    // Product buttons - Event delegation
    // Also handle closing dropdown when clicking outside
    document.addEventListener('click', async (e) => {
        // Close Men dropdown when clicking outside (only if dropdown exists and click is not inside it)
        const menDropdown = document.getElementById('menDropdown');
        const menDropdownButton = document.getElementById('menDropdownButton');
        const menDropdownMenu = document.getElementById('menDropdownMenu');
        if (menDropdown && menDropdownButton && menDropdownMenu) {
            // Only close if clicking outside the dropdown AND not on the button
            if (!menDropdown.contains(e.target) && e.target !== menDropdownButton && !menDropdownButton.contains(e.target)) {
                menDropdown.classList.remove('active');
                menDropdownMenu.style.display = 'none';
            }
        }
        
        // Add to cart buttons
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = btn.getAttribute('data-product-id');
            if (productId) {
                await addToCart(productId);
            }
        }
        
        // Quick add buttons
        if (e.target.classList.contains('quick-add-btn') || e.target.closest('.quick-add-btn')) {
            const btn = e.target.classList.contains('quick-add-btn') ? e.target : e.target.closest('.quick-add-btn');
            const productId = btn.getAttribute('data-product-id');
            if (productId) {
                await quickAddToCart(productId);
            }
        }

        // Cart quantity buttons
        if (e.target.classList.contains('cart-decrease-btn') || e.target.closest('.cart-decrease-btn')) {
            const btn = e.target.classList.contains('cart-decrease-btn') ? e.target : e.target.closest('.cart-decrease-btn');
            const index = parseInt(btn.getAttribute('data-index'));
            updateQuantity(index, -1);
        }

        if (e.target.classList.contains('cart-increase-btn') || e.target.closest('.cart-increase-btn')) {
            const btn = e.target.classList.contains('cart-increase-btn') ? e.target : e.target.closest('.cart-increase-btn');
            const index = parseInt(btn.getAttribute('data-index'));
            updateQuantity(index, 1);
        }

        // Remove from cart
        if (e.target.classList.contains('cart-remove-btn') || e.target.closest('.cart-remove-btn')) {
            const btn = e.target.classList.contains('cart-remove-btn') ? e.target : e.target.closest('.cart-remove-btn');
            const index = parseInt(btn.getAttribute('data-index'));
            if (confirm('Remove this item from cart?')) {
                removeFromCart(index);
            }
        }
    });
}

