/**
 * Fichier : assets/js/script.js
 * Rôle : Gérer l'interaction du menu, l'état du header et les améliorations dynamiques.
 * Note : Toutes les fonctions externes sont définies AVANT le bloc DOMContentLoaded pour la clarté.
 */

// ===========================================
// FONCTIONS EXTERNALISÉES (Nécessaires pour l'inclusion dynamique et les fonctionnalités)
// ===========================================

// Fonction de bascule pour le menu (gestion du bouton hamburger)
function handleMenuToggle() {
    const mainNav = document.querySelector('.main-nav');
    // 'this' est le bouton mobile-menu
    this.classList.toggle('active');
    mainNav.classList.toggle('menu-open');
    const isExpanded = this.getAttribute('aria-expanded') === 'true'; 
    this.setAttribute('aria-expanded', !isExpanded);
}

// Fonction de vérification du scroll (gestion du header sticky)
function checkScroll() {
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }
}

// Fonction de mise en évidence de la page active dans la navigation
function highlightActivePage() {
    // Utilise 'index.html' si l'URL se termine par un slash
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        
        if (linkPath === currentPath) {
            link.closest('li').classList.add('active');
            
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });
}

// Fonction pour réinitialiser les écouteurs JS après l'insertion dynamique de la navbar
function initializeHeaderFeatures() {
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        // Supprimer l'écouteur pour éviter d'en empiler un nouveau à chaque appel
        menuToggle.removeEventListener('click', handleMenuToggle); 
        menuToggle.addEventListener('click', handleMenuToggle);
    }

    // Ré-initialiser la gestion du Header Sticky
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        checkScroll();
    }

    highlightActivePage();

    // Rendre les dropdowns fonctionnels (pour la bascule au clic en mode mobile)
    const dropdownToggles = document.querySelectorAll('.dropdown > a.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        const parentLi = toggle.closest('li.dropdown');

        // Nettoyage de l'ancien écouteur avant d'en ajouter un nouveau (pour éviter les doublons)
        const existingClickListener = toggle.listener;
        if (existingClickListener) {
            toggle.removeEventListener('click', existingClickListener);
        }

        const newClickListener = function(e) {
            // Activer la logique de bascule uniquement sur les petits écrans
            if (window.innerWidth < 992) {
                e.preventDefault();
                parentLi.classList.toggle('active');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        };

        toggle.addEventListener('click', newClickListener);
        toggle.listener = newClickListener; // Stocker la référence pour la suppression future
    });
}

// ===========================================
// Gestion des Dropdowns (Fermeture au clic extérieur en mode mobile)
// ===========================================
function setupDropdownCloseHandler() {
    // Écouteur global pour fermer les dropdowns actifs au clic extérieur
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
            document.querySelectorAll('li.dropdown.active').forEach(parentLi => {
                // Vérifier si le clic est en dehors du dropdown actif
                if (!parentLi.contains(e.target)) {
                    parentLi.classList.remove('active');
                    const toggle = parentLi.querySelector('.dropdown-toggle');
                    if (toggle) {
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    });
}

// ===========================================
// Inclusion dynamique de Navbar et Footer (via JS/Fetch)
// ===========================================

/**
 * Récupère un fichier HTML partiel et l'insère dans un élément cible.
 * @param {string} url - Le chemin vers le fichier partiel (e.g., 'includes/navbar.html').
 * @param {string} targetId - L'ID de l'élément où insérer le contenu (e.g., 'navbar-placeholder').
 */
function includeHtml(url, targetId) {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur de chargement du fichier ${url}: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                targetElement.innerHTML = html;

                if (targetId === 'navbar-placeholder') {
                    // Initialiser les fonctionnalités dépendantes de la navbar APRÈS l'insertion
                    initializeHeaderFeatures(); 
                }
                return targetElement;
            })
            .catch(error => {
                console.error(`Impossible d'inclure ${url}. Veuillez vérifier le chemin ou le statut du serveur.`, error);
                targetElement.innerHTML = `<p style="color: red;">Erreur: Contenu ${targetId} non chargé. (${error.message})</p>`;
                return null;
            });
    }
    return Promise.resolve(null); 
}

// ===========================================
// Affichage du commentaire sous les images de la galerie
// ===========================================
function displayImageCaptions() {
    const galleryItems = document.querySelectorAll('.image-gallery-item');

    galleryItems.forEach(item => {
        const image = item.querySelector('img');
        const existingOverlay = item.querySelector('.overlay-text'); 

        if (image && existingOverlay) {
            const captionText = existingOverlay.textContent.trim();
            const captionDiv = document.createElement('div');

            // Application des styles
            captionDiv.className = 'image-caption p-2 text-center bg-light text-dark';
            captionDiv.style.fontWeight = '600';
            captionDiv.style.fontSize = '0.9rem';
            captionDiv.style.borderTop = '1px solid #ccc'; 
            captionDiv.textContent = captionText;

            // Remplacement
            existingOverlay.remove();
            item.appendChild(captionDiv);

            item.style.overflow = 'visible';
        }
    });
}

// ===========================================
// Initialisation de la Carte Leaflet
// ===========================================
function initLeafletMap() {
    // Coordonnées de 6°14'12"N 1°10'25"E (Degrés Décimaux)
    const LAT = 6.236666; 
    const LNG = 1.173611; 
    const ZOOM_LEVEL = 16; 

    const mapElement = document.getElementById('map');
    
    // Vérifier si l'élément existe ET si l'objet Leaflet (L) est chargé
    if (mapElement && typeof L !== 'undefined') {
        
        // VÉRIFICATION CRITIQUE: Détruire TOUTE instance PRÉCÉDENTE
        if (mapElement._leaflet_id !== undefined) {
            try {
                L.map(mapElement).remove(); 
            } catch (e) {
                console.warn("Ancienne instance Leaflet non trouvée ou destruction impossible.", e);
            }
        }
        
        // 3. Créer la NOUVELLE instance de la carte
        const map = L.map('map').setView([LAT, LNG], ZOOM_LEVEL);

        // 💡 AJOUT CRUCIAL : Force la carte à se redimensionner et se recentrer après le rendu.
        map.invalidateSize(); 

        // 4. Ajouter les tuiles (le fond de carte)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // 5. Ajouter un marqueur
        L.marker([LAT, LNG]).addTo(map)
            .bindPopup('<b>FTSCD</b><br>Notre siège à lomé.')
            .openPopup();
            
        // Supprimer le texte de placeholder
        const placeholder = mapElement.querySelector('p');
        if (placeholder) {
            placeholder.remove();
        }
    } else if (mapElement) {
        console.warn("Leaflet n'est pas chargé. Vérifiez les balises <script>.");
    }
}

// =============================================================
// DÉMARRAGE DU SCRIPT PRINCIPAL (Un seul bloc DOMContentLoaded)
// =============================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialiser la gestion du header sticky (écouteur sur la fenêtre)
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Exécuter une première fois au chargement
    
    // 2. Initialiser le gestionnaire de fermeture des dropdowns (gestionnaire unique)
    setupDropdownCloseHandler();

    // 3. Démarrer l'inclusion des fichiers dynamiques
    Promise.all([
        includeHtml('includes/navbar.html', 'navbar-placeholder'), 
        includeHtml('includes/footer.html', 'footer-placeholder')
    ]).then(() => {
        // Ces fonctions s'exécutent APRÈS que le DOM dynamique est chargé.
        
        // 4. Amélioration du Carousel
        const heroCarousel = document.getElementById('hero-carousel');
        if (heroCarousel && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            new bootstrap.Carousel(heroCarousel, {
                interval: 3000,
                pause: 'hover'
            });
        }
        
        // 5. Affichage des légendes
        displayImageCaptions();
        
        // 6. Initialisation de la carte 
        initLeafletMap();
    });


    // 7. Scroll fluide pour les ancres
    const mainHeader = document.querySelector('.main-header'); 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Détermine la hauteur du header (sticky ou non) pour le décalage (offset)
                const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight, 
                    behavior: 'smooth'
                });
            }
        });
    });

});


/**
 * 1. Fonction pour charger et insérer un fichier HTML externe dans un élément cible.
 * (Identique à celle fournie par l'utilisateur, avec ajout d'un callback)
 */
function loadHTMLContent(url, elementId, callback) {
    const targetElement = document.getElementById(elementId);
    
    if (!targetElement) {
        console.error(`Erreur: L'élément avec l'ID "${elementId}" est introuvable.`);
        return;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            // Étape clé : Exécuter la fonction d'initialisation APRES l'insertion du HTML
            if (typeof callback === 'function') {
                callback(); 
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'intégration du contenu:', error);
        });
}

// -------------------------------------------------------------
// 2. Fonction d'initialisation de l'autocomplétion
// -------------------------------------------------------------

function initializeAutocomplete() {
    // Vérification de la présence des éléments DOM
    const inputRecherche = document.getElementById('champ-recherche');
    const listeResultats = document.getElementById('liste-resultats');

    if (!inputRecherche || !listeResultats) {
        // Cette erreur peut survenir si search-bar.html ne contient pas les IDs corrects
        console.error("Erreur: Les IDs 'champ-recherche' ou 'liste-resultats' sont manquants.");
        return;
    }

    // 💡 À ADAPTER : L'URL réelle de votre API de recherche FTSCD
    // Cette API doit renvoyer un JSON de résultats basé sur le paramètre 'query'
    const SEARCH_API_URL = '/api/ftscd/search?query='; 
    
    let timeoutId; // Pour gérer le "Debounce" (optimisation)

    /**
     * Effectue l'appel à l'API de recherche FTSCD et affiche les résultats.
     */
    function afficherResultats(termeRecherche) {
        listeResultats.innerHTML = '';

        // N'exécute la recherche que si le terme a au moins 3 caractères
        if (termeRecherche.length < 3) {
            listeResultats.style.display = 'none';
            return;
        }

        // Construction de l'URL d'appel sécurisée
        const apiUrl = SEARCH_API_URL + encodeURIComponent(termeRecherche);

        // Appel AJAX (fetch) à l'API du site
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    // Gérer les erreurs HTTP (404, 500, etc.)
                    throw new Error('Erreur réseau ou API: ' + response.statusText);
                }
                return response.json(); 
            })
            .then(resultats => {
                listeResultats.innerHTML = ''; // Nettoyer avant d'insérer
                
                if (resultats && resultats.length > 0) {
                    resultats.forEach(resultat => {
                        const item = document.createElement('li');
                        
                        // Assurez-vous que votre API retourne { title, url }
                        item.innerHTML = `
                            <a href="${resultat.url}">
                                <strong>${resultat.title}</strong>
                                <br><small>${resultat.url}</small>
                            </a>
                        `;
                        
                        listeResultats.appendChild(item);
                    });
                    listeResultats.style.display = 'block'; 
                } else {
                    const noResult = document.createElement('li');
                    noResult.textContent = `Aucun résultat trouvé pour "${termeRecherche}".`;
                    listeResultats.appendChild(noResult);
                    listeResultats.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche:', error);
                // Afficher un message d'erreur à l'utilisateur
                listeResultats.innerHTML = '<li style="color: red;">Erreur de connexion au service de recherche.</li>';
                listeResultats.style.display = 'block';
            });
    }

    // Écoute des frappes de l'utilisateur avec DEBOUNCE
    inputRecherche.addEventListener('input', (e) => {
        // Annule le timer précédent si l'utilisateur tape rapidement
        clearTimeout(timeoutId); 
        
        // Définit un nouveau timer pour exécuter la recherche après 300ms
        timeoutId = setTimeout(() => {
            afficherResultats(e.target.value.trim());
        }, 300); 
    });

    // Cacher les résultats lorsque l'utilisateur clique en dehors de la zone
    document.addEventListener('click', (e) => {
        const isClickInsideCard = e.target.closest('.Card');
        if (!isClickInsideCard) {
            listeResultats.style.display = 'none';
        }
    });
}

// -------------------------------------------------------------
// 3. APPEL PRINCIPAL
// -------------------------------------------------------------

// Lance le chargement du HTML, puis exécute initializeAutocomplete
loadHTMLContent('includes/search-bar.html', 'search-bar-placeholder', initializeAutocomplete);