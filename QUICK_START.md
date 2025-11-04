# ⚡ Quick Start Guide

## 🎯 Already Done ✓
- ✅ All files created
- ✅ Dependencies installed
- ✅ Environment files configured

## 🚀 Run in 3 Steps

### 1️⃣ Install MongoDB
**Option A - Download:**
- https://www.mongodb.com/try/download/community
- Install Windows version
- Done!

**Option B - Cloud (Free):**
- https://www.mongodb.com/cloud/atlas/register
- Create account + cluster
- Get connection string
- Update `server/.env` with connection string

### 2️⃣ Start Backend
```bash
cd server
npm run dev
```

✓ Wait for: "MongoDB connected"
✓ Keep terminal open!

### 3️⃣ Start Frontend
Open **NEW** terminal:
```bash
npm run dev
```

✓ Wait for: "http://localhost:3000"

## 🎉 Open Browser
Go to: **http://localhost:3000**

---

## 📋 Command Cheat Sheet

```bash
# Start Backend
cd server
npm run dev

# Start Frontend (new terminal)
cd "C:\Users\LENOVO\Desktop\Projects\Project 1\Trial 3"
npm run dev

# Or restart everything
cd server
npm run dev    # Terminal 1

npm run dev    # Terminal 2 (root folder)
```

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| MongoDB error | Install MongoDB or use Atlas |
| Port 5000 in use | `taskkill /PID <id> /F` |
| Module not found | `npm install` in both folders |
| Backend not starting | Check MongoDB is running |

---

## 📁 Important Files

```
Trial 3/
├── server/.env          ← Backend config (created ✓)
├── .env                 ← Frontend config (created ✓)
├── START_HERE.txt       ← Quick reference
├── RUN_ME.md           ← Detailed steps
└── README.md           ← Full docs
```

---

## 🎓 Next Steps

1. Read **START_HERE.txt** for overview
2. Read **RUN_ME.md** for detailed steps
3. Read **GETTING_STARTED.md** for app tour
4. Start trading! 📈

---

**Both servers must run at the same time!**

Backend:  http://localhost:5000
Frontend: http://localhost:3000
