let themes = [];
function ajouterLigneReponse() {
  const liste = document.getElementById("liste-reponses");
  const numero = liste.querySelectorAll(".reponse").length;

  const ligne = document.createElement("div");
  ligne.className = "reponse";
  ligne.innerHTML =
    '<input type="radio" name="bonne" value="' + numero + '" />' +
    '<input type="text" class="rep" placeholder="Réponse ' + (numero + 1) + '" />' +
    '<button type="button" class="btn-suppr" onclick="supprimerLigne(this)">X</button>';

  liste.appendChild(ligne);
}

function supprimerLigne(bouton) {
  const liste = document.getElementById("liste-reponses");
  if (liste.querySelectorAll(".reponse").length <= 2) {
    document.getElementById("message").textContent = "Il faut au moins 2 réponses.";
    return;
  }
  bouton.parentElement.remove();
  renumeroter();
}

function renumeroter() {
  const lignes = document.querySelectorAll("#liste-reponses .reponse");
  lignes.forEach(function (ligne, index) {
    ligne.querySelector("input[type=radio]").value = index;
    ligne.querySelector(".rep").placeholder = "Réponse " + (index + 1);
  });
}
function ajouter() {
  const texte = document.getElementById("texte").value.trim();

  const champs = document.querySelectorAll(".rep");
  const reponses = [];
  champs.forEach(function (champ) {
    if (champ.value.trim() !== "") {
      reponses.push(champ.value.trim());
    }
  });

  const coche = document.querySelector("input[name='bonne']:checked");
  const cochetheme = document.querySelector("input[name='theme']:checked");

  const message = document.getElementById("message");
  if (texte === "") { message.textContent = "Écris la question."; return; }
  if (reponses.length < 2) { message.textContent = "Mets au moins 2 réponses."; return; }
  if (!coche) { message.textContent = "Coche la bonne réponse."; return; }

  const nouvelle = {
    texte: texte,
    reponses: reponses,
    bonneReponse: Number(coche.value),
    theme: cochetheme.value
  };

  fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nouvelle)
  })
    .then(function (reponse) { return reponse.json(); })
    .then(function (resultat) {
      if (resultat.ok) {
        message.textContent = "Question ajoutée ! ✔";
        document.getElementById("texte").value = "";
        document.getElementById("liste-reponses").innerHTML = "";
        ajouterLigneReponse();
        ajouterLigneReponse();
      } else {
        message.textContent = "Erreur : " + (resultat.erreur || "ajout impossible");
      }
    });
}


function recupTheme() {
  fetch('/api/themes')
    .then(function (reponse) { return reponse.json(); })
    .then(function (donnees) {
      themes = donnees;
      choixThemes();
      ajouterLigneReponse();
      ajouterLigneReponse();
    });
}

function choixThemes() {
  const liste = document.getElementById("themes");
  const numero = liste.querySelectorAll(".theme").length;
  themes.forEach(function (theme, index) {
    const ligne = document.createElement("div");
    ligne.className = "theme";
    ligne.innerHTML =
      '<input type="radio" name="theme" value="' + (theme) + '" />' +
      '<label>' + (theme) + '</label>';
    liste.appendChild(ligne);
  });
}



recupTheme();