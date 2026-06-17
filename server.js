// ============================================================
//  server.js  —  Mon serveur sait LIRE et ÉCRIRE des données 📦✍️
// ------------------------------------------------------------
//  - Il sert mes pages (dossier public)
//  - Il RENVOIE les questions          (GET  /api/questions)
//  - Il AJOUTE une nouvelle question   (POST /api/questions)
//    en l'écrivant dans le fichier db.json
// ============================================================

const express = require('express');
const fs = require('fs');           // pour lire ET écrire des fichiers

const app = express();
const PORT = 3000;                  // (garde 3001 si tu l'avais changé)

// Sert les fichiers du dossier "public"
app.use(express.static('public'));

// Permet au serveur de comprendre les données JSON envoyées
// par une page (indispensable pour recevoir une question).
app.use(express.json());

// ------------------------------------------------------------
//  LIRE : renvoyer toutes les questions
// ------------------------------------------------------------
app.get('/api/questions', function (req, res) {
  const contenu = fs.readFileSync('db.json', 'utf-8');
  const questions = JSON.parse(contenu);
  res.json(questions);
});

app.get('/api/themes', function (req, res) {
  const contenu = fs.readFileSync('db.json', 'utf-8');
  const questions = JSON.parse(contenu);
    const themes = [...new Set(questions.map(question => question.theme))];

  res.json(themes);
});

// ------------------------------------------------------------
//  ÉCRIRE : ajouter une nouvelle question
// ------------------------------------------------------------
app.post('/api/questions', function (req, res) {
  // 1. La nouvelle question envoyée par la page d'ajout
  const nouvelle = req.body;
console.log(req.body);
  // 2. Petite vérification : on refuse une question vide
  if (!nouvelle.texte || !nouvelle.reponses || nouvelle.reponses.length < 2) {
    return res.status(400).json({ erreur: 'Question incomplète.' });
  }

  // 3. On lit les questions actuelles
  const contenu = fs.readFileSync('db.json', 'utf-8');
  const questions = JSON.parse(contenu);

  // 4. On ajoute la nouvelle à la liste
  questions.push(nouvelle);

  // 5. On réécrit le fichier db.json avec la liste mise à jour
  fs.writeFileSync('db.json', JSON.stringify(questions, null, 2));

  // 6. On confirme à la page que c'est bon
  res.json({ ok: true });
});

app.listen(PORT, function () {
  console.log('✅ Mon serveur tourne sur http://localhost:' + PORT);
});
