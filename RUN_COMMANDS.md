# Commands to Run Frontend and Backend

## Quick Start Commands

### Option 1: Run Both Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From project root (not backend folder)
npm run dev
```

### Option 2: Using npm-run-all (If Installed)

```bash
# Install concurrently if not already installed
npm install --save-dev concurrently

# Add to root package.json scripts:
# "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
# "dev:backend": "cd backend && npm run dev"
# "dev:frontend": "npm run dev"

# Then run:
npm run dev:all
```

## First Time Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
# From project root
npm install
```

### 2. Setup Database

```bash
cd backend

# Create .env file with your DATABASE_URL
# Then run:
npm run prisma:generate
npm run prisma:push

# Seed dummy products (optional):
npm run prisma:seed
```

### 3. Configure Frontend

```bash
# From project root
echo VITE_API_URL=http://localhost:5000 > .env
```

## Running Commands

### Backend Commands
```bash
cd backend

# Development (with auto-reload)
npm run dev

# Production
npm start

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Push schema to database
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database with products
```

### Frontend Commands
```bash
# From project root

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Verify Everything is Running

1. **Backend:** Open http://localhost:5000
   - Should see: `{"message":"Server is running!","status":"OK"}`

2. **Frontend:** Open http://localhost:5173
   - Should see your store frontend

3. **API Test:** Open http://localhost:5000/api/products
   - Should see products array (may be empty if not seeded)

## Troubleshooting

**Backend won't start:**
- Check `DATABASE_URL` in `backend/.env`
- Run `npm run prisma:generate` again
- Check if port 5000 is available

**Frontend won't start:**
- Check `VITE_API_URL` in root `.env`
- Make sure backend is running first
- Check if port 5173 is available

**Database errors:**
- Verify `DATABASE_URL` is correct
- Run `npm run prisma:push` again
- Check database is accessible

## Windows PowerShell Commands

If using PowerShell on Windows:

**Backend:**
```powershell
cd backend
npm run dev
```

**Frontend (New Terminal):**
```powershell
npm run dev
```

## Stop Servers

Press `Ctrl + C` in each terminal to stop the servers.

