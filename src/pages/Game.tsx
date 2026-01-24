import { useState, useEffect } from 'react'
import { MapComponent } from '../components/Map'
import { processGuess } from '../utils/gameLogic'
import { getTodayChallenge, getChallengeLocations, getRandomClassicLocations } from '../services/challengeService'
import { submitScore } from '../services/leaderboardService'
import type { Location, Guess } from '../types/database'
import { Trophy } from 'lucide-react'

type GameMode = 'daily' | 'classic'

interface GameProps {
  mode: GameMode
  onComplete: (score: number) => void
  onExit: () => void
}

const WESTERN_CENTER: [number, number] = [43.0096, -81.2737]
const MAX_ROUNDS = 5

export const Game: React.FC<GameProps> = ({ mode, onComplete, onExit }) => {
  const [round, setRound] = useState(0)
  const [locations, setLocations] = useState<Location[]>([])
  const [guessLocation, setGuessLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [currentGuess, setCurrentGuess] = useState<Guess | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    loadChallenge()
  }, [])

  const loadChallenge = async () => {
    try {
      if (mode === 'daily') {
        const challenge = await getTodayChallenge()
        if (!challenge) {
          alert('Failed to load today\'s challenge. Check: 1) .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY 2) You have 5+ locations with is_active=ON. Open browser Console (F12) for details.')
          onExit()
          return
        }
        const challengeLocations = await getChallengeLocations(challenge)
        if (challengeLocations.length < MAX_ROUNDS) {
          alert('Not enough locations. Need 5 with is_active=ON. You have ' + challengeLocations.length + '.')
          onExit()
          return
        }
        setLocations(challengeLocations)
      } else {
        const classicLocations = await getRandomClassicLocations()
        if (classicLocations.length < MAX_ROUNDS) {
          alert('Not enough locations for Classic. Need 5+ with is_active=ON.')
          onExit()
          return
        }
        setLocations(classicLocations)
      }
      setLoading(false)
    } catch (error: unknown) {
      console.error('Error loading challenge:', error)
      const msg = error instanceof Error ? error.message : String(error)
      alert('Error: ' + msg + '\n\nCheck .env and Supabase. Open Console (F12) for more.')
      onExit()
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (!showResult) {
      setGuessLocation({ lat, lng })
    }
  }

  const submitGuess = () => {
    if (!guessLocation || !locations[round]) return

    const guess = processGuess(
      guessLocation.lat,
      guessLocation.lng,
      locations[round]
    )

    setCurrentGuess(guess)
    setTotalScore(prev => prev + guess.score)
    setShowResult(true)
  }

  const nextRound = async () => {
    if (round < MAX_ROUNDS - 1) {
      setRound(prev => prev + 1)
      setGuessLocation(null)
      setCurrentGuess(null)
      setShowResult(false)
    } else {
      if (mode === 'daily') {
        setShowNameInput(true)
      } else {
        onComplete(totalScore)
      }
    }
  }

  const saveScore = async () => {
    if (!playerName.trim()) return

    const today = new Date().toISOString().split('T')[0]
    await submitScore(playerName.trim(), totalScore, today)
    onComplete(totalScore)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    )
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-slate-200/50 max-w-md w-full border border-slate-100">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
          <h2 className="text-3xl font-bold mb-2 text-center">Great Job!</h2>
          <p className="text-5xl font-bold text-purple-900 mb-6 text-center">{totalScore.toLocaleString()}</p>
          <p className="text-gray-600 mb-6 text-center">Total Points</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name for the leaderboard:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveScore()}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
              maxLength={20}
              autoFocus
            />
          </div>
          
          <button
            onClick={saveScore}
            disabled={!playerName.trim()}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 mb-3 ${
              playerName.trim()
                ? 'bg-purple-900 text-white hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-900/20 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            Save to Leaderboard
          </button>
          
          <button
            onClick={() => onComplete(totalScore)}
            className="w-full text-slate-600 hover:text-slate-800 hover:underline font-medium transition-all duration-200"
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  if (locations.length === 0 || round >= locations.length) {
    return null
  }

  const currentLocation = locations[round]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        <div className="mb-4 bg-white rounded-2xl p-3 shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Round {round + 1} / {MAX_ROUNDS}</span>
            <span className="text-sm font-semibold text-purple-900">Score: {totalScore.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-900 h-2 rounded-full transition-all"
              style={{ width: `${((round + 1) / MAX_ROUNDS) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Photo display */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 mb-4 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60">
          <div className="aspect-video bg-gray-900 relative">
            <img 
              src={currentLocation.image_url} 
              alt={currentLocation.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Campus+Photo'
              }}
            />
            {!showResult && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">Where is this on campus?</p>
              </div>
            )}
          </div>
        </div>

        {/* Map section */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60">
          <h3 className="font-bold text-lg mb-4">
            {showResult ? 'Results' : 'Drop your guess on the map'}
          </h3>
          
          <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300 mb-4">
            <MapComponent
              center={WESTERN_CENTER}
              zoom={15}
              onMapClick={handleMapClick}
              guessLocation={guessLocation}
              actualLocation={showResult ? currentLocation : null}
              showResult={showResult}
              disabled={showResult}
            />
          </div>

          {showResult && currentGuess ? (
            <div className="text-center space-y-4">
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-4xl font-bold text-purple-900 mb-2">
                  {currentGuess.score.toLocaleString()} points
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>{currentLocation.name}</strong>
                </p>
                {currentLocation.description && (
                  <p className="text-sm text-gray-500">{currentLocation.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Distance: {Math.round(currentGuess.distance)}m away
                </p>
                <div className="mt-4 flex gap-2 items-center justify-center">
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Your Guess</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Actual Location</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={nextRound}
                className="w-full bg-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-purple-900/20"
              >
                {round < MAX_ROUNDS - 1 ? 'Next Round →' : 'See Final Score'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {guessLocation ? '📍 Pin dropped! Click Submit when ready.' : 'Click anywhere on the map to place your guess.'}
              </p>
              <button
                onClick={submitGuess}
                disabled={!guessLocation}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  guessLocation
                    ? 'bg-purple-900 text-white hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-purple-900/20'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Guess
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
