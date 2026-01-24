import { Target, Trophy, MapPin } from 'lucide-react'

interface HomeProps {
  onStartGame: () => void
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  const MAX_ROUNDS = 5
  const MAX_POINTS = MAX_ROUNDS * 5000

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Subtle background: grid + soft blurs + map-pin watermarks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(147, 51, 234, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(236, 72, 153, 0.06) 0%, transparent 50%)
          `,
        }}
      />
      <MapPin className="absolute top-[18%] left-[12%] w-16 h-16 text-purple-400/10 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[60%] right-[15%] w-14 h-14 text-purple-500/10 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute bottom-[25%] left-[20%] w-12 h-12 text-pink-400/10 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[35%] right-[25%] w-10 h-10 text-purple-400/10 pointer-events-none" strokeWidth={1.5} />

      <div className="max-w-2xl mx-auto text-center mt-20 relative z-10">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-purple-900">Uwo</span>
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
