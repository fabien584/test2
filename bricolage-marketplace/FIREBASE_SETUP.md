# 🔥 Guide de Configuration Firebase

Ce guide détaillé t'explique comment configurer Firebase pour ToolMarket.

## Étape 1 : Créer un projet Firebase

1. **Va sur** https://console.firebase.google.com
2. **Clique sur** "Ajouter un projet" (Add project)
3. **Nomme ton projet** : "toolmarket" (ou autre nom)
4. **Google Analytics** : Désactive si tu veux (optionnel)
5. **Clique sur** "Créer le projet"
6. **Attends** ~30 secondes pendant la création

## Étape 2 : Activer l'authentification

1. **Dans le menu de gauche** → Clique sur "Authentication"
2. **Clique sur** "Commencer" (Get started)
3. **Onglet "Sign-in method"**
4. **Clique sur "Email/Password"**
5. **Active le premier toggle** (Email/Password)
6. **Sauvegarde**

✅ L'authentification par email est maintenant activée !

## Étape 3 : Créer la base de données Firestore

1. **Dans le menu de gauche** → "Firestore Database"
2. **Clique sur** "Créer une base de données"
3. **Choisis** "Démarrer en mode test"
   - ⚠️ Mode test = tout le monde peut lire/écrire (OK pour commencer)
   - On sécurisera plus tard
4. **Choisis un emplacement** : 
   - Pour l'Europe : "eur3 (europe-west)"
5. **Clique sur** "Activer"

✅ Ta base de données Firestore est prête !

## Étape 4 : Activer le stockage (Storage)

1. **Dans le menu de gauche** → "Storage"
2. **Clique sur** "Commencer"
3. **Choisis** "Démarrer en mode test"
4. **Clique sur** "Suivant"
5. **Choisis le même emplacement** que Firestore
6. **Clique sur** "Terminé"

✅ Le stockage de photos est activé !

## Étape 5 : Obtenir la configuration

1. **Clique sur l'icône ⚙️** (Paramètres du projet) en haut à gauche
2. **Scroll vers le bas** jusqu'à "Vos applications"
3. **Clique sur l'icône Web** `</>`
4. **Nomme l'app** : "ToolMarket Web"
5. **NE coche PAS** "Configurer aussi Firebase Hosting"
6. **Clique sur** "Enregistrer l'application"

Tu verras un code comme ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnop",
  authDomain: "toolmarket-12345.firebaseapp.com",
  projectId: "toolmarket-12345",
  storageBucket: "toolmarket-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Étape 6 : Copier la config dans ton code

1. **Copie TOUT le contenu** du firebaseConfig
2. **Ouvre** `src/firebase/config.js` dans ton projet
3. **Remplace** les valeurs "VOTRE_XXX" par tes vraies valeurs

**AVANT :**
```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  // ...
};
```

**APRÈS :**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnop",
  authDomain: "toolmarket-12345.firebaseapp.com",
  projectId: "toolmarket-12345",
  storageBucket: "toolmarket-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

4. **Sauvegarde** le fichier

## ✅ C'est tout !

Lance ton app avec `npm run dev` et teste :
1. Créer un compte
2. Te connecter
3. Publier une annonce avec photo

## 🔐 Sécuriser Firebase (après les tests)

### Règles Firestore

1. **Va dans** Firestore Database → Règles
2. **Remplace** par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection listings
    match /listings/{listing} {
      // Tout le monde peut lire
      allow read: if true;
      // Seuls les utilisateurs connectés peuvent créer
      allow create: if request.auth != null;
      // Seul le propriétaire peut modifier/supprimer
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. **Publie les règles**

### Règles Storage

1. **Va dans** Storage → Règles
2. **Remplace** par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Photos dans listings/userId/
    match /listings/{userId}/{allPaths=**} {
      // Tout le monde peut voir
      allow read: if true;
      // Seul l'utilisateur peut uploader dans son dossier
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. **Publie les règles**

## 💡 Conseils

### Voir les données en temps réel
- **Firestore** : Tu peux voir toutes les annonces dans l'onglet "Données"
- **Storage** : Tu peux voir toutes les photos uploadées
- **Authentication** : Tu peux voir tous les utilisateurs inscrits

### Quota gratuit Firebase
- ✅ 50 000 lectures/jour
- ✅ 20 000 écritures/jour
- ✅ 1 GB stockage
- ✅ 10 GB bande passante/mois

Largement suffisant pour commencer !

### En cas de problème

**Erreur "Firebase App not initialized"**
→ Vérifie que tu as bien copié TOUTE la config

**Erreur "Permission denied"**
→ Les règles Firestore/Storage bloquent. Repasse en mode test temporairement.

**Photos ne s'affichent pas**
→ Ouvre la console (F12), vérifie les erreurs CORS. Normalement Firebase gère ça automatiquement.

---

🎉 **Ton Firebase est configuré !** Profite de ton app !
