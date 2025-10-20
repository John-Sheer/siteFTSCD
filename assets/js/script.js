/**
 * Fichier : assets/js/script.js
 * Rôle : Gérer l'interaction du menu, l'état du header et les améliorations dynamiques.
 */

document.addEventListener('DOMContentLoaded', function() {

    const mainHeader = document.querySelector('.main-header');
    const mainNav = document.querySelector('.main-nav');
    
    // ===========================================
    // 1. Gestion du Menu Hamburger (Mobile)
    // ===========================================

    const menuToggle = document.getElementById('mobile-menu');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active'); 
            mainNav.classList.toggle('menu-open'); 

            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
    // ===========================================
// 7. Affichage du commentaire sous les images de la galerie
// ===========================================

function displayImageCaptions() {
    // Cibler tous les conteneurs d'éléments de galerie
    const galleryItems = document.querySelectorAll('.image-gallery-item');

    galleryItems.forEach(item => {
        const image = item.querySelector('img');
        const existingOverlay = item.querySelector('.overlay-text');

        // Assurez-vous que l'image et le texte d'overlay existent
        if (image && existingOverlay) {
            
            // 1. Récupérer le texte (l'alt de l'image) ou le texte existant dans l'overlay
            // Nous allons prioriser l'alt pour la description, si vous le souhaitez.
            // Si vous préférez utiliser le texte déjà dans la div .overlay-text, utilisez:
            // const captionText = existingOverlay.textContent.trim();
            
            // UTILISATION DU TEXTE DÉJÀ PRÉSENT DANS .overlay-text (selon votre HTML fourni)
            const captionText = existingOverlay.textContent.trim();

            // 2. Créer l'élément de légende (Caption)
            const captionDiv = document.createElement('div');
            
            // Utilisation de classes Bootstrap pour le style (sans ajouter de nouveau CSS)
            // p-2 pour le padding, text-center pour le centrage, bg-light pour le fond
            captionDiv.className = 'image-caption p-2 text-center bg-light text-dark';
            captionDiv.style.fontWeight = '600'; // Rendre le texte plus visible (style inline minimal)
            captionDiv.style.fontSize = '0.9rem';
            captionDiv.style.borderTop = '1px solid #ccc'; // Ajout d'une ligne de séparation

            // 3. Remplir le contenu
            captionDiv.textContent = captionText;

            // 4. Retirer le texte d'overlay initial (car il est souvent positionné en absolu)
            existingOverlay.remove();
            
            // 5. Insérer la nouvelle légende DYNAMIQUE après l'image (dans le conteneur .image-gallery-item)
            item.appendChild(captionDiv);

            // Mise à jour du style du conteneur pour qu'il ne soit plus 'overflow: hidden'
            // Cela permet à la légende de s'afficher sans être coupée.
            item.style.overflow = 'visible'; 
            
            // Retirer l'ombre sur l'image elle-même, si vous voulez que la légende soit incluse dans le style
            // item.classList.remove('shadow-sm'); // Si vous avez une ombre que vous souhaitez conserver sur l'ensemble
        }
    });
}

// Lancer la fonction après le chargement complet du DOM
displayImageCaptions();

    // ===========================================
    // 2. Gestion des Sous-Menus (Dropdowns)
    // ===========================================

    const dropdownToggles = document.querySelectorAll('.dropdown > .dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        const parentLi = toggle.closest('li.dropdown');

        toggle.addEventListener('click', function(e) {
            // Sur desktop, on veut laisser le :hover faire le travail
            if (window.innerWidth < 992) {
                e.preventDefault(); 
                parentLi.classList.toggle('active');
                
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true' || false;
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
        
        // Ferme tous les sous-menus ouverts lorsque l'on clique ailleurs (Mobile/Tablette)
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && !parentLi.contains(e.target) && parentLi.classList.contains('active')) {
                 parentLi.classList.remove('active');
                 toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // ===========================================
    // 3. Highlight de la page active (Active Link)
    // ===========================================
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Récupère le nom du fichier ou 'index.html'

    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        
        // Gère les liens dans les sous-menus et les liens principaux
        if (linkPath === currentPath) {
            // Ajoute la classe 'active' au <li> parent direct du lien
            link.closest('li').classList.add('active');
            
            // Si le lien est dans un sous-menu, ajoute aussi 'active' au <li> parent (dropdown)
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });


    // ===========================================
    // 4. Header Sticky Style (ajoute une classe au scroll)
    // ===========================================
    
    if (mainHeader) {
        // Fonction pour vérifier la position de défilement
        const checkScroll = () => {
            if (window.scrollY > 50) {
                // Utilisation de la classe 'scrolled' pour le style
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        };

        // Événement d'écoute au chargement et au défilement
        window.addEventListener('scroll', checkScroll);
        // Exécuter une fois au chargement au cas où l'utilisateur arrive en milieu de page
        checkScroll();
    }


    // ===========================================
    // 5. Scroll fluide pour les ancres
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Récupère l'élément cible
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                 // Fait défiler la fenêtre en douceur
                window.scrollTo({
                    top: targetElement.offsetTop - (mainHeader ? mainHeader.offsetHeight : 0), // Ajuste pour la hauteur du header fixe
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===========================================
    // 6. Amélioration du Carousel (uniquement sur index.html)
    // ===========================================
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 3000, // Intervalle standard (5s)
            pause: 'hover'   // Pause l'auto-play sur survol
        });

        // La classe 'bootstrap' doit être disponible (ce qui est le cas puisque vous la chargez dans votre HTML)
    }

});