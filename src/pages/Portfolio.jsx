import { useQuery } from '@tanstack/react-query';
import { entities } from '../api/apiClient';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Portfolio() {
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => entities.Portfolio.list().then(res => res.data)
  });

  const totalValue = portfolio?.reduce((sum, pos) => sum + (pos.current_value || pos.total_invested), 0) || 0;
  const totalInvested = portfolio?.reduce((sum, pos) => sum + pos.total_invested, 0) || 0;
  const totalPnL = portfolio?.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0) || 0;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Portfolio</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">${totalValue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Invested</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">${totalInvested.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Unrealized P&L</p>
          <div className="flex items-center gap-2 mt-1">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
            <div>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toFixed(2)}
              </p>
              <p className={`text-sm ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnLPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Positions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-600 text-sm">
                <th className="pb-3">Symbol</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Avg Price</th>
                <th className="pb-3">Current Value</th>
                <th className="pb-3">P&L</th>
                <th className="pb-3">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {portfolio?.map((position) => {
                const pnl = position.unrealized_pnl || 0;
                const pnlPercent = position.unrealized_pnl_percentage || 0;
                return (
                  <tr key={position._id} className="border-b text-sm">
                    <td className="py-3 font-medium">{position.stock_symbol}</td>
                    <td className="py-3 text-gray-600">{position.company_name}</td>
                    <td className="py-3">{position.quantity}</td>
                    <td className="py-3">${position.average_price.toFixed(2)}</td>
                    <td className="py-3">
                      ${(position.current_value || position.total_invested).toFixed(2)}
                    </td>
                    <td className={`py-3 font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${pnl.toFixed(2)}
                    </td>
                    <td className={`py-3 font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!portfolio || portfolio.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No positions yet. Start trading to build your portfolio!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
