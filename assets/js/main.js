<<<<<<< HEAD
// Fichier: assets/js/script.js

/**
 * Gestion du menu de navigation mobile (Menu Hamburger)
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            // Bascule la classe 'active' pour afficher/masquer la liste de navigation
            navList.classList.toggle('active');
            
            // Gestion de l'icône du hamburger (facultatif: transformation en X)
            menuToggle.classList.toggle('is-open'); 

            // Gestion de l'accessibilité
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
});
=======
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

>>>>>>> db362ab761680cfd0e5cfe0a5e917b5c0a85257f
