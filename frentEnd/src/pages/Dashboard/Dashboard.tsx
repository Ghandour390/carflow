import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from '../../compenenets/Dashboard/SideBar';
import Header from '../../compenenets/Home/Header';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
      <>
      <div>
        <Header />
        <Sidebar />
        <div className="ml-64 p-6">
          <h1 className="text-2xl font-bold mb-4">Bienvenue dans votre tableau de bord, {user?.prenom}!</h1>
          {/* Contenu principal du tableau de bord */}
        </div>
      </div>
      </>
  );
};

export default Dashboard;
