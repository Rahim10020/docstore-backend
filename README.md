# Biblio Backend API

Backend API pour gérer les fichiers sur Google Drive.

## 🚀 Endpoints disponibles

### 1. Upload un fichier
```
POST /api/upload
Body: {
  "name": "document.pdf",
  "mimeType": "application/pdf",
  "data": "base64_encoded_file"
}
```

### 2. Lister les fichiers
```
GET /api/files
```

### 3. Télécharger un fichier
```
GET /api/download?id=FILE_ID
```

### 4. Prévisualiser un fichier
```
GET /api/preview?id=FILE_ID
```

### 5. Supprimer un fichier
```
DELETE /api/delete?id=FILE_ID
```

## 📦 Installation

1. Cloner le repo
```bash
git clone <your-repo-url>
cd biblio-backend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement sur Vercel
- Aller dans Settings > Environment Variables
- Ajouter `GOOGLE_SERVICE_ACCOUNT` avec le contenu du fichier JSON

4. Déployer
```bash
vercel --prod
```

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ne jamais commit le fichier `service-account.json` !

Il est dans `.gitignore` pour éviter tout problème.

## 🛠 Développement local

```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`