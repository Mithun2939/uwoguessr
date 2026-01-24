import { Target, Trophy, MapPin } from 'lucide-react'

interface HomeProps {
  onStartGame: () => void
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  const MAX_ROUNDS = 5
  const MAX_POINTS = MAX_ROUNDS * 5000

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto text-center mt-20">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-purple-900">Western</span>
          <span className="text-gray-700">Guessr</span>
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Can you identify these spots around Western's campus?
        </p>
        
        <button
          onClick={onStartGame}
          className="bg-purple-900 text-white px-12 py-4 rounded-lg font-semibold hover:bg-purple-800 transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Daily Challenge
        </button>

        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-lg shadow">
            <Target className="mx-auto mb-2 text-purple-900" size={32} />
            <p className="font-bold text-2xl text-purple-900">{MAX_ROUNDS}</p>
            <p className="text-gray-600 text-sm">Rounds</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Trophy className="mx-auto mb-2 text-purple-900" size={32} />
            <p className="font-bold text-2xl text-purple-900">{MAX_POINTS.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Max Points</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <MapPin className="mx-auto mb-2 text-purple-900" size={32} />
            <p className="font-bold text-2xl text-purple-900">Daily</p>
            <p className="text-gray-600 text-sm">Challenge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
