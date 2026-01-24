import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Leaderboard } from './pages/Leaderboard'
import { Contribute } from './pages/Contribute'
import { About } from './pages/About'

type View = 'home' | 'game' | 'leaderboard' | 'contribute' | 'about' | 'results'

type GameMode = 'daily' | 'classic'

function App() {
  const [view, setView] = useState<View>('home')
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [gameMode, setGameMode] = useState<GameMode>('daily')

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode)
    setView('game')
    setFinalScore(null)
  }

  const handleGameComplete = (score: number) => {
    setFinalScore(score)
    setView('results')
  }

  const handleExitGame = () => {
    setView('home')
    setFinalScore(null)
  }

  const handleNavigate = (newView: string) => {
    if (newView !== 'game' && newView !== 'results') setView(newView as View)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/70 to-pink-50/80">
      {view !== 'game' && view !== 'results' && (
        <Navbar currentView={view} onNavigate={handleNavigate} />
      )}

      {view === 'home' && <Home onStartGame={handleStartGame} />}
      {view === 'game' && (
        <Game mode={gameMode} onComplete={handleGameComplete} onExit={handleExitGame} />
      )}
      {view === 'leaderboard' && <Leaderboard />}
      {view === 'contribute' && <Contribute />}
      {view === 'about' && <About />}
      {view === 'results' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/70 to-pink-50/80 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-slate-200/50 max-w-md w-full text-center border border-slate-100">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Game Complete!</h2>
            {finalScore !== null && (
              <>
                <p className="text-5xl font-bold text-purple-900 mb-2">{finalScore.toLocaleString()}</p>
                <p className="text-slate-600 mb-8">Total Points</p>
              </>
            )}
            
            {gameMode === 'classic' && (
              <button
                onClick={() => setView('game')}
                className="bg-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full mb-3 shadow-lg shadow-purple-900/20"
              >
                Play Again
              </button>
            )}
            <button
              onClick={() => setView('home')}
              className="bg-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full mb-3 shadow-lg shadow-purple-900/20"
            >
              Back to Home
            </button>
            <button
              onClick={() => setView('leaderboard')}
              className="text-purple-900 hover:text-purple-700 font-medium transition-all duration-200 hover:underline"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
