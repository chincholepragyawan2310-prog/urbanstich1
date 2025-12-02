import { createRazorpayOrder, verifyPayment, confirmCOD } from './api.js';

// Load order from localStorage
const orderIdEl = document.getElementById('orderId');
const itemCountEl = document.getElementById('itemCount');
const totalAmountEl = document.getElementById('totalAmount');
const orderItemsEl = document.getElementById('orderItems');
const paymentErrorEl = document.getElementById('paymentError');
const payNowBtn = document.getElementById('payNowBtn');

let orderData = null;
let totalAmountNumber = 0; // in INR (not paise)

function loadOrder() {
    try {
        orderData = JSON.parse(localStorage.getItem('currentOrder'));
    } catch (e) {
        orderData = null;
    }

    if (!orderData || !orderData.items || orderData.items.length === 0) {
        orderIdEl.textContent = '-';
        itemCountEl.textContent = '0';
        totalAmountEl.textContent = '₹0';
        orderItemsEl.innerHTML = `
            <div class="text-sm text-gray-500">
                No items found in your order. Please go back to the cart and try again.
            </div>
        `;
        payNowBtn.disabled = true;
        return;
    }

    const itemCount = orderData.items.length;
    totalAmountNumber = Number(orderData.total) || 0;

    orderIdEl.textContent = orderData.orderId || '-';
    itemCountEl.textContent = itemCount;
    totalAmountEl.textContent = `₹${totalAmountNumber.toFixed(2)}`;

    // Render items
    orderItemsEl.innerHTML = '';
    orderData.items.forEach((item) => {
        const title = item.title || `Item`;
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const size = item.size || null;

        const itemRow = document.createElement('div');
        itemRow.className = 'flex justify-between items-center border-b pb-2 last:border-b-0';

        itemRow.innerHTML = `
            <div>
                <div class="font-semibold text-gray-800">${title}</div>
                <div class="text-xs text-gray-500">
                    Qty ${quantity}${size ? ` • Size ${size}` : ''}
                </div>
            </div>
            <div class="font-semibold text-gray-800">
                ₹${(price * quantity).toFixed(2)}
            </div>
        `;
        orderItemsEl.appendChild(itemRow);
    });
}

// Payment method UI switching
const paymentOptions = document.querySelectorAll('.payment-option');

paymentOptions.forEach(option => {
    const input = option.querySelector('input[type="radio"]');
    option.addEventListener('click', () => {
        input.checked = true;
        updatePaymentOptionStyles();
    });
    input.addEventListener('change', updatePaymentOptionStyles);
});

function updatePaymentOptionStyles() {
    paymentOptions.forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (input.checked) {
            option.classList.add('border-orange-500', 'bg-orange-50');
        } else {
            option.classList.remove('border-orange-500', 'bg-orange-50');
        }
    });
}

function getSelectedPaymentMethod() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected ? selected.value : null;
}

// Razorpay Integration
async function payWithRazorpay() {
    if (!totalAmountNumber || totalAmountNumber <= 0) {
        showError('Invalid amount. Go back to cart and try again.');
        return;
    }

    if (!orderData || !orderData.orderId) {
        showError('Order ID missing. Please go back to cart and try again.');
        return;
    }

    payNowBtn.disabled = true;
    payNowBtn.textContent = 'Processing...';

    try {
        // Create Razorpay order via backend
        const razorpayResult = await createRazorpayOrder(orderData.orderId);
        
        if (!razorpayResult.success) {
            showError(razorpayResult.error || 'Failed to create payment order. Please try again.');
            payNowBtn.disabled = false;
            payNowBtn.textContent = 'Continue & Pay';
            return;
        }

        const amountInPaise = razorpayResult.amount;
        const razorpayOrderId = razorpayResult.razorpayOrderId;
        const razorpayKey = razorpayResult.key;

        const options = {
            key: razorpayKey,
            amount: amountInPaise,
            currency: razorpayResult.currency || 'INR',
            name: 'UrbanStich',
            description: `Order Payment - ${orderData.orderId}`,
            order_id: razorpayOrderId,
            handler: async function (response) {
                // Payment success callback
                console.log('Razorpay success', response);
                
                // Verify payment with backend
                const verifyResult = await verifyPayment(
                    orderData.orderId,
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );

                if (verifyResult.success) {
                    // Clear cart and order data
                    localStorage.removeItem('currentOrder');
                    localStorage.removeItem('cart');
                    
                    // Redirect to success page or home
                    alert('Payment successful! Order ID: ' + orderData.orderId);
                    window.location.href = '/';
                } else {
                    showError('Payment verification failed: ' + (verifyResult.error || 'Unknown error'));
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            notes: {
                order_id: orderData.orderId
            },
            theme: {
                color: '#f97316'
            },
            modal: {
                ondismiss: function() {
                    payNowBtn.disabled = false;
                    payNowBtn.textContent = 'Continue & Pay';
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response) {
            console.error('Payment failed', response.error);
            showError('Payment failed: ' + (response.error.description || 'Please try again or choose another method.'));
            payNowBtn.disabled = false;
            payNowBtn.textContent = 'Continue & Pay';
        });

        rzp.open();
    } catch (error) {
        console.error('Payment error:', error);
        showError('An error occurred. Please try again.');
        payNowBtn.disabled = false;
        payNowBtn.textContent = 'Continue & Pay';
    }
}

// COD Handling
async function placeCODOrder() {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
        showError('No order data found. Go back to cart.');
        return;
    }

    if (!orderData.orderId) {
        showError('Order ID missing. Please go back to cart and try again.');
        return;
    }

    payNowBtn.disabled = true;
    payNowBtn.textContent = 'Processing...';

    try {
        const result = await confirmCOD(orderData.orderId);
        
        if (result.success) {
            // Clear cart and order data
            localStorage.removeItem('currentOrder');
            localStorage.removeItem('cart');
            
            alert('COD order placed successfully! Order ID: ' + orderData.orderId);
            window.location.href = '/';
        } else {
            showError(result.error || 'Failed to confirm COD order. Please try again.');
            payNowBtn.disabled = false;
            payNowBtn.textContent = 'Continue & Pay';
        }
    } catch (error) {
        console.error('COD error:', error);
        showError('An error occurred. Please try again.');
        payNowBtn.disabled = false;
        payNowBtn.textContent = 'Continue & Pay';
    }
}

// Helpers
function showError(msg) {
    paymentErrorEl.textContent = msg;
    paymentErrorEl.classList.remove('hidden');
    setTimeout(() => {
        paymentErrorEl.classList.add('hidden');
    }, 5000);
}

// Main button click
payNowBtn.addEventListener('click', function () {
    paymentErrorEl.classList.add('hidden');
    const method = getSelectedPaymentMethod();

    if (!method) {
        showError('Please select a payment method.');
        return;
    }

    if (method === 'razorpay') {
        payWithRazorpay();
    } else if (method === 'cod') {
        placeCODOrder();
    } else {
        showError('Invalid payment method selected.');
    }
});

// Initialize
loadOrder();
updatePaymentOptionStyles();
