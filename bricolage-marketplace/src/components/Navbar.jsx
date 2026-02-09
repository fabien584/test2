import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <h1>🔧 ToolMarket</h1>
        </div>

        <div className="nav-menu">
          {currentUser ? (
            <>
              <button 
                className="nav-btn"
                onClick={() => navigate('/create')}
              >
                ➕ Publier
              </button>
              <button 
                className="nav-btn"
                onClick={() => navigate('/my-listings')}
              >
                📋 Mes annonces
              </button>
              <div className="user-menu">
                <span className="user-name">👤 {currentUser.displayName}</span>
                <button className="nav-btn-logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                className="nav-btn"
                onClick={() => navigate('/login')}
              >
                Connexion
              </button>
              <button 
                className="nav-btn-primary"
                onClick={() => navigate('/signup')}
              >
                Inscription
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
