export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            About <span className="text-gray-700">WesternGuessr</span>
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>WesternGuessr</strong> is a campus geography game for Western University. 
            You'll see random photos taken somewhere on campus, drop a pin on the map where you 
            think it was shot, and gain points based on how close you are.
          </p>
          <p className="text-gray-600 text-sm">
            Inspired by GeoGuessr. Built by students, for students 🎓
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-900 mb-3">How to Play</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Start the daily challenge - you'll get 5 random campus locations</li>
            <li>Look at each photo and click on the map where you think it was taken</li>
            <li>Get points based on how close you are - closer guesses = more points!</li>
            <li>Complete all 5 rounds and see your total score</li>
            <li>Submit your score to compete on the leaderboard</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-900 mb-3">Technology</h3>
          <p className="text-gray-700 leading-relaxed">
            Built with React, TypeScript, Tailwind CSS, Mapbox GL, and Supabase. 
            This is a student project created to help Western students explore and 
            learn about their campus in a fun way.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-900 mb-3">Contribute</h3>
          <p className="text-gray-700 leading-relaxed">
            Have a great photo of campus? Submit it through our contribution page! 
            All submissions are reviewed before being added to the game to ensure quality.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-purple-900 mb-3">Disclaimer</h3>
          <p className="text-gray-700 leading-relaxed">
            This is an unofficial, student-made project and is not affiliated with or 
            endorsed by Western University. Any use of campus names, buildings, or landmarks 
            is for identification and educational context only.
          </p>
        </div>
      </div>
    </div>
  )
}
