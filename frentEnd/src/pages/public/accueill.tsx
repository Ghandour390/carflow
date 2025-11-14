// import Navbar from '../../compenenets/Home/Navbar';
import Header from '../../compenenets/Home/Header';
import HeroSection from '../../compenenets/Home/HeroSection';
import ServicesSection from '../../compenenets/Home/ServicesSection';
import AboutSection from '../../compenenets/Home/AboutSection';
import Footer from '../../compenenets/Home/Footer';

function Accueill() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}

export default Accueill;