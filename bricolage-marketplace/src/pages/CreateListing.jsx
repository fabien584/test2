import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/CreateListing.css';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'power-tools',
    condition: 'good',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { id: 'power-tools', name: 'Électroportatif', icon: '⚡' },
    { id: 'hand-tools', name: 'Outillage à main', icon: '🔨' },
    { id: 'garden', name: 'Jardin', icon: '🌱' },
    { id: 'measurement', name: 'Mesure', icon: '📏' },
    { id: 'safety', name: 'Sécurité', icon: '🦺' },
  ];

  const conditions = [
    { id: 'new', name: 'Neuf', icon: '✨' },
    { id: 'excellent', name: 'Excellent état', icon: '🌟' },
    { id: 'good', name: 'Bon état', icon: '👍' },
    { id: 'fair', name: 'État correct', icon: '👌' },
    { id: 'poor', name: 'À réparer', icon: '🔧' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 photos');
      return;
    }

    setImages([...images, ...files]);
    
    // Créer les aperçus
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (images.length === 0) {
      setError('Ajoutez au moins une photo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload des images
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `listings/${currentUser.uid}/${Date.now()}_${i}`);
        await uploadBytes(imageRef, images[i]);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // Créer l'annonce dans Firestore
      await addDoc(collection(db, 'listings'), {
        ...formData,
        price: parseFloat(formData.price),
        images: imageUrls,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        status: 'active'
      });

      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la création de l\'annonce:', err);
      setError('Erreur lors de la publication. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <Navbar />
      
      <div className="create-content">
        <div className="create-header">
          <h1>📝 Publier une annonce</h1>
          <p>Vendez vos outils rapidement et facilement</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-section">
            <h2>Photos</h2>
            <div className="image-upload">
              <label className="upload-btn">
                📷 Ajouter des photos (max 5)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={loading || images.length >= 5}
                  style={{ display: 'none' }}
                />
              </label>
              
              <div className="image-previews">
                {previews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Informations</h2>
            
            <div className="form-group">
              <label>Titre de l'annonce *</label>
              <input
                type="text"
                name="title"
                placeholder="Ex: Perceuse Bosch Professional 18V"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Décrivez votre outil : marque, modèle, année, état, accessoires inclus..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={6}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="50"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Localisation</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Paris 75001"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Catégorie *</label>
              <div className="category-grid">
                {categories.map(cat => (
                  <label key={cat.id} className="radio-card">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={formData.category === cat.id}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-content">
                      <span className="radio-icon">{cat.icon}</span>
                      <span className="radio-label">{cat.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>État *</label>
              <div className="condition-grid">
                {conditions.map(cond => (
                  <label key={cond.id} className="radio-card">
                    <input
                      type="radio"
                      name="condition"
                      value={cond.id}
                      checked={formData.condition === cond.id}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-content">
                      <span className="radio-icon">{cond.icon}</span>
                      <span className="radio-label">{cond.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Publication...' : '✓ Publier l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
