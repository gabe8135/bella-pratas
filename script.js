document.addEventListener('DOMContentLoaded', function () {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navIcon = document.getElementById('nav-icon');

  if (navToggle && navMenu && navIcon) {
    // Função para abrir/fechar o menu
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navIcon.textContent = isOpen ? 'close' : 'expand_more';
    };

    // Evento de clique no botão
    navToggle.addEventListener('click', (event) => {
      event.stopPropagation(); // Impede que o clique se propague para o document
      toggleMenu();
    });

    // Evento para fechar o menu ao clicar em um link
    navMenu.addEventListener('click', (event) => {
      if (event.target.classList.contains('nav__link')) {
        if (navMenu.classList.contains('is-open')) {
          toggleMenu();
        }
      }
    });

    // Evento para fechar o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('is-open') && !navMenu.contains(event.target)) {
        toggleMenu();
      }
    });

    // Evento para fechar o menu ao pressionar a tecla 'Escape'
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  }
});
