# 🔧 ToolMarket - Marketplace d'Outils de Bricolage

Application web progressive (PWA) de marketplace spécialisée dans la vente d'outils de bricolage d'occasion.

## ✨ Fonctionnalités

- ✅ **Authentification** complète (inscription, connexion, déconnexion)
- ✅ **Publication d'annonces** avec upload de photos
- ✅ **Liste d'annonces** avec filtres par catégorie
- ✅ **Recherche** d'outils
- ✅ **Profil utilisateur**
- ✅ **Design responsive** (mobile & desktop)
- ✅ **PWA ready** (installable sur mobile)

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- Un compte Firebase (gratuit)

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer Firebase**

a. Créer un projet Firebase :
   - Va sur https://console.firebase.google.com
   - Clique sur "Ajouter un projet"
   - Nomme-le "toolmarket" (ou autre)
   - Suis les étapes (désactive Google Analytics si tu veux)

b. Activer l'authentification :
   - Dans ton projet → Authentication → Get Started
   - Onglet "Sign-in method"
   - Active "Email/Password"

c. Créer Firestore :
   - Dans ton projet → Firestore Database → Create database
   - Mode "Test" pour commencer (règles publiques)
   - Choisis un emplacement (Europe de l'Ouest)

d. Activer Storage :
   - Dans ton projet → Storage → Get Started
   - Mode "Test" pour commencer

e. Obtenir ta config :
   - Project Settings (⚙️) → Général
   - Scroll → "Vos applications" → Ajouter une application Web (icône </>)
   - Nomme l'app → Register app
   - Copie la configuration firebaseConfig

f. Coller ta config :
   - Ouvre `src/firebase/config.js`
   - Remplace les valeurs "VOTRE_XXX" par tes vraies valeurs

3. **Lancer en mode développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📱 Tester sur mobile

1. **Trouver ton IP locale**
```bash
# Sur Windows
ipconfig

# Sur Mac/Linux
ifconfig | grep inet
```

2. **Accéder depuis ton téléphone**
```
http://TON_IP:5173
```
Exemple : `http://192.168.1.10:5173`

## 🌐 Déploiement

### Option 1 : Netlify Drop (la plus simple)

1. Va sur https://app.netlify.com/drop
2. Build le projet : `npm run build`
3. Glisse le dossier `dist` sur Netlify Drop
4. Ton app est en ligne !

### Option 2 : Vercel (recommandé)

**Via l'interface :**
1. Push ton code sur GitHub
2. Va sur vercel.com → New Project
3. Import ton repo
4. Deploy (Vercel détecte automatiquement Vite)

**Via CLI :**
```bash
npm install -g vercel
vercel
```

### Option 3 : Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🗂 Structure du projet

```
bricolage-marketplace/
├── public/
│   └── manifest.json          # Config PWA
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Barre de navigation
│   │   └── ListingCard.jsx    # Carte d'annonce
│   ├── contexts/
│   │   └── AuthContext.jsx    # Gestion authentification
│   ├── firebase/
│   │   └── config.js          # Config Firebase
│   ├── pages/
│   │   ├── Login.jsx          # Page connexion
│   │   ├── Signup.jsx         # Page inscription
│   │   ├── Home.jsx           # Page accueil
│   │   └── CreateListing.jsx  # Création d'annonce
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Navbar.css
│   │   ├── Home.css
│   │   ├── ListingCard.css
│   │   └── CreateListing.css
│   ├── App.jsx                # Composant racine
│   ├── main.jsx               # Point d'entrée
│   └── index.css              # Styles globaux
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Utilisation

### 1. S'inscrire
- Va sur la page d'inscription
- Remplis le formulaire
- Un compte est créé automatiquement

### 2. Publier une annonce
- Connecte-toi
- Clique sur "Publier une annonce"
- Ajoute des photos (jusqu'à 5)
- Remplis les informations
- Publie !

### 3. Naviguer
- Utilise les filtres par catégorie
- Recherche par mots-clés
- Clique sur une annonce pour voir les détails

## 🔐 Sécurité Firebase

**⚠️ Important** : Les règles Firebase sont en mode "Test" par défaut.

Pour passer en production, configure les règles :

**Firestore** (`/firestore/rules`) :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{listing} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage** (`/storage/rules`) :
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 🛠 Technologies utilisées

- **React** - Framework UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Firebase Auth** - Authentification
- **Firestore** - Base de données NoSQL
- **Firebase Storage** - Stockage de photos
- **CSS pur** - Pas de framework CSS

## 📈 Prochaines fonctionnalités

- [ ] Page de détail d'annonce
- [ ] Messagerie entre utilisateurs
- [ ] Favoris / Sauvegardes
- [ ] Notifications
- [ ] Système de notation
- [ ] Paiement intégré
- [ ] Géolocalisation
- [ ] Mode sombre

## 🐛 Problèmes courants

**Firebase error: "Firebase App not initialized"**
→ Vérifie que tu as bien configuré `src/firebase/config.js`

**Photos ne s'uploadent pas**
→ Vérifie que Firebase Storage est activé

**Pas d'annonces affichées**
→ Normal, la base est vide ! Crée ta première annonce

**Port 5173 déjà utilisé**
→ Vite utilisera automatiquement 5174, 5175, etc.

## 💰 Coûts

**Gratuit jusqu'à :**
- 50 000 lectures Firestore/jour
- 20 000 écritures Firestore/jour  
- 1 GB de stockage photos
- 10 GB de bande passante/mois

Au-delà → Plan Blaze (pay-as-you-go)

## 📱 Transformer en vraie app

Pour publier sur les stores :

**Avec Capacitor :**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
```

**Coûts stores :**
- Apple App Store : 99€/an
- Google Play Store : 25€ unique

## 🆘 Support

Des questions ? Demande-moi directement ! 😊

---

Créé avec ❤️ pour ta marketplace d'outils de bricolage
