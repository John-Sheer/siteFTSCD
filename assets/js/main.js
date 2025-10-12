document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement de la barre de navigation.");
                }
                return response.text();
            })
            .then(data => {
                navbarContainer.innerHTML = data;
            })
            .catch(error => console.error("Erreur :", error));
    }
});

// Fonction d'initialisation de Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'fr', // Langue de départ (Français)
            includedLanguages: 'fr,en', // Langues disponibles (Français et Anglais)
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE, // Style du bouton
            autoDisplay: false // Empêche la traduction automatique au chargement
        },
        'google_translate_element' // ID du conteneur du widget
    );
}

// Fonction pour basculer entre Français et Anglais
function toggleLanguage() {
    const language = document.querySelector('.goog-te-combo').value;  // Récupère la langue sélectionnée
    const newLanguage = language === 'fr' ? 'en' : 'fr'; // Inverse la langue

    // Déclenche la traduction automatique via Google Translate
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = newLanguage;  // Change la langue sélectionnée
        combo.dispatchEvent(new Event('change'));  // Déclenche l'événement 'change' pour appliquer la langue
    }
}

