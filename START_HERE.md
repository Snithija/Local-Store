# 🚀 START HERE - Quick Setup & Run Commands

## ⚡ Quick Start (5 Minutes)

### Step 1: Setup Database
```bash
# Option A: Use Supabase (Free)
# 1. Go to https://supabase.com
# 2. Create project
# 3. Copy database URL from Settings > Database

# Option B: Local PostgreSQL
# Create database: CREATE DATABASE store_db;
```

### Step 2: Backend Setup
```bash
cd backend

# Create .env file
# Add these lines:
# PORT=5000
# DATABASE_URL="your-database-url-here"
# JWT_SECRET="generate-with-command-below"
# FRONTEND_URL=http://localhost:5173

# Generate JWT Secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Install & Setup
npm install
npm run prisma:generate
npm run prisma:push

# Seed products (optional - adds dummy products to DB)
npm run prisma:seed
```

### Step 3: Frontend Setup
```bash
# From project root (not backend folder)
echo VITE_API_URL=http://localhost:5000 > .env
npm install
```

## 🎯 Run Commands

### Run Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:5000

### Run Frontend (Terminal 2)
```bash
# From project root
npm run dev
```
✅ Frontend runs on: http://localhost:5173

## ✅ Verify It Works

1. Open http://localhost:5000 → Should see "Server is running!"
2. Open http://localhost:5173 → Should see store frontend
3. Register a user → Should work
4. Login → Should redirect to dashboard

## 📝 What Was Changed

✅ **Removed all dummy data from frontend**
✅ **All data now comes from PostgreSQL database**
✅ **ProductContext** - Uses API calls
✅ **OrderContext** - Uses API calls  
✅ **DeliveryDashboard** - Uses API calls
✅ **Created seed script** - Migrates dummy products to database

## 🔧 Troubleshooting

**Backend won't start?**
- Check `DATABASE_URL` in `backend/.env`
- Run `npm run prisma:generate` again

**Frontend can't connect?**
- Check backend is running on port 5000
- Check `VITE_API_URL` in root `.env`

**No products showing?**
- Run `npm run prisma:seed` in backend folder
- Or add products manually as manager

## 📚 More Info

- **Detailed Setup:** See `SETUP.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Run Commands:** See `RUN_COMMANDS.md`

---

**Ready to test?** Start both servers and open http://localhost:5173! 🎉

