const AboutSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&h=600&fit=crop"
            alt="Équipe médicale"
            className="rounded-2xl shadow-2xl"
          />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-blue-900 mb-6">À propos de nous</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Notre équipe dévouée de prestataires certifiés par un conseil d'administration offre des soins complets, 
            des examens préventifs et des dépistages de routine au diagnostic et au traitement d'un large éventail de 
            conditions médicales.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nous privilégions une attention personnalisée et une communication claire, vous assurant de vous sentir 
            écouté et compris tout au long de votre visite.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Planifiez un rendez-vous aujourd'hui et découvrez la différence que des soins de santé compatissants et 
            de haute qualité peuvent faire.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
