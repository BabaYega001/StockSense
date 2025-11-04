# 🚀 Quick Start - Run StockSense AI

## ✅ Environment Files Created!
The `.env` files have been created automatically.

---

## Step-by-Step Instructions

### STEP 1: Install MongoDB ✅
**Windows (You need to do this manually):**
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Run installer and select "Complete" installation
3. MongoDB will start automatically as a service

**Or use MongoDB Atlas (Cloud - Free):**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Get connection string
4. Update `server/.env` with Atlas connection string

---

### STEP 2: Open TWO Terminal Windows

You need **2 terminals** - one for backend, one for frontend.

---

### TERMINAL 1 - Start Backend Server

```powershell
# Navigate to server folder
cd server

# Install dependencies (first time only)
npm install

# Start backend server
npm run dev
```

**You should see:**
```
✓ MongoDB connected
✓ Server running on port 5000
```

**Keep this terminal running!**

---

### TERMINAL 2 - Start Frontend

Open a **NEW** terminal window:

```powershell
# Navigate to project root
cd "C:\Users\LENOVO\Desktop\Projects\Project 1\Trial 3"

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

**You should see:**
```
VITE ready at http://localhost:3000
```

---

### STEP 3: Open Browser

Go to: **http://localhost:3000**

---

### STEP 4: Create Account

1. Click "Register" or go to `/register`
2. Enter:
   - Email
   - Password
   - Full Name
3. Click Register
4. You're now logged in!

---

### STEP 5: Start Trading!

- **Dashboard** - View portfolio overview
- **Trading** - Buy/sell stocks
- **Portfolio** - See your positions
- **Goals** - Create investment goals
- **Watchlist** - Track stocks
- **Predictions** - Get AI analysis
- **Profile** - Manage your account

---

## 🆘 Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running
- Check Services app on Windows
- Or use MongoDB Atlas (cloud)

### "Port 5000 already in use"
```powershell
# Kill the process
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### "Cannot GET /"
- This is normal! Backend is working
- Just make sure you see "MongoDB connected"

### "Module not found"
```powershell
# Run in both folders
cd server
npm install

cd ..
npm install
```

### AI Predictions not working?
- Get OpenAI API key: https://platform.openai.com/api-keys
- Add to `server/.env`:
  ```
  OPENAI_API_KEY=sk-your-actual-key-here
  ```
- Restart backend server

---

## 📝 Quick Commands Reference

### Backend
```powershell
cd server
npm install      # Install dependencies
npm run dev      # Start development server
npm start        # Production mode
```

### Frontend
```powershell
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎉 You're All Set!

Both servers should now be running:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000

Happy Trading! 📈🚀

---

## Need More Help?

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **GETTING_STARTED.md** - Feature tour
- **PROJECT_SUMMARY.md** - Technical overview