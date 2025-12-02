# UrbanStich – Project Specification

## Overview
UrbanStich is a web-based e-commerce platform focused on men’s fashion. Users can browse items, manage a cart, and place orders. Admins can manage inventory and products. The system is built using a simple full-stack architecture with a Node.js backend and a custom frontend (no frameworks).

## Tech Stack
**Frontend:** HTML, Tailwind CSS, JavaScript  
**Backend:** Node.js + Express  
**Database:** MongoDB/MySQL (to be decided)  
**Payment:** Razorpay (test mode)  
**Auth:** Session/JWT

## Core Features

### ✔ User Side
- View product catalog  
- Product detail view  
- Add/remove/update cart items  
- Checkout page  
- Order placement and confirmation  
- View past orders (if implemented)

### ✔ Admin Side
- Add products  
- Edit products  
- Delete products  
- Manage stock  
- View orders + update status  

## Functional Breakdown

### Authentication
- Register with email + password  
- Login + logout  
- Secure password hashing  

### Product System
Each product contains:
- title  
- price  
- category  
- size options  
- stock  
- images  

### Cart System
- User-specific cart  
- Quantity updates  
- Auto-recalculates totals  
- Persistent (session/database)  

### Checkout + Payment
- Checkout page with shipping details  
- Order review  
- Razorpay payment flow  
- Store successful order  

### Orders
Stored fields:
- orderId  
- userId  
- items[]  
- amount  
- status *(Placed | Shipped | Delivered | Cancelled)*  
- paymentStatus  
- timestamp  

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
GET    /api/products/:id

GET    /api/cart
POST   /api/cart
PUT    /api/cart/:itemId
DELETE /api/cart/:itemId

POST   /api/orders
GET    /api/orders/my

// Admin
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/orders
PUT    /api/admin/orders/:id
```

## Database Structure

### User
- id  
- name  
- email  
- passwordHash  
- address  
- role *(user | admin)*  

### Product
- id  
- title  
- description  
- price  
- category  
- sizes[]  
- stock  
- images[]  

### Cart
- userId  
- items: `{ productId, size, quantity }`  

### Order
- orderId  
- userId  
- items[]  
- totalAmount  
- paymentStatus  
- orderStatus  
- timestamp  

## Non-Functional Requirements
- Responsive UI  
- CRUD without full reload when possible  
- Error-safe UI  
- Protected admin routes  

## Future Enhancements
- Wishlist  
- Coupons  
- User profile editing  
- Email notifications  
- Image upload  
