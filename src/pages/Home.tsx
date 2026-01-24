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
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Grid background — extends into padding so it spans the whole area */}
      <div
        className="absolute -inset-4 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />
      {/* Soft overlay to blend grid — same extent as grid */}
      <div
        className="absolute -inset-4 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 30% 30%, rgba(147, 51, 234, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 70% 70%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />
      {/* Decorative pins — placed in margins so they don't block title, buttons, or cards */}
      <MapPin className="absolute left-[4%] top-[7%] w-6 h-6 text-purple-400/45 pointer-events-none" aria-hidden="true" />
      <MapPin className="absolute right-[5%] top-[10%] w-7 h-7 text-purple-500/40 pointer-events-none" aria-hidden="true" />
      <MapPin className="absolute left-[5%] bottom-[12%] w-5 h-5 text-pink-400/40 pointer-events-none" aria-hidden="true" />
      <MapPin className="absolute right-[4%] bottom-[15%] w-6 h-6 text-purple-400/45 pointer-events-none" aria-hidden="true" />
      <MapPin className="absolute left-[2%] top-[48%] -translate-y-1/2 w-5 h-5 text-purple-400/35 pointer-events-none" aria-hidden="true" />
      <MapPin className="absolute right-[2%] top-[52%] -translate-y-1/2 w-5 h-5 text-pink-400/35 pointer-events-none" aria-hidden="true" />

      <div className="max-w-2xl mx-auto text-center mt-20 relative z-10">
        <h1 className="text-8xl sm:text-9xl font-extrabold mb-8 tracking-tight">
          <span className="text-purple-900">Uwo</span>
          <span className="text-slate-800">Guessr</span>
        </h1>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => onStartGame('daily')}
            className="w-full max-w-[300px] bg-purple-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-purple-800 transition-all duration-200 text-base shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => onStartGame('classic')}
            className="w-full max-w-[240px] bg-transparent text-slate-600 border-2 border-purple-900/70 px-6 py-2 rounded-2xl font-semibold hover:border-purple-900 hover:text-slate-800 hover:bg-purple-50/20 transition-all duration-200 text-sm"
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
