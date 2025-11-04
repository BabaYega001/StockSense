import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { auth } from '../api/apiClient';
import { User, Edit2 } from 'lucide-react';

function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => auth.me().then(res => res.data)
  });

  const updateMutation = useMutation({
    mutationFn: (data) => auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      setIsEditing(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setFormData({
                full_name: user.full_name,
                risk_profile: user.risk_profile,
                investment_experience: user.investment_experience
              });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="h-5 w-5" />
            Edit
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Profile</label>
              <select
                value={formData.risk_profile || ''}
                onChange={(e) => setFormData({ ...formData, risk_profile: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Experience</label>
              <select
                value={formData.investment_experience || ''}
                onChange={(e) => setFormData({ ...formData, investment_experience: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="experienced">Experienced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Risk Profile</p>
              <p className="text-lg font-semibold capitalize">{user.risk_profile}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Investment Experience</p>
              <p className="text-lg font-semibold capitalize">{user.investment_experience}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Risk Score</p>
              <p className="text-lg font-semibold">{user.risk_score}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Virtual Balance</p>
              <p className="text-lg font-semibold text-green-600">${user.virtual_balance?.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Invested</p>
              <p className="text-lg font-semibold">${user.total_invested?.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-lg font-semibold">
                {new Date(user.created_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
