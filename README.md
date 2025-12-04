# StockSense AI - Intelligent Stock Trading Platform

A modern, AI-powered virtual stock trading platform built with React, Node.js, and MongoDB. Trade stocks, track your portfolio, set investment goals, and get AI-powered market predictions.

## Features

-  **Virtual Trading**: Buy and sell stocks with virtual money
-  **Portfolio Tracking**: Real-time P&L analysis and position tracking
-  **Investment Goals**: Set and track financial goals
-  **Watchlist**: Monitor stocks you're interested in
-  **AI Predictions**: Get AI-powered stock analysis and predictions
-  **Dashboard**: Comprehensive overview of your trading activity
-  **Secure Auth**: JWT-based authentication

## Tech Stack

### Frontend
- React 18
- React Router
- TanStack Query
- Tailwind CSS
- Recharts
- Framer Motion
- Radix UI

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- OpenAI API Integration
- bcryptjs

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API Key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stocksense-ai
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/stocksense
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key
PORT=5000
```

### 4. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 5. Install Frontend Dependencies

In the root directory:

```bash
npm install
```

### 6. Configure Frontend

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## MongoDB Setup

### Option 1: Local MongoDB

#### macOS
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Windows
Download and install from [MongoDB Official Site](https://www.mongodb.com/try/download/community)

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in server `.env`

## Project Structure

```
stocksense-ai/
├── src/                    # Frontend source
│   ├── api/               # API client
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── server/                # Backend source
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Express server
├── package.json           # Frontend dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update user profile

### Trades
- `GET /api/trades` - Get all trades
- `POST /api/trades` - Create new trade

### Portfolio
- `GET /api/portfolio` - Get all positions
- `PATCH /api/portfolio/:id` - Update position
- `DELETE /api/portfolio/:id` - Delete position

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Watchlist
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist

### Predictions
- `GET /api/predictions` - Get predictions
- `POST /api/predictions` - Create prediction

### AI
- `POST /api/ai/invoke` - Invoke OpenAI LLM

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Trading**: Search stocks and place buy/sell orders
3. **Portfolio**: View your current positions and P&L
4. **Goals**: Set financial goals and track progress
5. **Watchlist**: Add stocks to monitor
6. **Predictions**: Get AI-powered stock analysis

## Notes

- This is a **virtual trading platform** - no real money is involved
- Stock prices are currently **mock data** - integrate Alpha Vantage or Yahoo Finance API for real-time prices
- Ensure MongoDB is running before starting the backend
- OpenAI API key is required for AI predictions feature

## Environment Variables

### Backend (.env in server/)
```
MONGODB_URI=mongodb://localhost:27017/stocksense
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
PORT=5000
```

### Frontend (.env in root/)
```
VITE_API_URL=http://localhost:5000/api
```

## Production Build

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm start
```

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
