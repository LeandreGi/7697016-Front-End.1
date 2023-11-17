export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {

        piecesElements[i].addEventListener("click", async function (event) {

            const id = event.target.dataset.id;
            const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
            const avis = await reponse.json();
            window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))
            const pieceElement = event.target.parentElement;
            afficherAvis(pieceElement, avis)
        });

    }
}

export function afficherAvis(pieceElement, avis) {
    const avisElement = document.createElement("p");
    for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
    }
    pieceElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
        event.preventDefault();
        // Création de l’objet du nouvel avis.
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(avis);
        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    });

}

export async function afficherGraphiqueAvis() {
    // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];

    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }
    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["5", "4", "3", "2", "1"];
    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    };
    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };
    // Rendu du graphique dans l'élément canvas
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );

    //deuxieme graphique
    const piecesJSON = window.localStorage.getItem("pieces");
    const pieces = JSON.parse(piecesJSON);

    let nb_commentaires_dispo = [0, 0];
    for (let i = 0; i<avis.length; i++) {
        const piece = pieces.find(p => p.id === avis[i].pieceId);
        if (piece) {
            if (piece.disponibilite) {
                nb_commentaires_dispo[0]++;
            } else {
                nb_commentaires_dispo[1]++;
            };
        };
    };

    //Données du deuxieme graphique
    const labels_0 = ["Pièce.s disponible.s", "Pièce.s non disponible.s"];
    const data_0 = {
        labels : labels_0,
        datasets : [{
            label : "Graphique des avis selon la disponibilité",
            data : nb_commentaires_dispo,
            backgroundColor : [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor : [
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
            ],
            borderWidth : 1
        }]
    };

    //Création du deuxieme graphique
    const config_0 = {
        type: 'bar',
        data: data_0,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };

    const graphiqueAvisDispo = new Chart(
        document.querySelector("#graphique-dispo"),
        config_0,
    )
}

