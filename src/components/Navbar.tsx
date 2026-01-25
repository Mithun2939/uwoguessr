import { Home, Trophy, Upload, Info } from 'lucide-react'

interface NavbarProps {
  currentView: string
  onNavigate: (view: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="max-w-6xl xl:max-w-7xl mx-auto flex justify-center items-center mb-8 lg:mb-10 pt-4 lg:pt-6 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 sm:gap-8 lg:gap-12 xl:gap-14 text-slate-600 text-base lg:text-lg font-medium flex-wrap justify-center">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg transition-all duration-200 hover:text-purple-700 hover:bg-purple-50/80 ${
            currentView === 'home' ? 'text-purple-900 font-bold bg-purple-50/60' : ''
          }`}
        >
          <Home size={24} className="transition-transform duration-200 hover:scale-110" />
          Home
        </button>
        <button
          onClick={() => onNavigate('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg transition-all duration-200 hover:text-purple-700 hover:bg-purple-50/80 ${
            currentView === 'leaderboard' ? 'text-purple-900 font-bold bg-purple-50/60' : ''
          }`}
        >
          <Trophy size={24} className="transition-transform duration-200 hover:scale-110" />
          Leaderboard
        </button>
        <button
          onClick={() => onNavigate('contribute')}
          className={`flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg transition-all duration-200 hover:text-purple-700 hover:bg-purple-50/80 ${
            currentView === 'contribute' ? 'text-purple-900 font-bold bg-purple-50/60' : ''
          }`}
        >
          <Upload size={24} className="transition-transform duration-200 hover:scale-110" />
          Contribute
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg transition-all duration-200 hover:text-purple-700 hover:bg-purple-50/80 ${
            currentView === 'about' ? 'text-purple-900 font-bold bg-purple-50/60' : ''
          }`}
        >
          <Info size={24} className="transition-transform duration-200 hover:scale-110" />
          About
        </button>
      </div>
    </nav>
  )
}
