import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 via-emerald-700 via-emerald-800 to-emerald-900">
      {/* Animated moving gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-emerald-600/15 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/8 via-transparent to-emerald-700/8 animate-gradient-y"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-emerald-800/10 animate-gradient-diagonal"></div>
      
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center border border-gray-200">
        <h1 className="text-gray-800 text-3xl font-bold mb-4 tracking-tight">
          Welcome to AromaTech
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          You have successfully logged in!
        </p>
        <button 
          onClick={handleLogout} 
          className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white py-4 px-8 rounded-xl text-base font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:translate-y-0 active:scale-100"
        >
          <span className="relative z-10">Logout</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  )
}

export default Home
