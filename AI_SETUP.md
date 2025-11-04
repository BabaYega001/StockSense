# 🤖 AI Predictions Setup Guide

## ✅ Good News!
Your StockSense AI app is working! All features work except AI Predictions.

---

## 🚀 To Enable AI Predictions:

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create a free account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### Step 2: Add API Key to Backend

1. Open file: `server/.env`
2. Find the line: `OPENAI_API_KEY=sk-your-openai-api-key-here`
3. Replace with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-...your-actual-key...
   ```
4. Save the file

### Step 3: Restart Backend Server

1. Go to Terminal 1 (Backend)
2. Press `Ctrl+C` to stop the server
3. Run: `npm run dev` again
4. Wait for "Server running on port 5000"

### Step 4: Test AI Predictions

1. Go to Predictions page in your browser
2. Enter a stock symbol (e.g., "AAPL", "TSLA", "GOOGL")
3. Click "Analyze"
4. Wait for AI prediction!

---

## 💰 OpenAI Costs

**Free Tier:**
- First $5 credit when you sign up
- Enough for testing and demos

**Paid:**
- ~$0.002 per stock analysis
- Very affordable for production

---

## ⚠️ Without API Key

You can still use all other features:
- ✅ Trading stocks
- ✅ Portfolio management
- ✅ Watchlist
- ✅ Goals tracking
- ✅ Dashboard
- ✅ Trade history
- ❌ AI Predictions (requires API key)

---

## 🎯 Quick Commands

```bash
# Stop backend
Ctrl+C in Terminal 1

# Restart backend
cd server
npm run dev

# Check if API key is loaded
# Terminal should show no OpenAI errors
```

---

## 🆘 Troubleshooting

**"AI service not configured"**
- Check server/.env file has correct API key
- Restart backend server

**"Invalid API key"**
- Make sure key starts with `sk-`
- No spaces before/after key
- Key is on one line

**OpenAI errors**
- Check your OpenAI account has credits
- Verify API key is correct

---

## 🎉 You're Set!

Once configured, AI Predictions will provide:
- Price predictions (1d, 7d, 30d)
- Buy/Sell recommendations
- Confidence scores
- Risk assessment
- Detailed reasoning

**Enjoy your AI-powered stock predictions!** 🚀📈

