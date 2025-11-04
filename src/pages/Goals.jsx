import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entities } from '../api/apiClient';
import { Target, Plus, TrendingUp } from 'lucide-react';

function Goals() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    target_date: '',
    goal_type: 'other'
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => entities.Goal.list().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Goal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      setShowModal(false);
      setNewGoal({ title: '', target_amount: '', target_date: '', goal_type: 'other' });
    }
  });

  const handleCreateGoal = () => {
    createMutation.mutate({
      ...newGoal,
      target_amount: parseFloat(newGoal.target_amount),
      target_date: new Date(newGoal.target_date)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Goals</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Goal
        </button>
      </div>

      {/* Create Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                <select
                  value={newGoal.goal_type}
                  onChange={(e) => setNewGoal({ ...newGoal, goal_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="retirement">Retirement</option>
                  <option value="house">House</option>
                  <option value="education">Education</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="wealth">Wealth Building</option>
                  <option value="vacation">Vacation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={createMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals?.map((goal) => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          const isActive = goal.status === 'active';
          
          return (
            <div key={goal._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className={`h-8 w-8 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{goal.goal_type}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% complete</p>
              </div>

              <div className="text-xs text-gray-500">
                Target: {new Date(goal.target_date).toLocaleDateString()}
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  goal.status === 'active' ? 'bg-green-100 text-green-700' :
                  goal.status === 'achieved' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {goal.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {(!goals || goals.length === 0) && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p>No goals yet. Create your first investment goal!</p>
        </div>
      )}
    </div>
  );
}

export default Goals;
