import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos Services</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <ServiceCard
          icon={
            <svg className="w-8 h-8 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          }
          title="Dossier Médical"
          description="Accédez à votre dossier médical complet en ligne, consultations, ordonnances et analyses."
        />
        <ServiceCard
          icon={
            <svg className="w-8 h-8 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V0h-2v2H8V0H6v2H4.5C3.12 2 2 3.12 2 4.5v15C2 20.88 3.12 22 4.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-15C22 3.12 20.88 2 19.5 2z"/>
            </svg>
          }
          title="Rendez-vous"
          description="Prenez rendez-vous facilement avec vos médecins et recevez des rappels automatiques."
        />
        <ServiceCard
          icon={
            <svg className="w-8 h-8 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          }
          title="Suivi Santé"
          description="Suivez votre état de santé, vaccinations et antécédents médicaux en temps réel."
        />
      </div>
    </section>
  );
};

export default ServicesSection;
