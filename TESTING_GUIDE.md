# Testing Guide - Full Stack Application

This guide will walk you through testing all features of your full-stack application.

## Prerequisites Check

Before testing, ensure you have:
- ✅ Node.js installed (v18+)
- ✅ PostgreSQL database set up (local or cloud)
- ✅ Backend dependencies installed (`cd backend && npm install`)
- ✅ Frontend dependencies installed (`npm install`)

## Step 1: Database Setup

### Option A: Quick Setup with Supabase (Recommended)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for database to be ready (2-3 minutes)
4. Go to **Settings** → **Database**
5. Find **Connection string** → **URI**
6. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)

### Option B: Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE store_db;
\q
```

## Step 2: Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL="YOUR_DATABASE_URL_HERE"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
FRONTEND_URL=http://localhost:5173
EOF

# Replace YOUR_DATABASE_URL_HERE with your actual database URL

# Initialize Prisma
npm run prisma:generate
npm run prisma:push
```

**Expected Output:**
```
✅ Prisma Client generated
✅ Database schema pushed successfully
```

## Step 3: Start Backend Server

```bash
# In backend directory
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
👉 CORS enabled for: http://localhost:5173
✅ Connected to PostgreSQL
```

**Test Backend:**
Open browser: http://localhost:5000

You should see:
```json
{
  "message": "Server is running!",
  "status": "OK",
  "timestamp": "..."
}
```

## Step 4: Configure Frontend

```bash
# From project root (not backend folder)
echo "VITE_API_URL=http://localhost:5000" > .env
```

## Step 5: Start Frontend Server

```bash
# From project root
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Testing Workflow

### Test 1: User Registration

1. Open http://localhost:5173
2. Click **Register** or navigate to `/register`
3. Fill in the form:
   - Name: `Test Customer`
   - Email: `customer@test.com`
   - Password: `password123`
   - Role: Select **customer**
4. Click **Register**

**Expected Result:**
- ✅ Success message: "Registration successful! Please log in."
- ✅ Redirected to login page

**Test with different roles:**
- Register as **manager**: `manager@test.com`
- Register as **delivery**: `delivery@test.com`

### Test 2: User Login

1. Go to login page
2. Enter credentials:
   - Email: `customer@test.com`
   - Password: `password123`
   - Role: **customer**
3. Click **Login**

**Expected Result:**
- ✅ Redirected to `/customer` (customer dashboard)
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage

**Test Manager Login:**
- Email: `manager@test.com`
- Role: **manager**
- Should redirect to `/manager`

**Test Delivery Login:**
- Email: `delivery@test.com`
- Role: **delivery**
- Should redirect to `/delivery`

### Test 3: Product Management (Manager)

1. Login as **manager**
2. Navigate to **Products** tab
3. Click **Add Product**
4. Fill in:
   - Name: `Test Product`
   - Category: `Groceries`
   - Description: `A test product`
   - Price: `10.99`
   - Stock: `50`
   - Image: `📦` (or image URL)
5. Click **Save**

**Expected Result:**
- ✅ Product appears in the products table
- ✅ Product visible in the list

**Test Product Updates:**
1. Click **Edit** on a product
2. Change stock to `25`
3. Click **Save**
4. ✅ Stock updated in the table

**Test Stock Update:**
1. Find a product in the table
2. Change stock number directly in the input field
3. Press Enter or click outside
4. ✅ Stock updates immediately

**Test Product Deletion:**
1. Click **Delete** (trash icon) on a product
2. Confirm deletion
3. ✅ Product removed from list

### Test 4: Browse Products (Customer)

1. Login as **customer**
2. You should see products displayed
3. Browse different categories
4. ✅ Products load from database
5. ✅ Images and prices display correctly

### Test 5: Shopping Cart (Customer)

1. As **customer**, browse products
2. Click **Add to Cart** on a product
3. ✅ Product added to cart
4. ✅ Stock decreases (check manager dashboard)
5. Open cart (cart icon)
6. ✅ Cart shows added items
7. Update quantity:
   - Increase quantity
   - ✅ Stock decreases accordingly
   - Decrease quantity
   - ✅ Stock increases accordingly
8. Remove item from cart
9. ✅ Stock returns to original value

### Test 6: Place Order (Customer)

1. Add items to cart
2. Open cart
3. Enter delivery postcode (e.g., `SW1A 1AA`)
4. Click **Confirm Order**

**Expected Result:**
- ✅ Order created successfully
- ✅ Redirected to tracking page
- ✅ Cart cleared
- ✅ Order visible in manager dashboard

**Check Backend Logs:**
You should see:
```
✅ Order created: { orderId: '...', orderNumber: '...' }
```

### Test 7: Order Tracking (Customer)

1. After placing order, you should be on tracking page
2. ✅ Order number displayed
3. ✅ Status shows "CONFIRMED"
4. ✅ Order items listed
5. ✅ Total amount displayed
6. ✅ Delivery address shown

**Test Refresh:**
1. Click refresh button
2. ✅ Order status updates from API

### Test 8: Manager Order Management

1. Login as **manager**
2. Go to **Orders** tab
3. ✅ See all orders from customers
4. Test order actions:

**Accept Order:**
1. Find a "Pending" order
2. Click **Accept**
3. ✅ Status changes to "Preparing"

**Mark as Ready:**
1. Find a "Preparing" order
2. Click **Mark as Ready**
3. ✅ Status changes to "Ready"

**Assign Delivery:**
1. Find a "Ready" order
2. Click **Assign Delivery Partner**
3. ✅ Status changes to "Out for Delivery"
4. ✅ Order appears in delivery dashboard

**Reject Order:**
1. Find a "Pending" order
2. Click **Reject**
3. ✅ Order removed from list

### Test 9: Delivery Dashboard

1. Login as **delivery**
2. ✅ See assigned orders
3. ✅ See orders ready for pickup
4. Click on an order
5. Update status to **DELIVERED**
6. ✅ Status updates
7. ✅ Order marked as completed in manager dashboard

### Test 10: Real-time Updates

1. Open two browser windows:
   - Window 1: Customer tracking page
   - Window 2: Manager dashboard
2. In Manager dashboard, update order status
3. In Customer window, refresh or wait
4. ✅ Status updates automatically

## API Testing with Postman/Thunder Client

### Test Authentication Endpoints

**Register:**
```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@test.com",
  "password": "password123",
  "role": "customer"
}
```

**Login:**
```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "apitest@test.com",
  "password": "password123",
  "role": "customer"
}
```

Copy the `token` from response for next requests.

### Test Product Endpoints

**Get All Products:**
```http
GET http://localhost:5000/api/products
```

**Create Product (Manager):**
```http
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "API Test Product",
  "category": "Groceries",
  "price": 15.99,
  "stock": 100,
  "lowStockThreshold": 10,
  "image": "📦",
  "description": "Test product via API"
}
```

### Test Order Endpoints

**Create Order:**
```http
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "items": [
    {
      "id": "PRODUCT_ID_HERE",
      "quantity": 2,
      "price": 10.99
    }
  ],
  "total": 21.98,
  "deliveryAddress": "123 Test Street"
}
```

**Track Order:**
```http
GET http://localhost:5000/api/orders/track/ORDER_NUMBER_HERE
```

## Debugging Tips

### Check Backend Logs

Watch the terminal where backend is running:
- ✅ Green checkmarks = Success
- ❌ Red X = Error
- Look for error messages

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - Red errors
   - Network request failures
   - API call logs

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Look for:
   - Failed requests (red)
   - 401/403 errors (authentication)
   - 500 errors (server errors)
   - Check request/response details

### Common Issues

**Issue: "Cannot connect to server"**
- ✅ Check backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Check CORS settings in `backend/server.js`

**Issue: "Database connection error"**
- ✅ Verify `DATABASE_URL` in backend `.env`
- ✅ Check database is accessible
- ✅ Run `npm run prisma:generate` again

**Issue: "401 Unauthorized"**
- ✅ Check token in localStorage
- ✅ Verify JWT_SECRET in backend `.env`
- ✅ Try logging in again

**Issue: "Products not loading"**
- ✅ Check backend API: http://localhost:5000/api/products
- ✅ Check browser console for errors
- ✅ Verify CORS is configured

**Issue: "Order not created"**
- ✅ Check user is logged in
- ✅ Verify cart has items
- ✅ Check backend logs for errors
- ✅ Verify database connection

## Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Database connection successful
- [ ] Can register new users
- [ ] Can login with registered users
- [ ] Manager can add products
- [ ] Manager can update product stock
- [ ] Manager can delete products
- [ ] Customer can see products
- [ ] Customer can add items to cart
- [ ] Customer can place orders
- [ ] Customer can track orders
- [ ] Manager can see all orders
- [ ] Manager can update order status
- [ ] Manager can assign delivery
- [ ] Delivery can see assigned orders
- [ ] Delivery can update order status
- [ ] Real-time updates work

## Next Steps

Once all tests pass:
1. ✅ Add more products through manager dashboard
2. ✅ Test with multiple users
3. ✅ Test edge cases (empty cart, out of stock, etc.)
4. ✅ Deploy to production (see SETUP.md)

## Need Help?

If something doesn't work:
1. Check error messages in console
2. Check backend terminal logs
3. Verify all environment variables
4. Review SETUP.md for detailed instructions
5. Check database connection

Happy Testing! 🚀

