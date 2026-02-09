import { useNavigate } from 'react-router-dom';
import '../styles/ListingCard.css';

export default function ListingCard({ listing }) {
  const navigate = useNavigate();

  const conditionLabels = {
    'new': '✨ Neuf',
    'excellent': '🌟 Excellent',
    'good': '👍 Bon état',
    'fair': '👌 État correct',
    'poor': '🔧 À réparer'
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'À l\'instant';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div 
      className="listing-card"
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="card-image">
        <img 
          src={listing.images?.[0] || '/placeholder-tool.jpg'} 
          alt={listing.title}
        />
        <div className="card-condition">
          {conditionLabels[listing.condition]}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{listing.title}</h3>
        <p className="card-description">
          {listing.description.substring(0, 80)}
          {listing.description.length > 80 ? '...' : ''}
        </p>

        <div className="card-footer">
          <div className="card-price">{listing.price}€</div>
          <div className="card-meta">
            {listing.location && (
              <span className="card-location">📍 {listing.location}</span>
            )}
            <span className="card-date">{formatDate(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
