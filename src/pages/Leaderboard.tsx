import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { getLeaderboard } from '../services/leaderboardService'
import type { LeaderboardEntry } from '../types/database'

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all-time'>('all-time')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [period])

  const loadLeaderboard = async () => {
    setLoading(true)
    const data = await getLeaderboard(period)
    setEntries(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Trophy className="text-yellow-500" size={36} />
          Leaderboard
        </h2>

        {/* Period selector */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'daily'
                ? 'bg-purple-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'weekly'
                ? 'bg-purple-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'all-time'
                ? 'bg-purple-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Time
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-lg">No scores yet!</p>
              <p className="text-sm">Be the first to play and set a record.</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div 
                key={entry.id}
                className={`flex justify-between items-center p-4 border-b last:border-b-0 ${
                  index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold ${
                    index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{entry.player_name}</span>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-purple-900">{entry.score.toLocaleString()} pts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
