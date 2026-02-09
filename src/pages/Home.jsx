import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import '../styles/Home.css';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les annonces depuis Firestore
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings(listingsData);
      setLoading(false);
    }, (error) => {
      console.error('Erreur lors de la récupération des annonces:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || listing.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Tous', icon: '🔧' },
    { id: 'power-tools', name: 'Électroportatif', icon: '⚡' },
    { id: 'hand-tools', name: 'Outillage à main', icon: '🔨' },
    { id: 'garden', name: 'Jardin', icon: '🌱' },
    { id: 'measurement', name: 'Mesure', icon: '📏' },
    { id: 'safety', name: 'Sécurité', icon: '🦺' },
  ];

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="hero">
        <div className="hero-content">
          <h1>🔧 Achetez et vendez vos outils</h1>
          <p>La marketplace dédiée aux outils de bricolage d'occasion</p>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une perceuse, scie, marteau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍 Rechercher</button>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="listings-header">
          <h2>
            {category === 'all' ? 'Toutes les annonces' : categories.find(c => c.id === category)?.name}
            <span className="count">({filteredListings.length})</span>
          </h2>
          {currentUser && (
            <button 
              className="btn-primary"
              onClick={() => navigate('/create')}
            >
              ➕ Publier une annonce
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Chargement des annonces...</div>
        ) : filteredListings.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune annonce trouvée</h3>
            <p>Soyez le premier à publier dans cette catégorie !</p>
            {currentUser && (
              <button 
                className="btn-primary"
                onClick={() => navigate('/create')}
              >
                Publier une annonce
              </button>
            )}
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
