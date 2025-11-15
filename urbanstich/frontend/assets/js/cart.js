import { getAllProducts, fetchProducts } from './api.js';

// Cart State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function getCart() {
    return cart;
}

export function setCart(newCart) {
    cart = newCart;
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

export function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cartCount');
    const sidebarCountEl = document.getElementById('sidebarCartCount');
    if (countEl) countEl.textContent = count;
    if (sidebarCountEl) sidebarCountEl.textContent = count;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

    renderCartItems();
}

export function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p id="emptyCartMessage" class="text-gray-500 text-center py-8">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex items-center space-x-4 border-b pb-4" data-cart-index="${index}">
            <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded">
            <div class="flex-1">
                <h4 class="font-semibold">${item.title}</h4>
                <p class="text-sm text-gray-600">Size: ${item.size || 'M'}</p>
                <p class="text-orange-500 font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button class="cart-decrease-btn px-2 py-1 border rounded hover:bg-gray-100" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-increase-btn px-2 py-1 border rounded hover:bg-gray-100" data-index="${index}">+</button>
                <button class="cart-remove-btn ml-4 text-red-500 hover:text-red-700" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

export async function addToCart(productId) {
    let product;
    const allProducts = getAllProducts();
    if (allProducts.length > 0) {
        product = allProducts.find(p => p.id === productId);
    } else {
        const result = await fetchProducts();
        product = result.products?.find(p => p.id === productId);
    }
    
    if (!product) {
        alert('Product not found. Please refresh the page and try again.');
        return;
    }

    const existingItem = cart.find(item => item.productId === productId && (!item.size || item.size === 'M'));
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: 'M'
        });
    }
    saveCart();
}

export async function quickAddToCart(productId) {
    await addToCart(productId);
    openCart();
}

export function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        } else if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        saveCart();
    }
}

export function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
    }
}

export function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('translate-x-full');
    }
}

export function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('translate-x-full');
    }
}

