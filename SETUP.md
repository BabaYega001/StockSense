# Quick Setup Guide

## Initial Setup Checklist

Follow these steps in order:

### 1. Install MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and select "Complete" installation
3. MongoDB will start automatically

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
```

### 2. Set Up Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/stocksense" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
echo "OPENAI_API_KEY=sk-your-openai-api-key-here" >> .env
echo "PORT=5000" >> .env

# Start backend (in a new terminal)
npm run dev
```

### 3. Set Up Frontend

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend (in a new terminal)
npm run dev
```

### 4. Get OpenAI API Key (Optional for AI Predictions)

1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Create new API key
4. Copy and paste into `server/.env` as `OPENAI_API_KEY`

## Verify Installation

### Backend
- Open http://localhost:5000 in browser
- You should see "Cannot GET /" - this is normal
- Check terminal for "MongoDB connected" message

### Frontend
- Open http://localhost:3000 in browser
- You should see the login page or be redirected there

## First Run

1. Both servers should be running:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

2. Register a new account
3. Start trading!

## Troubleshooting

### MongoDB Connection Error
```
Solution: Make sure MongoDB is running
- Windows: Check Services app
- macOS: brew services list
- Linux: sudo systemctl status mongodb
```

### Port Already in Use
```
Solution: Change PORT in server/.env
Or kill process using that port:
- Windows: netstat -ano | findstr :5000
- macOS/Linux: lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```
Solution: Run npm install in both root and server directories
```

### OpenAI API Errors
```
Solution: Check your API key in server/.env
Note: AI features will not work without valid key
```

## Development Tips

1. Keep backend running in one terminal
2. Keep frontend running in another terminal
3. MongoDB should run as a service
4. Use `npm run dev` for hot reload in both frontend and backend
5. Check browser console for frontend errors
6. Check terminal for backend errors

## Next Steps

1. Replace mock stock prices with real API (Alpha Vantage, Yahoo Finance)
2. Add stock search functionality
3. Enhance AI predictions
4. Add more charts and visualizations
5. Implement real-time updates

## Production Deployment

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
npm run build
npm run preview
```

## Need Help?

1. Check README.md for detailed documentation
2. Review error messages in terminal
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Check all dependencies are installed
