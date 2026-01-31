import { useState, useEffect } from 'react'
import { Target, Trophy, MapPin, X, Lock } from 'lucide-react'
import { getTodayLocalDate } from '../services/leaderboardService'

type GameMode = 'daily' | 'classic'

interface HomeProps {
  onStartGame: (mode: GameMode) => void
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [dailyLocked, setDailyLocked] = useState(false)
  const MAX_ROUNDS = 5
  const MAX_POINTS = MAX_ROUNDS * 5000

  const handlePlayDaily = () => {
    setShowHowToPlay(false)
    if (!dailyLocked) onStartGame('daily')
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHowToPlay(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    // Anonymous play: best-effort lock via localStorage for this browser/device
    const completed = localStorage.getItem('uwoguessr_daily_completed_date')
    const today = getTodayLocalDate()
    setDailyLocked(completed === today)
  }, [])

  return (
    <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden overflow-y-auto scrollbar-hide min-h-0">
      {/* Grid background */}
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

      <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto w-full text-center py-4 lg:py-6 relative z-10 px-2 sm:px-4 lg:px-8">
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[9.5rem] font-extrabold mb-6 sm:mb-8 lg:mb-10 tracking-tight">
          <span className="text-purple-900">Uwo</span>
          <span className="text-slate-800">Guessr</span>
        </h1>

        <div className="flex flex-col items-center gap-3 lg:gap-4">
          {dailyLocked && (
            <div className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[420px] xl:max-w-[480px] bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-1">
              <div className="flex items-center gap-2 text-yellow-800">
                <Lock size={20} />
                <p className="text-sm font-semibold">You&apos;ve already completed today&apos;s challenge!</p>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Come back tomorrow for a new set.</p>
            </div>
          )}
          <button
            onClick={handlePlayDaily}
            disabled={dailyLocked}
            className={`w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[420px] xl:max-w-[480px] px-6 sm:px-8 lg:px-12 lg:py-4 py-2.5 sm:py-3 rounded-2xl font-bold transition-all duration-200 text-sm sm:text-base lg:text-lg shadow-lg ${
              dailyLocked
                ? 'bg-slate-400 text-white cursor-not-allowed shadow-slate-400/20'
                : 'bg-purple-900 text-white hover:bg-purple-800 shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {dailyLocked ? 'Come back tomorrow' : 'Daily Challenge'}
          </button>
          <button
            onClick={() => onStartGame('classic')}
            className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] bg-transparent text-slate-600 border-2 border-purple-900/70 px-5 sm:px-6 lg:px-8 lg:py-2.5 py-1.5 sm:py-2 rounded-2xl font-semibold hover:border-purple-900 hover:text-slate-800 hover:bg-purple-50/20 transition-all duration-200 text-sm lg:text-base"
          >
            Play Classic
          </button>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-slate-500 hover:text-purple-700 font-medium text-sm lg:text-base transition-all duration-200 underline underline-offset-2 decoration-slate-400/60 hover:decoration-purple-500"
          >
            How to Play
          </button>
        </div>

        <div className="mt-10 sm:mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default">
            <Target className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={40} />
            <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-purple-900">{MAX_ROUNDS}</p>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base">Rounds</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default">
            <Trophy className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={40} />
            <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-purple-900">{MAX_POINTS.toLocaleString()}</p>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base">Max Points</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-900/10 hover:border-purple-200/60 cursor-default col-span-2 sm:col-span-1">
            <MapPin className="mx-auto mb-2 text-purple-900 transition-transform duration-300 hover:scale-110" size={40} />
            <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-purple-900">Daily</p>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base">Challenge</p>
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
