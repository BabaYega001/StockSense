import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entities, InvokeLLM } from '../api/apiClient';
import { Brain, Zap, X } from 'lucide-react';

function Predictions() {
  const queryClient = useQueryClient();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: predictions } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => entities.Prediction.list().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Prediction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['predictions']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Prediction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['predictions']);
    }
  });

  const handleAnalyze = async () => {
    if (!stockSymbol) {
      alert('Please enter a stock symbol');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze the stock ${stockSymbol.toUpperCase()} and provide:
        1. Current price estimate
        2. Predicted price for 1 day, 7 days, and 30 days
        3. Recommendation: strong_buy, buy, hold, sell, or strong_sell
        4. Confidence score (0-100)
        5. Risk level: low, medium, or high
        6. Brief reasoning`,
        response_json_schema: {
          type: 'object',
          properties: {
            current_price: { type: 'number' },
            predicted_price_1d: { type: 'number' },
            predicted_price_7d: { type: 'number' },
            predicted_price_30d: { type: 'number' },
            recommendation: { type: 'string' },
            confidence_score: { type: 'number' },
            risk_level: { type: 'string' },
            reasoning: { type: 'string' }
          }
        }
      });

      // Check if AI service is not configured
      if (response.response && typeof response.response === 'string' && response.response.includes('AI service not configured')) {
        alert('AI Predictions require OpenAI API key. Please configure it in server/.env file. For now, AI features are disabled.');
        return;
      }

      const predictionData = JSON.parse(response.response);
      
      createMutation.mutate({
        stock_symbol: stockSymbol.toUpperCase(),
        company_name: stockSymbol.toUpperCase(),
        current_price: predictionData.current_price || 100,
        predicted_price_1d: predictionData.predicted_price_1d,
        predicted_price_7d: predictionData.predicted_price_7d,
        predicted_price_30d: predictionData.predicted_price_30d,
        recommendation: predictionData.recommendation || 'hold',
        confidence_score: predictionData.confidence_score || 50,
        risk_level: predictionData.risk_level || 'medium',
        reasoning: predictionData.reasoning
      });

      setStockSymbol('');
    } catch (error) {
      console.error('AI Analysis error:', error);
      if (error.response?.status === 503) {
        alert('AI service is not configured. Add OPENAI_API_KEY to server/.env file to enable AI predictions.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to analyze stock. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendationColor = (rec) => {
    const colors = {
      strong_buy: 'bg-green-600',
      buy: 'bg-green-500',
      hold: 'bg-yellow-500',
      sell: 'bg-orange-500',
      strong_sell: 'bg-red-600'
    };
    return colors[rec] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">AI Predictions</h1>

      {/* Analyze Stock */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Analyze Stock with AI</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            <Zap className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions?.map((prediction) => (
          <div key={prediction._id} className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => deleteMutation.mutate(prediction._id)}
              title="Remove"
              aria-label="Remove prediction"
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-purple-500" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{prediction.stock_symbol}</h3>
                <p className="text-sm text-gray-500">{prediction.company_name}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Current Price</span>
                <span className="font-medium">${prediction.current_price.toFixed(2)}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">1 Day</span>
                  <span className="font-medium">
                    {prediction.predicted_price_1d ? `$${prediction.predicted_price_1d.toFixed(2)}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7 Days</span>
                  <span className="font-medium">
                    {prediction.predicted_price_7d ? `$${prediction.predicted_price_7d.toFixed(2)}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">30 Days</span>
                  <span className="font-medium">
                    {prediction.predicted_price_30d ? `$${prediction.predicted_price_30d.toFixed(2)}` : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded text-xs font-medium text-white ${getRecommendationColor(prediction.recommendation)}`}>
                  {prediction.recommendation.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {prediction.confidence_score}% confidence
                </span>
              </div>
              <p className="text-xs text-gray-600 capitalize">
                Risk: {prediction.risk_level}
              </p>
            </div>

            {prediction.reasoning && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">{prediction.reasoning}</p>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              {new Date(prediction.created_date).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {(!predictions || predictions.length === 0) && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p>No predictions yet. Analyze a stock to get AI-powered insights!</p>
        </div>
      )}
    </div>
  );
}

export default Predictions;
