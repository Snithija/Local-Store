# Quick Testing Steps

## 1. Setup (One Time)

### Backend Setup
```bash
cd backend

# Create .env file manually or copy from .env.example
# Add your DATABASE_URL and generate JWT_SECRET

# Generate JWT Secret (run this command):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Initialize database
npm run prisma:generate
npm run prisma:push

# Start backend
npm run dev
```

### Frontend Setup
```bash
# From project root
echo VITE_API_URL=http://localhost:5000 > .env

# Start frontend
npm run dev
```

## 2. Quick Test Flow

### Test 1: Register & Login
1. Open http://localhost:5173
2. Register: `customer@test.com` / `password123` / role: `customer`
3. Login with same credentials
4. ✅ Should redirect to customer dashboard

### Test 2: Manager - Add Product
1. Register: `manager@test.com` / `password123` / role: `manager`
2. Login as manager
3. Go to Products tab
4. Click "Add Product"
5. Fill form and save
6. ✅ Product appears in list

### Test 3: Customer - Place Order
1. Login as customer
2. Add product to cart
3. Open cart, enter postcode
4. Confirm order
5. ✅ Redirected to tracking page

### Test 4: Manager - Manage Orders
1. Login as manager
2. Go to Orders tab
3. ✅ See customer orders
4. Click "Accept" on an order
5. ✅ Status changes to "Preparing"

### Test 5: Track Order
1. As customer, place an order
2. On tracking page, verify:
   - ✅ Order number displayed
   - ✅ Status shows "CONFIRMED"
   - ✅ Items listed
   - ✅ Total shown

## 3. Verify Backend is Working

Open in browser: http://localhost:5000

Should see:
```json
{
  "message": "Server is running!",
  "status": "OK"
}
```

## 4. Test API Directly

Open: http://localhost:5000/api/products

Should see products array (may be empty initially).

## Common Issues

**Backend won't start:**
- Check DATABASE_URL in backend/.env
- Run `npm run prisma:generate` again

**Frontend can't connect:**
- Check backend is running on port 5000
- Check VITE_API_URL in root .env

**Database errors:**
- Verify DATABASE_URL is correct
- Check database is accessible
- Run `npm run prisma:push` again

For detailed testing, see TESTING_GUIDE.md

