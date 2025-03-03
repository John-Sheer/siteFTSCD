// Cette fonction met à jour le texte du bouton en fonction de la langue sélectionnée
function updateButtonText() {
    var select = document.querySelector(".goog-te-combo");
    var btn = document.getElementById("translate-btn");

    if (select && btn) {
        btn.textContent = select.value === "fr" ? "ENG" : "FR";
    }
}

function toggleLanguage() {
    setTimeout(() => {
        var select = document.querySelector(".goog-te-combo");
        if (select) {
            select.value = select.value === "en" ? "fr" : "en"; // Alterner la langue
            select.dispatchEvent(new Event("change"));

            setTimeout(updateButtonText, 500); // Met à jour le texte après la traduction
        }
    }, 500); // Attendre un peu pour éviter les bugs
}

// Vérifie la langue au chargement de la page et met à jour le bouton
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(updateButtonText, 1000);

    var btn = document.getElementById("translate-btn");
    if (btn) {
        btn.addEventListener("click", toggleLanguage);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.split("/").pop(); // Récupère le fichier actuel
    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split("/").pop(); // Récupère le fichier du lien
        if (currentPath === linkPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active"); // Ajoute la classe "active" au lien de la page courante
        } else {
            link.classList.remove("active");
        }
    });
});

// Fonction de basculement de la langue (exemple basique)
function toggleLanguage() {
    const translateBtn = document.getElementById('translate-btn');
    if (translateBtn.textContent === 'ENG') {
        translateBtn.textContent = 'FR';
        alert('Changement de langue en Anglais');
    } else {
        translateBtn.textContent = 'ENG';
        alert('Changement de langue en Français');
    }
}

const currentUrl = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-list a');
navLinks.forEach(link => {
    if (currentUrl.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({ 
        pageLanguage: 'fr', 
        includedLanguages: 'en,fr',
        autoDisplay: false
    }, 'google_translate_element');
}
