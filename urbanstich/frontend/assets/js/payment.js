!DOCTYPE html
html lang=en
head
    meta charset=UTF-8
    meta name=viewport content=width=device-width, initial-scale=1.0
    titlePayment - UrbanStichtitle
    script src=httpscdn.tailwindcss.comscript
    script src=httpscheckout.razorpay.comv1checkout.jsscript
    link rel=stylesheet href=.assetscssstyles.css
head
body class=bg-gray-50
    !-- Navigation --
    nav class=bg-white shadow-md
        div class=max-w-7xl mx-auto px-4
            div class=flex justify-between h-16 items-center
                a href=index.html class=text-2xl font-bold text-gray-900
                    URBANspan class=text-orange-500STICHspan
                a
                a href=index.html class=text-gray-600 hovertext-black← Back to Shoppinga
            div
        div
    nav

    !-- Payment Page --
    div class=max-w-4xl mx-auto px-4 py-8
        h1 class=text-3xl font-bold mb-8Complete Your Orderh1

        div class=grid mdgrid-cols-2 gap-8
            !-- Order Summary --
            div class=bg-white rounded-lg shadow-md p-6
                h2 class=text-xl font-bold mb-4Order Summaryh2
                div id=orderSummary class=space-y-4
                    div class=flex justify-between
                        span class=text-gray-600Order IDspan
                        span id=orderId class=font-semibold-span
                    div
                    div class=flex justify-between
                        span class=text-gray-600Itemsspan
                        span id=itemCount class=font-semibold-span
                    div
                    div class=border-t pt-4
                        div class=flex justify-between text-lg font-bold
                            spanTotal Amountspan
                            span id=totalAmount class=text-orange-500-span
                        div
                    div
                div

                !-- Order Items List --
                div id=orderItems class=mt-6 space-y-3
                    !-- Items will be populated here --
                div
            div

            !-- Payment Method Selection --
            div class=bg-white rounded-lg shadow-md p-6
                h2 class=text-xl font-bold mb-6Select Payment Methodh2

                div class=space-y-4 mb-6
                    !-- Razorpay Option --
                    label class=flex items-center p-4 border-2 rounded-lg cursor-pointer hoverbg-gray-50 transition payment-option border-orange-500 bg-orange-50 data-method=razorpay
                        input type=radio name=paymentMethod value=razorpay class=mr-4 w-5 h-5 text-orange-500 checked
                        div class=flex-1
                            div class=font-semibold text-lgPay Online (Razorpay)div
                            div class=text-sm text-gray-600Pay securely using CreditDebit Card, UPI, Net Bankingdiv
                        div
                        svg xmlns=httpwww.w3.org2000svg class=h-6 w-6 text-green-500 fill=none viewBox=0 0 24 24 stroke=currentColor
                            path stroke-linecap=round stroke-linejoin=round stroke-width=2 d=M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z 
                        svg
                    label

                    !-- COD Option --
                    label class=flex items-center p-4 border-2 rounded-lg cursor-pointer hoverbg-gray-50 transition payment-option data-method=cod
                        input type=radio name=paymentMethod value=cod class=mr-4 w-5 h-5 text-orange-500
                        div class=flex-1
                            div class=font-semibold text-lgCash On Delivery (COD)div
                            div class=text-sm text-gray-600Pay when you receive your orderdiv
                        div
                        svg xmlns=httpwww.w3.org2000svg class=h-6 w-6 text-blue-500 fill=none viewBox=0 0 24 24 stroke=currentColor
                            path stroke-linecap=round stroke-linejoin=round stroke-width=2 d=M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z 
                        svg
                    label
                div

                !-- Action Buttons --
                div class=flex flex-col smflex-row smspace-x-4 space-y-3 smspace-y-0 mt-6
                    button
                        id=payNowBtn
                        class=flex-1 bg-orange-500 hoverbg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition disabledopacity-60 disabledcursor-not-allowed
                        Continue & Pay
                    button

                    button
                        type=button
                        onclick=window.location.href='cart.html'
                        class=flex-1 border border-gray-300 text-gray-700 hoverbg-gray-100 font-semibold py-3 px-4 rounded-lg transition
                        Back to Cart
                    button
                div

                p id=paymentError class=text-red-500 text-sm mt-3 hiddenp
            div
        div
    div

    script
         ----------------------------
         Load order from localStorage
         ----------------------------
        const orderIdEl = document.getElementById(orderId);
        const itemCountEl = document.getElementById(itemCount);
        const totalAmountEl = document.getElementById(totalAmount);
        const orderItemsEl = document.getElementById(orderItems);
        const paymentErrorEl = document.getElementById(paymentError);
        const payNowBtn = document.getElementById(payNowBtn);

        let orderData = null;
        let totalAmountNumber = 0;  in INR (not paise)

        function generateOrderId() {
            const prefix = URB;
            const random = Math.floor(100000 + Math.random()  900000);
            return prefix + random;
        }

        function loadOrder() {
            try {
                orderData = JSON.parse(localStorage.getItem(urbanStichOrder));
            } catch (e) {
                orderData = null;
            }

            if (!orderData  !orderData.items  orderData.items.length === 0) {
                orderIdEl.textContent = -;
                itemCountEl.textContent = 0;
                totalAmountEl.textContent = ₹0;
                orderItemsEl.innerHTML = `
                    div class=text-sm text-gray-500
                        No items found in your order. Please go back to the cart and try again.
                    div
                `;
                payNowBtn.disabled = true;
                return;
            }

            if (!orderData.orderId) {
                orderData.orderId = generateOrderId();
                localStorage.setItem(urbanStichOrder, JSON.stringify(orderData));
            }

            const itemCount = orderData.itemCount  orderData.items.length;
            totalAmountNumber = Number(orderData.total)  0;

            orderIdEl.textContent = orderData.orderId;
            itemCountEl.textContent = itemCount;
            totalAmountEl.textContent = ₹ + totalAmountNumber.toFixed(2);

             Render items
            orderItemsEl.innerHTML = ;
            orderData.items.forEach((item, index) = {
                 Adjust these keys to your actual product object structure
                const title = item.title  item.name  `Item ${index + 1}`;
                const price = Number(item.price)  0;
                const quantity = Number(item.quantity  item.qty  1);
                const size = item.selectedSize  item.size  null;

                const itemRow = document.createElement(div);
                itemRow.className = flex justify-between items-center border-b pb-2 lastborder-b-0;

                itemRow.innerHTML = `
                    div
                        div class=font-semibold text-gray-800${title}div
                        div class=text-xs text-gray-500
                            Qty ${quantity}${size   • Size  + size  }
                        div
                    div
                    div class=font-semibold text-gray-800
                        ₹${(price  quantity).toFixed(2)}
                    div
                `;
                orderItemsEl.appendChild(itemRow);
            });
        }

         ----------------------------
         Payment method UI switching
         ----------------------------
        const paymentOptions = document.querySelectorAll(.payment-option);

        paymentOptions.forEach(option = {
            const input = option.querySelector(input[type='radio']);
            option.addEventListener(click, () = {
                input.checked = true;
                updatePaymentOptionStyles();
            });
            input.addEventListener(change, updatePaymentOptionStyles);
        });

        function updatePaymentOptionStyles() {
            paymentOptions.forEach(option = {
                const input = option.querySelector(input[type='radio']);
                if (input.checked) {
                    option.classList.add(border-orange-500, bg-orange-50);
                } else {
                    option.classList.remove(border-orange-500, bg-orange-50);
                }
            });
        }

        function getSelectedPaymentMethod() {
            const selected = document.querySelector(input[name='paymentMethod']checked);
            return selected  selected.value  null;
        }

         ----------------------------
         Razorpay Integration
         ----------------------------
        function payWithRazorpay() {
            if (!totalAmountNumber  totalAmountNumber = 0) {
                showError(Invalid amount. Go back to cart and try again.);
                return;
            }

            const amountInPaise = Math.round(totalAmountNumber  100);

            const options = {
                key YOUR_RAZORPAY_KEY_ID,  TODO replace with your real key
                amount amountInPaise,
                currency INR,
                name UrbanStich,
                description Order Payment -  + (orderData.orderId  ),
                image ,  add logo URL if you have one
                handler function (response) {
                     Payment success callback
                    console.log(Razorpay success, response);
                    clearCartAndOrder();
                    window.location.href = order-success.html;  create this page
                },
                prefill {
                    name orderData.customerName  ,
                    email orderData.customerEmail  ,
                    contact orderData.customerPhone  ,
                },
                notes {
                    order_id orderData.orderId  ,
                },
                theme {
                    color #f97316,
                },
            };

            const rzp = new Razorpay(options);
            rzp.on(payment.failed, function (response) {
                console.error(Payment failed, response.error);
                showError(Payment failed. Please try again or choose another method.);
            });

            rzp.open();
        }

         ----------------------------
         COD Handling
         ----------------------------
        function placeCODOrder() {
            if (!orderData  !orderData.items  orderData.items.length === 0) {
                showError(No order data found. Go back to cart.);
                return;
            }

             Here you would normally hit your backend to create a COD order.
             For now we just simulate success
            alert(COD order placed successfully! Order ID  + orderData.orderId);
            clearCartAndOrder();
            window.location.href = order-success.html;  create this page
        }

         ----------------------------
         Helpers
         ----------------------------
        function showError(msg) {
            paymentErrorEl.textContent = msg;
            paymentErrorEl.classList.remove(hidden);
        }

        function clearCartAndOrder() {
             Clear your cart & order data keys
            localStorage.removeItem(urbanStichOrder);
            localStorage.removeItem(cartItems);
            localStorage.removeItem(cartTotal);
        }

         ----------------------------
         Main button click
         ----------------------------
        payNowBtn.addEventListener(click, function () {
            paymentErrorEl.classList.add(hidden);
            const method = getSelectedPaymentMethod();

            if (!method) {
                showError(Please select a payment method.);
                return;
            }

            if (method === razorpay) {
                payWithRazorpay();
            } else if (method === cod) {
                placeCODOrder();
            } else {
                showError(Invalid payment method selected.);
            }
        });

         Init
        loadOrder();
        updatePaymentOptionStyles();
    script
body
html
