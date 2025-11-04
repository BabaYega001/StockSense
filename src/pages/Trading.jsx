import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities, market, auth } from '../api/apiClient';
import { Search, TrendingUp } from 'lucide-react';

function Trading() {
  const queryClient = useQueryClient();
  const [searchSymbol, setSearchSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');

  const { data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: () => entities.Trade.list().then(res => res.data)
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => auth.me().then(res => res.data),
    staleTime: 10000
  });

  const { data: quote, refetch: refetchQuote, isFetching: quoteLoading } = useQuery({
    queryKey: ['quote', searchSymbol.toUpperCase()],
    queryFn: () => market.quote(searchSymbol.toUpperCase()),
    enabled: !!searchSymbol
  });

  const { data: suggestions } = useQuery({
    queryKey: ['search', searchSymbol],
    queryFn: () => market.search(searchSymbol),
    enabled: searchSymbol.length >= 2,
    staleTime: 60000
  });

  const tradeMutation = useMutation({
    mutationFn: (data) => entities.Trade.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['trades']);
      queryClient.invalidateQueries(['portfolio']);
      queryClient.invalidateQueries(['user']);
      setQuantity('');
    }
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchSymbol) return;
    await refetchQuote();
  };

  const handleTrade = (type) => {
    if (!searchSymbol || !quantity || !quote || quote.fallback) {
      alert('Please select a stock and enter quantity');
      return;
    }

    tradeMutation.mutate({
      stock_symbol: searchSymbol.toUpperCase(),
      company_name: quote.company_name || searchSymbol.toUpperCase(),
      trade_type: type,
      quantity: parseInt(quantity),
      price: Number(quote.price),
      order_type: orderType
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Virtual Trading</h1>
        <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm border border-green-200">
          Balance: ${user?.virtual_balance?.toFixed(2)}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search and select symbol (e.g., AAPL, TSLA, GOOGL)"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
              {(searchSymbol.length >= 2) && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-64 overflow-auto">
                  {(!suggestions && searchSymbol.length >= 2) && (
                    <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
                  )}
                  {(suggestions && suggestions.length === 0) && (
                    <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                  )}
                  {(suggestions && suggestions.length > 0) && suggestions.map((s) => (
                    <button
                      key={s.symbol}
                      type="button"
                      onClick={async () => { setSearchSymbol(s.symbol); await refetchQuote(); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      <div className="font-medium">{s.symbol}</div>
                      <div className="text-xs text-gray-500">{s.name}{s.exchange ? ` • ${s.exchange}` : ''}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Quote
          </button>
        </form>
      </div>

      {/* Trade Panel */}
      {searchSymbol && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Place Order</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol
              </label>
              <input
                type="text"
                value={searchSymbol.toUpperCase()}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{quote?.company_name || '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="font-medium">{quoteLoading ? 'Loading...' : (quote ? `$${Number(quote.price).toFixed(2)}` : '-')}</p>
                {quote?.fallback && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">mock</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleTrade('buy')}
                disabled={tradeMutation.isLoading || !quote || quote.fallback}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Buy
              </button>
              <button
                onClick={() => handleTrade('sell')}
                disabled={tradeMutation.isLoading || !quote || quote.fallback}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Trade History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-600 text-sm">
                <th className="pb-3">Symbol</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades?.map((trade) => (
                <tr key={trade._id} className="border-b text-sm">
                  <td className="py-3 font-medium">{trade.stock_symbol}</td>
                  <td className={`py-3 ${trade.trade_type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.trade_type.toUpperCase()}
                  </td>
                  <td className="py-3">{trade.quantity}</td>
                  <td className="py-3">${trade.price.toFixed(2)}</td>
                  <td className="py-3">${trade.total_amount.toFixed(2)}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(trade.trade_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Trading;
