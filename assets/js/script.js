//  pour afficher le sous-menu au survol
document.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        dropdown.addEventListener('mouseenter', function() {
            var submenu = this.querySelector('.submenu');
            if (submenu) submenu.style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', function() {
            var submenu = this.querySelector('.submenu');
            if (submenu) submenu.style.display = 'none';
        });
    }
});