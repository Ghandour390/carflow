import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Bienvenue sur Carflow
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Votre plateforme de gestion médicale complète pour un suivi optimal de votre santé
      </p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => navigate('/register')} className="px-8 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500">
          Commencer maintenant
        </button>
        <button className="px-8 py-3 border-2 border-cyan-600 text-cyan-600 rounded-lg font-medium hover:bg-cyan-50">
          En savoir plus
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
