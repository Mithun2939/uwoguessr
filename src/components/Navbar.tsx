import { Home, Trophy, Upload, Info } from 'lucide-react'

interface NavbarProps {
  currentView: string
  onNavigate: (view: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 pt-4">
      <div className="flex gap-4 text-gray-700 text-sm font-medium flex-wrap">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-2 hover:text-purple-700 transition ${
            currentView === 'home' ? 'text-purple-900 font-bold' : ''
          }`}
        >
          <Home size={18} />
          Home
        </button>
        <button
          onClick={() => onNavigate('leaderboard')}
          className={`hover:text-purple-700 transition ${
            currentView === 'leaderboard' ? 'text-purple-900 font-bold' : ''
          }`}
        >
          <Trophy size={18} className="inline mr-1" />
          Leaderboard
        </button>
        <button
          onClick={() => onNavigate('contribute')}
          className={`hover:text-purple-700 transition ${
            currentView === 'contribute' ? 'text-purple-900 font-bold' : ''
          }`}
        >
          <Upload size={18} className="inline mr-1" />
          Contribute
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`hover:text-purple-700 transition ${
            currentView === 'about' ? 'text-purple-900 font-bold' : ''
          }`}
        >
          <Info size={18} className="inline mr-1" />
          About
        </button>
      </div>
    </nav>
  )
}
