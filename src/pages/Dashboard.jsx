import { useQuery } from '@tanstack/react-query';
import { entities } from '../api/apiClient';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

function Dashboard() {
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => entities.Portfolio.list().then(res => res.data)
  });

  const { data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: () => entities.Trade.list().then(res => res.data)
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => entities.Goal.list().then(res => res.data)
  });

  const totalValue = portfolio?.reduce((sum, pos) => sum + (pos.current_value || pos.total_invested), 0) || 0;
  const totalPnL = portfolio?.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0) || 0;
  const activeGoals = goals?.filter(g => g.status === 'active').length || 0;
  const recentTrades = trades?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <Wallet className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold mt-1 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toFixed(2)}
              </p>
            </div>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-10 w-10 text-green-500" />
            ) : (
              <TrendingDown className="h-10 w-10 text-red-500" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Positions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{portfolio?.length || 0}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Goals</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{activeGoals}</p>
            </div>
            <Target className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Trades</h2>
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
              {recentTrades.map((trade) => (
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

export default Dashboard;
