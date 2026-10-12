# 🛒 UrbanStitch - Modern Men's Fashion E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Payment-Razorpay-02042B.svg)](https://razorpay.com/)
[![Tests](https://img.shields.io/badge/Tests-10%2F10%20Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)]()

> A full-stack e-commerce web application featuring modern responsive design, product catalog filtering, cart management, user authentication, order processing, and multi-mode payment workflows (Cash on Delivery + Razorpay payment gateway integration).

---

## 🌐 Live Demo & Preview

- **Live Application:** [https://urbanstitch.onrender.com](https://urbanstitch.onrender.com) *(Replace with your deployed Render URL)*
- **API Base URL:** `https://urbanstitch.onrender.com/api`

---

## 📸 Screenshots

| Home & Product Catalog | Shopping Cart & Checkout |
|:---:|:---:|
| ![Product Catalog](https://via.placeholder.com/600x350/0f172a/ffffff?text=UrbanStitch+Catalog) | ![Shopping Cart](https://via.placeholder.com/600x350/0f172a/ffffff?text=UrbanStitch+Checkout) |

---

## ✨ Features

- **🛍️ Dynamic Product Catalog:** Browse apparel across multiple categories (T-Shirts, Shirts, Jeans, Jackets) with real-time category filtering.
- **🛒 Interactive Shopping Cart:** Add products, customize quantities, choose sizing, and review subtotals dynamically.
- **🔐 User Authentication:** Secure user registration, credential verification, and session token persistence in `localStorage`.
- **💳 Multi-Method Checkout:**
  - **Online Payment:** Integrated with **Razorpay Checkout SDK** and backend HMAC-SHA256 signature verification.
  - **Cash on Delivery (COD):** One-click order confirmation with instant state transitions.
- **📦 Order History & Management:** Authenticated order linking allowing users to track their placed orders.
- **📬 Newsletter Subscription:** Real-time email validation and subscription intake.
- **🚀 Dual Deployment Architecture:**
  - **Unified Mode (Default):** Express server serves both the REST API and the frontend static assets on a single port with zero CORS configuration.
  - **Decoupled Mode:** Frontend and Backend can run independently on separate ports or cloud providers (e.g., Vercel + Render).

---

## 🛠️ Tech Stack

- **Frontend:**
  - Semantic HTML5 & Modern Vanilla JavaScript (ES Modules)
  - Tailwind CSS (Utility-first responsive design)
  - Razorpay Standard Checkout SDK
- **Backend:**
  - Node.js & Express 5.x
  - In-Memory Data Store (Products, Users, Sessions, Orders)
  - Razorpay Node SDK with HMAC-SHA256 signature verification
  - CORS, Body-Parser, Nanoid, Dotenv
- **Testing & Quality Assurance:**
  - Automated functional & integration test suite (10 comprehensive test cases)
  - Test coverage for catalog, auth, order creation, payment verification, COD, and newsletters.

---

## 📂 Project Structure

```text
urbanstitch/
├── package.json              # Root project descriptor & npm scripts
├── render.yaml               # Render 1-click deployment blueprint
├── .env.example              # Template environment variables
├── .gitignore                # Production gitignore rules
├── urbanstich/
│   ├── backend/
│   │   ├── server.js         # Express REST API & static file server
│   │   ├── package.json      # Backend dependencies & scripts
│   │   └── .env.example      # Backend-specific environment template
│   ├── frontend/
│   │   ├── index.html        # Storefront storefront & catalog UI
│   │   ├── payment.html      # Checkout & payment method selection UI
│   │   ├── server.js         # Dedicated frontend static server (optional)
│   │   ├── package.json      # Frontend server dependencies
│   │   ├── vercel.json       # Optional Vercel static deployment config
│   │   └── assets/
│   │       ├── css/styles.css
│   │       └── js/
│   │           ├── api.js     # API client with dynamic host resolution
│   │           ├── auth.js    # Auth state & token management
│   │           ├── cart.js    # Cart state & localStorage sync
│   │           ├── main.js    # Frontend entry point
│   │           ├── payment.js # Payment handling (Razorpay & COD)
│   │           └── ui.js      # Modal controls & event delegation
│   └── START_SERVERS.bat     # Windows 1-click startup script (dual port)
└── testsprite_tests/         # Automated integration test cases (TC001-TC010)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)
- Optional: Python 3.x (to run integration tests)

### 1. Clone the Repository

```bash
git clone https://github.com/chincholepragyawan2310-prog/urbanstich1.git
cd urbanstich1
```

### 2. Configure Environment Variables

Copy `.env.example` to `urbanstich/backend/.env`:

```bash
cp .env.example urbanstich/backend/.env
```

*(On Windows PowerShell: `Copy-Item .env.example urbanstich/backend/.env`)*

Configure your keys in `urbanstich/backend/.env`:
```env
PORT=4000
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

> **Note:** The application will run smoothly in COD mode even if Razorpay keys are left blank!

### 3. Install Dependencies & Start the Server

```bash
# Install backend dependencies
cd urbanstich/backend
npm install

# Start the full-stack server
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:4000`**

*(Both the frontend store and backend API `/api` are served together at `http://localhost:4000`)*

---

## 🧪 Running Automated Tests

UrbanStitch includes 10 automated integration tests covering all critical user flows.

With the server running on port 4000:

```bash
# In another terminal window:
python testsprite_tests/TC001_get_products_api_should_return_all_products_or_filtered_by_category.py
```

Or run all 10 tests in PowerShell:
```powershell
Get-ChildItem testsprite_tests/TC*.py | ForEach-Object { python $_.FullName }
```

**Test Suite Coverage:**
- ✅ `TC001` - Product Catalog & Category Filters
- ✅ `TC002` - User Registration & Email Validation
- ✅ `TC003` - User Login & Token Authentication
- ✅ `TC004` - User Order History Association
- ✅ `TC005` - Order Creation & Total Amount Calculation
- ✅ `TC006` - Razorpay Order Creation
- ✅ `TC007` - Payment Signature Verification
- ✅ `TC008` - Cash on Delivery (COD) Confirmation
- ✅ `TC009` - Newsletter Subscription & Email Format Validation
- ✅ `TC010` - Legacy Checkout Backward Compatibility

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/products` | Fetch catalog (filter with `?category=...`) | No |
| `POST` | `/api/auth/register` | Register new user account (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & receive bearer token | No |
| `POST` | `/api/orders` | Create a new pending order from cart items | Optional (auto-linked) |
| `GET` | `/api/orders` | Fetch orders for the logged-in user | Yes (`Bearer <token>`) |
| `POST` | `/api/payment/create-razorpay-order` | Create Razorpay order ID for payment gateway | No |
| `POST` | `/api/payment/verify` | Verify Razorpay HMAC-SHA256 payment signature | No |
| `POST` | `/api/orders/:id/cod-confirm` | Confirm Cash on Delivery order | No |
| `POST` | `/api/newsletter/subscribe` | Subscribe email address to newsletter | No |

---

## ☁️ Deployment Guide

### Option 1: Free 1-Click Deployment on Render (Recommended)

1. Create a free account at [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `chincholepragyawan2310-prog/urbanstich1`.
4. Configure the settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `RAZORPAY_KEY_ID`: *(Your Razorpay Test Key)*
   - `RAZORPAY_KEY_SECRET`: *(Your Razorpay Test Secret)*
6. Click **Deploy Web Service**.
7. Render will provide a live URL (e.g., `https://urbanstitch.onrender.com`). Your store and API are immediately live!

---

## 🔒 Security Best Practices

- No secrets or credentials are hardcoded or tracked in Git.
- Environment variables are isolated via `.env` files (excluded via `.gitignore`).
- Test payment signatures are strictly validated using HMAC-SHA256.

---

## 📄 License

This project is licensed under the ISC License.
