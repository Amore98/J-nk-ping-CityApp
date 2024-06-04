
const burgerMenu = document.getElementById('burger-menu');
const burgerMenuItems = document.getElementById('burger-menu-items');

burgerMenu.addEventListener('click', function() {
   
    burgerMenuItems.classList.toggle('is-active');
});


burgerMenuItems.addEventListener('click', function() {
    burgerMenuItems.classList.remove('is-active');
});

document.addEventListener('click', function(event) {
    if (!burgerMenu.contains(event.target) && !burgerMenuItems.contains(event.target)) {
        burgerMenuItems.classList.remove('is-active');
    }
}, true); 
