# Full Stack Setup Guide

This guide will help you set up both the frontend and backend to work together as a complete full-stack application.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```sql
CREATE DATABASE store_db;
```

#### Option B: Cloud Database (Recommended)

Use a free PostgreSQL service:
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app
- **Render**: https://render.com

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Replace with your actual database URL
DATABASE_URL="postgresql://username:password@localhost:5432/store_db?schema=public"

# JWT Configuration
# Generate a strong secret key (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Replace `DATABASE_URL` with your actual PostgreSQL connection string
- Generate a strong `JWT_SECRET` (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 5. Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push
```

### 6. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# The server will run on http://localhost:5000
```

## Frontend Setup

### 1. Navigate to Root Directory

```bash
# If you're in backend, go back to root
cd ..
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start Frontend Development Server

```bash
npm run dev

# The frontend will run on http://localhost:5173
```

## Testing the Setup

### 1. Test Backend

Open your browser and go to:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "Server is running!",
  "status": "OK",
  "timestamp": "..."
}
```

### 2. Test Frontend

Open your browser and go to:
```
http://localhost:5173
```

You should see the store frontend.

### 3. Test Registration

1. Go to the registration page
2. Register a new user with role "customer"
3. You should be redirected to login

### 4. Test Login

1. Login with your credentials
2. You should be redirected based on your role

### 5. Test Product Management (Manager)

1. Register/login as a "manager"
2. Go to Products tab
3. Add a new product
4. Verify it appears in the list

### 6. Test Order Flow (Customer)

1. Register/login as a "customer"
2. Add products to cart
3. Place an order
4. Track the order

## Common Issues & Solutions

### Database Connection Error

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists
- Check firewall/network settings

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in `backend/server.js`

### Authentication Errors

**Error:** `401 Unauthorized` or `403 Forbidden`

**Solution:**
- Verify JWT_SECRET is set in backend `.env`
- Check token is being sent in requests
- Verify user role matches required role

### Products Not Loading

**Error:** Products don't appear or show loading forever

**Solution:**
- Check backend is running
- Verify API endpoint: `http://localhost:5000/api/products`
- Check browser console for errors
- Verify CORS is configured correctly

## Project Structure

```
store-page/
├── backend/
│   ├── config/
│   │   ├── db.js          # PostgreSQL connection (legacy)
│   │   └── prisma.js      # Prisma client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── orderModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── server.js
│   └── package.json
├── src/
│   ├── api/
│   │   └── axios.js       # API client configuration
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ProductContext.jsx
│   │   ├── OrderContext.jsx
│   │   └── CartContext.jsx
│   └── ...
└── package.json
```

## API Endpoints Reference

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Manager)
- `PUT /api/products/:id` - Update product (Manager)
- `PATCH /api/products/:id/stock` - Update stock (Manager)
- `DELETE /api/products/:id` - Delete product (Manager)

### Orders
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/orders/track/:orderNumber` - Track order
- `GET /api/orders/manager/all` - Get all orders (Manager)
- `PATCH /api/orders/manager/:id/status` - Update status (Manager)
- `GET /api/orders/delivery/all` - Get delivery orders
- `PATCH /api/orders/delivery/:id/status` - Update status (Delivery)

## Next Steps

1. ✅ Backend and frontend are connected
2. ✅ Database is set up
3. ✅ Authentication is working
4. ✅ Products can be managed
5. ✅ Orders can be created and tracked

## Production Deployment

For production deployment:

1. **Backend:**
   - Set `NODE_ENV=production`
   - Use a production database
   - Set strong `JWT_SECRET`
   - Configure proper CORS origins
   - Deploy to services like Railway, Render, or Vercel

2. **Frontend:**
   - Update `VITE_API_URL` to production backend URL
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or similar

## Support

If you encounter issues:
1. Check the error messages in console
2. Verify all environment variables are set
3. Ensure both servers are running
4. Check database connection
5. Review the logs in backend terminal

