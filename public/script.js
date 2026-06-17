let numQuest = 0;
let scr = 0;
let theme = "";
let questionstheme = [];


let questions = []

function initData() {
  fetch('/api/questions')
    .then(function (reponse) { return reponse.json(); })
    .then(function (donnees) {
      questions = donnees;
      affichertheme();   // on ne démarre QU'UNE FOIS les questions reçues
    });
}
// ========================================================
//  AFFICHAGE (déjà fait pour toi)
//  Cette fonction met la question à l'écran et fabrique
//  un bouton pour chaque réponse possible.
// ========================================================
function affichertheme() {
  const themes = [...new Set(questions.map(question => question.theme))];
  document.getElementById("theme").textContent = theme
  const zonetheme = document.getElementById("theme");
  document.getElementById("question").textContent = ""
  zonetheme.innerHTML = "";
  themes.forEach(function (theme, index) {
    const bouton = document.createElement("button");
    bouton.textContent = theme;
    bouton.onclick = function () { choitheme(theme); };
    zonetheme.appendChild(bouton);
  });
};

function choitheme(themechoisi) {
  theme = themechoisi
  document.getElementById("theme").textContent = ""
  document.getElementById("ChoixTheme").textContent = ""
  questionstheme = questions.filter(u => u.theme === themechoisi);
  afficherQuestion()
}

function afficherQuestion() {
  const currentQuestion = questionstheme[numQuest];
  document.getElementById("score").textContent = "Votre score est de " + scr + "/" + questionstheme.length;
  document.getElementById("question").textContent = (numQuest + 1) + " - " + currentQuestion.theme + " - " + currentQuestion.texte;

  const zone = document.getElementById("reponses");
  zone.innerHTML = "";
  currentQuestion.reponses.forEach(function (texte, i) {
    const bouton = document.createElement("button");
    bouton.textContent = texte;

    // Quand on clique sur ce bouton, on appelle TA fonction
    // en lui disant quel numéro de réponse a été choisi.
    bouton.onclick = function () {
      verifier(i);
    };

    zone.appendChild(bouton);
  });
}


// ========================================================
//  👉  À TOI DE JOUER  👈
// --------------------------------------------------------
//  Cette fonction est appelée quand on clique sur une réponse.
//  "indexChoisi" est le numéro de la réponse cliquée (0, 1 ou 2).
//
//  TON OBJECTIF :
//   - SI le numéro choisi est le bon  -> afficher "Bravo ! 🎉"
//   - SINON                           -> afficher "Raté... 😅"
//
//  Pour afficher un message à l'écran, utilise :
//     document.getElementById("resultat").textContent = "ton message";
//
//  (Si tu bloques, regarde la fiche de consignes : il y a des
//   coups de pouce, à lire seulement si tu es coincé !)
// ========================================================
function verifier(indexChoisi) {
  console.log("verifier", numQuest)
  if (numQuest < questionstheme.length) {
    const currentQuestion = questionstheme[numQuest];
    if (indexChoisi === currentQuestion.bonneReponse) {
      document.getElementById("resultat").textContent = "Bravo ! 🎉";
      document.getElementById("resultat").style.color = "green";
      scr++;
    } else {
      document.getElementById("resultat").textContent = "Raté... 😅";
      document.getElementById("resultat").style.color = "red";
    }

    numQuest++;
    if (numQuest < questionstheme.length) {
      afficherQuestion();
    } else {
      quizTermine();
    }
  }
}

function quizTermine() {
  document.getElementById("question").textContent = "Quiz terminé";
  if (scr < questionstheme.length / 2) {
    document.getElementById("resultat").textContent = "Votre score est de " + scr + "/" + questionstheme.length + "...  Tu feras mieux la prochaine fois 😁😁😁";
    document.getElementById("resultat").style.color = "red"
  } else if (scr == questionstheme.length) {
    document.getElementById("resultat").textContent = "Vous avez fait un sans faute. BRAVO !! 🥳🥳";
    document.getElementById("resultat").style.color = "green"
  } else {
    document.getElementById("resultat").textContent = "Votre score est de " + scr + "/" + questionstheme.length + ". Bon travail ! 🥳";
    document.getElementById("resultat").style.color = "yellow"
  }
  document.getElementById("score").textContent = "";
  document.getElementById("reponses").innerHTML = "";
}

initData();