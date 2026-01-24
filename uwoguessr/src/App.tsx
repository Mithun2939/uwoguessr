import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Home, Trophy, Upload, Info, Target } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers not showing in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const correctIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// TypeScript interfaces
interface Location {
  id: number;
  image: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
}

interface GuessLocation {
  lat: number;
  lng: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

// Map click handler component
function MapClickHandler({ onMapClick, disabled }: { onMapClick: (lat: number, lng: number) => void; disabled: boolean }) {
  useMapEvents({
    click: (e) => {
      if (!disabled) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function WesternGuessr() {
  // State management
  const [view, setView] = useState<'home' | 'game' | 'how-to' | 'about' | 'leaderboard' | 'results'>('home');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [guessLocation, setGuessLocation] = useState<GuessLocation | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameLocations, setGameLocations] = useState<Location[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Western University coordinates
  const WESTERN_CENTER: [number, number] = [43.0096, -81.2737];
  const MAX_ROUNDS = 5;

  // Sample locations with REAL Western University buildings
  const sampleLocations: Location[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      lat: 43.0096,
      lng: -81.2737,
      name: 'University College',
      description: 'The iconic Gothic Revival building'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
      lat: 43.0089,
      lng: -81.2731,
      name: 'Weldon Library',
      description: 'Main library on campus'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      lat: 43.0102,
      lng: -81.2744,
      name: 'Alumni Hall',
      description: 'Student residence building'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
      lat: 43.0083,
      lng: -81.2722,
      name: 'Physics & Astronomy Building',
      description: 'Science complex'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      lat: 43.0094,
      lng: -81.2749,
      name: 'University Community Centre',
      description: 'Student center and hub'
    }
  ];

  // Load leaderboard from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('westernGuessrLeaderboard');
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    }
  }, []);

  // Start game - shuffle locations
  useEffect(() => {
    if (view === 'game' && gameLocations.length === 0) {
      const shuffled = [...sampleLocations].sort(() => Math.random() - 0.5);
      setGameLocations(shuffled);
    }
  }, [view, gameLocations.length]);

  // Calculate distance between two coordinates (in meters) - Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate score based on distance (0-5000 points)
  const calculateScore = (distance: number): number => {
    const maxDistance = 500; // 500 meters for campus
    if (distance > maxDistance) return 0;
    return Math.round(5000 * (1 - distance / maxDistance));
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!showResult) {
      setGuessLocation({ lat, lng });
    }
  };

  const submitGuess = () => {
    if (!guessLocation || !gameLocations[round]) return;
    
    const currentLocation = gameLocations[round];
    const distance = calculateDistance(
      guessLocation.lat,
      guessLocation.lng,
      currentLocation.lat,
      currentLocation.lng
    );
    
    const roundScore = calculateScore(distance);
    setScore(roundScore);
    setTotalScore(prev => prev + roundScore);
    setShowResult(true);
  };

  const nextRound = () => {
    if (round < MAX_ROUNDS - 1) {
      setRound(prev => prev + 1);
      setGuessLocation(null);
      setShowResult(false);
      setScore(0);
    } else {
      setShowNameInput(true);
    }
  };

  const saveScore = () => {
    if (!playerName.trim()) return;
    
    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: totalScore,
      date: new Date().toISOString()
    };
    
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
    
    setLeaderboard(updated);
    localStorage.setItem('westernGuessrLeaderboard', JSON.stringify(updated));
    setView('results');
    setShowNameInput(false);
  };

  const resetGame = () => {
    setView('home');
    setRound(0);
    setScore(0);
    setTotalScore(0);
    setGuessLocation(null);
    setShowResult(false);
    setGameLocations([]);
    setPlayerName('');
    setShowNameInput(false);
  };

  // Render different views
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 pt-4">
          <div className="flex gap-6 text-gray-700 text-sm font-medium">
            <button onClick={() => setView('home')} className="flex items-center gap-2 hover:text-purple-700 transition">
              <Home size={18} />
            </button>
            <button onClick={() => setView('about')} className="hover:text-purple-700 transition">About</button>
            <button onClick={() => setView('leaderboard')} className="hover:text-purple-700 transition">Leaderboard</button>
            <button onClick={() => setView('how-to')} className="hover:text-purple-700 transition">How to Play</button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto text-center mt-20">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-purple-900">Western</span>
            <span className="text-gray-700">Guessr</span>
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Can you identify these spots around Western's campus?
          </p>
          
          <button
            onClick={() => setView('game')}
            className="bg-purple-900 text-white px-12 py-4 rounded-lg font-semibold hover:bg-purple-800 transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Game
          </button>

          <div className="mt-16 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <Target className="mx-auto mb-2 text-purple-900" size={32} />
              <p className="font-bold text-2xl text-purple-900">{MAX_ROUNDS}</p>
              <p className="text-gray-600 text-sm">Rounds</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Trophy className="mx-auto mb-2 text-purple-900" size={32} />
              <p className="font-bold text-2xl text-purple-900">{MAX_ROUNDS * 5000}</p>
              <p className="text-gray-600 text-sm">Max Points</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <MapPin className="mx-auto mb-2 text-purple-900" size={32} />
              <p className="font-bold text-2xl text-purple-900">{sampleLocations.length}</p>
              <p className="text-gray-600 text-sm">Locations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'how-to') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 pt-4">
          <div className="flex gap-6 text-gray-700 text-sm font-medium">
            <button onClick={() => setView('home')} className="flex items-center gap-2 hover:text-purple-700">
              <Home size={18} />
            </button>
            <button onClick={() => setView('about')} className="hover:text-purple-700">About</button>
            <button onClick={() => setView('leaderboard')} className="hover:text-purple-700">Leaderboard</button>
            <button onClick={() => setView('how-to')} className="hover:text-purple-700 text-purple-900 font-bold">How to Play</button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">How to Play</h2>
            
            <div className="space-y-6">
              {[
                { number: 1, title: 'Look at the Photo', desc: "You'll see a random photo taken somewhere on Western's campus." },
                { number: 2, title: 'Click on the Map', desc: 'Drop a pin on the map where you think the photo was taken.' },
                { number: 3, title: 'Get Points', desc: 'The closer you are, the more points you get! Maximum 5,000 points per round.' },
                { number: 4, title: `${MAX_ROUNDS} Rounds Total`, desc: `Play through ${MAX_ROUNDS} rounds and try to get the highest score possible!` }
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-900 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setView('home')}
              className="mt-8 w-full bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'about') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 pt-4">
          <div className="flex gap-6 text-gray-700 text-sm font-medium">
            <button onClick={() => setView('home')} className="flex items-center gap-2 hover:text-purple-700">
              <Home size={18} />
            </button>
            <button onClick={() => setView('about')} className="hover:text-purple-700 text-purple-900 font-bold">About</button>
            <button onClick={() => setView('leaderboard')} className="hover:text-purple-700">Leaderboard</button>
            <button onClick={() => setView('how-to')} className="hover:text-purple-700">How to Play</button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">About <span className="text-gray-700">WesternGuessr</span></h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>WesternGuessr</strong> is a campus geography game for Western University. You'll see random photos taken somewhere on campus, drop a pin on the map where you think it was shot, and gain points based on how close you are.
            </p>
            <p className="text-gray-600 text-sm">
              Inspired by GeoGuessr. Built by students, for students 🎓
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Technology</h3>
            <p className="text-gray-700 leading-relaxed">
              Built with React, Leaflet maps, and lots of Mustang pride. This is a student project created to help Western students explore and learn about their campus in a fun way.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Disclaimer</h3>
            <p className="text-gray-700 leading-relaxed">
              This is an unofficial, student-made project and is not affiliated with or endorsed by Western University. Any use of campus names, buildings, or landmarks is for identification and educational context only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 pt-4">
          <div className="flex gap-6 text-gray-700 text-sm font-medium">
            <button onClick={() => setView('home')} className="flex items-center gap-2 hover:text-purple-700">
              <Home size={18} />
            </button>
            <button onClick={() => setView('about')} className="hover:text-purple-700">About</button>
            <button onClick={() => setView('leaderboard')} className="hover:text-purple-700 text-purple-900 font-bold">Leaderboard</button>
            <button onClick={() => setView('how-to')} className="hover:text-purple-700">How to Play</button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={36} />
            Leaderboard
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg">No scores yet!</p>
                <p className="text-sm">Be the first to play and set a record.</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div 
                  key={index}
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
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-purple-900">{entry.score.toLocaleString()} pts</span>
                </div>
              ))
            )}
          </div>
          
          <button
            onClick={() => setView('home')}
            className="mt-6 w-full bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-900 focus:border-transparent"
              maxLength={20}
              autoFocus
            />
          </div>
          
          <button
            onClick={saveScore}
            disabled={!playerName.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition mb-3 ${
              playerName.trim()
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save to Leaderboard
          </button>
          
          <button
            onClick={() => {
              setShowNameInput(false);
              setView('results');
            }}
            className="w-full text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
          <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
          <p className="text-5xl font-bold text-purple-900 mb-2">{totalScore.toLocaleString()}</p>
          <p className="text-gray-600 mb-8">Total Points</p>
          
          <button
            onClick={resetGame}
            className="bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition w-full mb-3"
          >
            Play Again
          </button>
          
          <button
            onClick={() => setView('leaderboard')}
            className="text-purple-900 hover:text-purple-700 font-medium"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  if (view === 'game' && gameLocations.length > 0 && round < gameLocations.length) {
    const currentLocation = gameLocations[round];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress bar */}
          <div className="mb-4 bg-white rounded-lg p-2 shadow">
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
          <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-4">
            <div className="aspect-video bg-gray-900 relative">
              <img 
                src={currentLocation.image} 
                alt="Campus location" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Campus+Photo';
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
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">
              {showResult ? 'Results' : 'Drop your guess on the map'}
            </h3>
            
            <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300 mb-4">
              <MapContainer 
                center={WESTERN_CENTER} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} disabled={showResult} />
                
                {guessLocation && (
                  <Marker position={[guessLocation.lat, guessLocation.lng]} icon={guessIcon}>
                    <Popup>Your Guess</Popup>
                  </Marker>
                )}
                
                {showResult && (
                  <Marker position={[currentLocation.lat, currentLocation.lng]} icon={correctIcon}>
                    <Popup>{currentLocation.name}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {showResult ? (
              <div className="text-center space-y-4">
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-4xl font-bold text-purple-900 mb-2">
                    {score.toLocaleString()} points
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>{currentLocation.name}</strong>
                  </p>
                  <p className="text-sm text-gray-500">{currentLocation.description}</p>
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
                  className="w-full bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
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
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    guessLocation
                      ? 'bg-purple-900 text-white hover:bg-purple-800 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Guess
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading game...</p>
      </div>
    </div>
  );
}

export default WesternGuessr;