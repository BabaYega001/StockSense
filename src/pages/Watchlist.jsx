import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entities } from '../api/apiClient';
import { Eye, Plus, Trash2 } from 'lucide-react';

function Watchlist() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newStock, setNewStock] = useState({
    stock_symbol: '',
    company_name: '',
    added_price: ''
  });

  const { data: watchlist } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => entities.Watchlist.list().then(res => res.data),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 15000
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Watchlist.create(data),
    onSuccess: (res) => {
      const newItem = res.data;
      queryClient.setQueryData(['watchlist'], (old) => {
        if (Array.isArray(old)) {
          return [newItem, ...old];
        }
        return [newItem];
      });
      queryClient.invalidateQueries(['watchlist']);
      setShowModal(false);
      setNewStock({ stock_symbol: '', company_name: '', added_price: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Watchlist.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    }
  });

  const handleAddStock = () => {
    createMutation.mutate({
      ...newStock,
      added_price: parseFloat(newStock.added_price) || null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Watchlist</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Stock
        </button>
      </div>

      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add to Watchlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Symbol</label>
                <input
                  type="text"
                  value={newStock.stock_symbol}
                  onChange={(e) => setNewStock({ ...newStock, stock_symbol: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={newStock.company_name}
                  onChange={(e) => setNewStock({ ...newStock, company_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Added Price (Optional)</label>
                <input
                  type="number"
                  value={newStock.added_price}
                  onChange={(e) => setNewStock({ ...newStock, added_price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  disabled={createMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-600 text-sm">
                <th className="pb-3">Symbol</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Added Price</th>
                <th className="pb-3">Current Price</th>
                <th className="pb-3">Change</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist?.map((item) => (
                <tr key={item._id} className="border-b text-sm">
                  <td className="py-3 font-medium">{item.stock_symbol}</td>
                  <td className="py-3 text-gray-600">{item.company_name}</td>
                  <td className="py-3">
                    {item.added_price ? `$${item.added_price.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3">
                    {item.current_price ? `$${item.current_price.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3">
                    {item.current_price && item.added_price ? (
                      <span className={item.current_price >= item.added_price ? 'text-green-600' : 'text-red-600'}>
                        {item.current_price >= item.added_price ? '+' : ''}
                        {((item.current_price - item.added_price) / item.added_price * 100).toFixed(2)}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteMutation.mutate(item._id)}
                      disabled={deleteMutation.isLoading}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!watchlist || watchlist.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>No stocks in your watchlist yet. Add stocks to track!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
