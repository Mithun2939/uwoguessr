import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Leaderboard } from './pages/Leaderboard'
import { Contribute } from './pages/Contribute'
import { About } from './pages/About'

type View = 'home' | 'game' | 'leaderboard' | 'contribute' | 'about' | 'results'

function App() {
  const [view, setView] = useState<View>('home')
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const handleStartGame = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {view !== 'game' && view !== 'results' && (
        <Navbar currentView={view} onNavigate={handleNavigate} />
      )}

      {view === 'home' && <Home onStartGame={handleStartGame} />}
      {view === 'game' && (
        <Game onComplete={handleGameComplete} onExit={handleExitGame} />
      )}
      {view === 'leaderboard' && <Leaderboard />}
      {view === 'contribute' && <Contribute />}
      {view === 'about' && <About />}
      {view === 'results' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
            {finalScore !== null && (
              <>
                <p className="text-5xl font-bold text-purple-900 mb-2">{finalScore.toLocaleString()}</p>
                <p className="text-gray-600 mb-8">Total Points</p>
              </>
            )}
            
            <button
              onClick={() => setView('home')}
              className="bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition w-full mb-3"
            >
              Back to Home
            </button>
            
            <button
              onClick={() => setView('leaderboard')}
              className="text-purple-900 hover:text-purple-700 font-medium"
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
