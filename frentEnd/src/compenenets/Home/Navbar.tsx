import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-cyan-600">Carflow</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#services" className="text-gray-700 hover:text-cyan-600 font-medium">Services</a>
          <a href="#about" className="text-gray-700 hover:text-cyan-600 font-medium">À propos</a>
          <a href="#contact" className="text-gray-700 hover:text-cyan-600 font-medium">Contact</a>
          <button onClick={() => navigate('/login')} className="px-6 py-2 text-cyan-600 hover:text-cyan-500 font-medium">
            Connexion
          </button>
          <button onClick={() => navigate('/register')} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-medium">
            S'inscrire
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
