# UrbanStich E-Commerce Project

A modern e-commerce website for men's fashion with separate backend and frontend.

## Project Structure

```
urbanstich/
├── backend/          # Node.js/Express API server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── node_modules/ # Backend dependencies
│
└── frontend/         # Frontend static files
    ├── index.html    # Main HTML file
    └── assets/       # CSS and JavaScript files
        ├── css/
        │   └── styles.css
        └── js/
            ├── api.js      # API functions
            ├── auth.js     # Authentication logic
            ├── cart.js     # Cart management
            ├── ui.js       # UI event handlers
            └── main.js     # Entry point
```

## Quick Start

### Easiest Way - Start Both Servers

**Just double-click: `START_SERVERS.bat`**

This will:
- ✅ Check and install dependencies automatically
- ✅ Start backend server on port 4000
- ✅ Start frontend server on port 3000
- ✅ Open your browser automatically

Then access the website at: **http://localhost:3000**

---

### Manual Setup (If Needed)

**Backend (Port 4000):**
```bash
cd backend
npm install    # First time only
node server.js
```

**Frontend (Port 3000):**
```bash
cd frontend
npm install    # First time only
node server.js
```

Then open: **http://localhost:3000**

## Features

- **Product Catalog**: Browse products by category (T-Shirts, Shirts, Jeans, Jackets)
- **Shopping Cart**: Add items, update quantities, and remove items
- **User Authentication**: Register and login functionality
- **Newsletter Subscription**: Subscribe to newsletter
- **Checkout**: Complete orders with payment processing

## API Endpoints

- `GET /api/products` - Get all products (optional `?category=` query parameter)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/checkout` - Process checkout
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/orders` - Get user orders (requires authentication)

## Notes

- The backend serves both the API and the frontend static files
- ES modules are used in the frontend, which requires HTTP protocol (not file://)
- CORS is enabled for all origins
- All data is stored in-memory (resets on server restart)

