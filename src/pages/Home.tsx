import { useState, useEffect } from 'react'
import { Target, Trophy, MapPin, X } from 'lucide-react'

type GameMode = 'daily' | 'classic'

interface HomeProps {
  onStartGame: (mode: GameMode) => void
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const MAX_ROUNDS = 5
  const MAX_POINTS = MAX_ROUNDS * 5000

  const handlePlayDaily = () => {
    setShowHowToPlay(false)
    onStartGame('daily')
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHowToPlay(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/70 to-pink-50/80 p-4 relative overflow-hidden">
      {/* Map-style grid + soft blurs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 30% 30%, rgba(147, 51, 234, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 70% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 50%)
          `,
        }}
      />
      {/* Animated soft blobs */}
      <div className="absolute top-[5%] right-[10%] w-80 h-80 rounded-full bg-purple-300/20 pointer-events-none animate-blob-float blur-3xl" />
      <div className="absolute bottom-[15%] left-[5%] w-72 h-72 rounded-full bg-pink-300/15 pointer-events-none animate-blob-float-slow blur-3xl" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-200/10 pointer-events-none animate-blob-float blur-3xl" />
      {/* Scattered map-pin watermarks */}
      <MapPin className="absolute top-[12%] left-[8%] w-14 h-14 text-slate-400/25 pointer-events-none animate-pin-pulse" strokeWidth={1.5} />
      <MapPin className="absolute top-[55%] right-[10%] w-16 h-16 text-slate-400/22 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute bottom-[20%] left-[15%] w-12 h-12 text-purple-400/25 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[35%] right-[22%] w-10 h-10 text-slate-400/20 pointer-events-none animate-pin-pulse" strokeWidth={1.5} />
      <MapPin className="absolute top-[70%] left-[25%] w-11 h-11 text-pink-400/20 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[22%] right-[35%] w-9 h-9 text-slate-400/24 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute bottom-[35%] right-[18%] w-13 h-13 text-purple-400/18 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[80%] right-[30%] w-8 h-8 text-pink-300/20 pointer-events-none" strokeWidth={1.5} />
      <MapPin className="absolute top-[8%] right-[50%] w-10 h-10 text-slate-300/22 pointer-events-none" strokeWidth={1.5} />

      <div className="max-w-2xl mx-auto text-center mt-20 relative z-10">
        <h1 className="text-6xl font-extrabold mb-10 tracking-tight">
          <span className="text-purple-900">Uwo</span>
          <span className="text-slate-800">Guessr</span>
        </h1>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => onStartGame('daily')}
            className="w-full max-w-sm bg-purple-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-purple-800 transition-all duration-200 text-lg shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => onStartGame('classic')}
            className="w-full max-w-[280px] bg-transparent text-slate-600 border-2 border-purple-900/70 px-8 py-2.5 rounded-2xl font-semibold hover:border-purple-900 hover:text-slate-800 hover:bg-purple-50/20 transition-all duration-200 text-base"
          >
            Play Classic
          </button>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-slate-500 hover:text-purple-700 font-medium text-sm transition-all duration-200 underline underline-offset-2 decoration-slate-400/60 hover:decoration-purple-500"
          >
            How to Play
          </button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default">
            <Target className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={32} />
            <p className="font-bold text-2xl text-purple-900">{MAX_ROUNDS}</p>
            <p className="text-slate-600 text-sm">Rounds</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default">
            <Trophy className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={32} />
            <p className="font-bold text-2xl text-purple-900">{MAX_POINTS.toLocaleString()}</p>
            <p className="text-slate-600 text-sm">Max Points</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default">
            <MapPin className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={32} />
            <p className="font-bold text-2xl text-purple-900">Daily</p>
            <p className="text-slate-600 text-sm">Challenge</p>
          </div>
        </div>
      </div>

      {/* How to Play modal */}
      {showHowToPlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowHowToPlay(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">How to Play</h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-relaxed mb-8">
              <li>You will be shown an image from the <strong>Western University campus</strong>.</li>
              <li>Click where you think the photo was taken on the map.</li>
              <li>Hit <strong>Submit Guess</strong> to lock it in.</li>
              <li>Earn points based on accuracy.</li>
              <li>Play through <strong>5 locations</strong> and try to set a high score!</li>
            </ol>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handlePlayDaily}
                className="flex-1 py-3 rounded-xl font-semibold bg-purple-900 text-white hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-900/20"
              >
                Play the daily challenge!
              </button>
            </div>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 hover:scale-110 transition-all duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
