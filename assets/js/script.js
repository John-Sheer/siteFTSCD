/**
 * Fichier : assets/js/script.js
 * Rôle : Gérer l'interaction du menu de navigation (hamburger et sous-menus)
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===========================================
    // 1. Gestion du Menu Hamburger (Toggle)
    // ===========================================

    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            // Bascule la classe 'active' sur le bouton hamburger pour l'animation (si CSS le gère)
            this.classList.toggle('active'); 
            
            // Bascule l'affichage du menu
            // Note : En CSS mobile, .main-nav a display: none;
            // Nous allons utiliser une classe 'menu-open' pour forcer l'affichage en mobile.
            mainNav.classList.toggle('menu-open'); 

            // Gère l'attribut ARIA pour l'accessibilité
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // ===========================================
    // 2. Gestion des Sous-Menus (Dropdowns)
    // ===========================================

    // Cibler les éléments de navigation qui contiennent un sous-menu
    const dropdownToggles = document.querySelectorAll('.dropdown > .dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        const parentLi = toggle.closest('li.dropdown');

        // On gère le clic pour l'ouverture, principalement utile sur mobile/tablette
        // car le CSS gère le :hover sur desktop.
        toggle.addEventListener('click', function(e) {
            // Empêche la navigation immédiate du lien de niveau supérieur
            e.preventDefault(); 
            
            // Si le menu est ouvert, le ferme; sinon, l'ouvre
            parentLi.classList.toggle('active');
            
            // Gère l'attribut ARIA pour l'accessibilité
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true' || false;
            toggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Clic n'importe où ailleurs sur la page ferme tous les sous-menus ouverts
        document.addEventListener('click', (e) => {
            if (!parentLi.contains(e.target) && parentLi.classList.contains('active')) {
                 parentLi.classList.remove('active');
                 toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});