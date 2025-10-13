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