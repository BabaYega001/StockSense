# Getting Started with StockSense AI

Welcome to StockSense AI! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - See SETUP.md for installation
- **Git** (optional) - [Download](https://git-scm.com/)
- **Text Editor** (VS Code recommended)

## Quick Start (5 Minutes)

### Step 1: Clone or Extract Project
```bash
cd "path/to/project"
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Configure Backend
Create `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/stocksense
JWT_SECRET=my-secret-key-123
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

### Step 4: Start MongoDB
**Windows:** MongoDB should start automatically after installation
**macOS:** `brew services start mongodb-community`
**Linux:** `sudo systemctl start mongodb`

### Step 5: Start Backend
```bash
cd server
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB connected`

### Step 6: Install Frontend Dependencies
Open a NEW terminal window:
```bash
cd "path/to/project"
npm install
```

### Step 7: Configure Frontend
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 8: Start Frontend
```bash
npm run dev
```
You should see: `VITE ready at http://localhost:3000`

### Step 9: Open Browser
Navigate to: **http://localhost:3000**

## First Login

1. Click "Register" or go to `/register`
2. Enter your details:
   - Email
   - Password
   - Full Name
3. Click "Register"
4. You'll be automatically logged in

## Exploring the Platform

### 1. Dashboard (`/dashboard`)
- View your portfolio overview
- Check total P&L
- See recent trades
- Monitor active positions

### 2. Trading (`/trading`)
- Search for stocks
- Place buy/sell orders
- View trade history
- Track your transactions

### 3. Portfolio (`/portfolio`)
- See all holdings
- Check individual P&L
- Monitor position performance
- View allocation

### 4. Goals (`/goals`)
- Create investment goals
- Set target amounts
- Track progress
- Monitor deadlines

### 5. Watchlist (`/watchlist`)
- Add stocks to watch
- Monitor price changes
- Set alerts
- Track favorites

### 6. Predictions (`/predictions`)
- Get AI analysis
- View price predictions
- Read recommendations
- Check confidence scores

### 7. Profile (`/profile`)
- Update your profile
- Change risk profile
- View stats
- Manage settings

## Making Your First Trade

1. Go to **Trading** page
2. Search for a stock (e.g., "AAPL")
3. Enter quantity (e.g., "10")
4. Click **Buy** or **Sell**
5. Check **Portfolio** to see your position

## Getting AI Predictions

1. Go to **Predictions** page
2. Enter stock symbol
3. Click **Analyze**
4. View AI-generated insights:
   - Price predictions (1d, 7d, 30d)
   - Buy/sell recommendations
   - Confidence scores
   - Risk assessment

## Understanding the UI

### Color Coding
- 🟢 **Green**: Positive values, gains, buy orders
- 🔴 **Red**: Negative values, losses, sell orders
- 🔵 **Blue**: Navigation, primary actions
- ⚠️ **Yellow/Orange**: Warnings, moderate risk

### Key Metrics
- **Portfolio Value**: Total worth of all holdings
- **P&L**: Profit and Loss (unrealized)
- **Current Price**: Latest stock price
- **Avg Price**: Average purchase price
- **Quantity**: Number of shares owned

## Common Actions

### Adding a Stock to Watchlist
1. Go to Watchlist
2. Click "Add Stock"
3. Enter symbol and name
4. Click "Add"

### Creating a Goal
1. Go to Goals
2. Click "Create Goal"
3. Fill in details:
   - Title (e.g., "Retirement Fund")
   - Target Amount (e.g., 100000)
   - Target Date
   - Goal Type
4. Click "Create"

### Getting Stock Analysis
1. Go to Predictions
2. Enter stock symbol
3. Click "Analyze"
4. Wait for AI response
5. Review insights

## Tips for Success

1. **Start Small**: Test with small quantities
2. **Diversify**: Don't put all money in one stock
3. **Set Goals**: Use goal tracking feature
4. **Monitor**: Check watchlist regularly
5. **Analyze**: Use AI predictions wisely
6. **Learn**: Review your trade history

## What's Virtual?

Remember: This is a **virtual trading platform**!
- ✅ Virtual money ($10,000 starting balance)
- ✅ Virtual stocks
- ✅ Virtual trades
- ❌ No real money involved
- ❌ No real transactions
- ❌ Educational purposes only

## Troubleshooting

### Can't Login
- Check backend is running
- Verify MongoDB is connected
- Clear browser cache
- Try registering again

### Trades Not Working
- Ensure backend is running
- Check browser console for errors
- Verify API connection
- Check sufficient balance

### AI Not Working
- Verify OpenAI API key in `server/.env`
- Check API key balance
- Wait a moment and retry
- Check terminal for errors

### Page Won't Load
- Check both servers are running
- Verify correct ports (3000 frontend, 5000 backend)
- Clear browser cache
- Restart servers

## Next Steps

1. ✅ Complete setup (follow SETUP.md)
2. ✅ Register and login
3. ✅ Make first trade
4. ✅ Create a goal
5. ✅ Add stocks to watchlist
6. ✅ Try AI predictions
7. 📚 Read README.md for more details
8. 🔧 Customize and extend features

## Need Help?

- 📖 Check README.md for detailed docs
- ⚙️ See SETUP.md for configuration
- 🔍 Search terminal for error messages
- 🐛 Check browser console (F12)
- 💬 Open GitHub issue for bugs

## Advanced Features to Try

1. **Portfolio Analysis**: Check performance charts
2. **Goal Progress**: Track achievement percentage
3. **Trade History**: Review past transactions
4. **Risk Profile**: Update in settings
5. **AI Insights**: Get detailed predictions

Happy Trading! 📈🚀
