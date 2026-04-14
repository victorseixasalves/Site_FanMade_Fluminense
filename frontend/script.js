// ─── Menu de Perfil ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const profileIcon = document.getElementById('profile-icon');
    const profileMenu = document.getElementById('profile-menu');

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove('show');
            }
        });

        profileMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
});

// ─── Carrossel de Patrocinadores ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.sponsors-track');
    const items = document.querySelectorAll('.sponsor-item');

    if (!track || !items.length) return;

    // Clonar itens para criar o efeito infinito
    items.forEach(item => track.appendChild(item.cloneNode(true)));

    const itemWidth = items[0].offsetWidth + 30; // largura + gap
    const totalItems = items.length;
    let position = 0;
    let isTransitioning = false;

    updatePosition(false);

    let autoRotate = setInterval(mover, 1500);

    // Pausar ao passar o mouse sobre os logos
    document.querySelectorAll('.sponsor-logo').forEach(logo => {
        logo.addEventListener('mouseenter', () => clearInterval(autoRotate));
        logo.addEventListener('mouseleave', () => { autoRotate = setInterval(mover, 1500); });
    });

    function mover() {
        if (isTransitioning) return;
        position++;

        if (position >= totalItems) {
            updatePosition(true);
            isTransitioning = true;
            setTimeout(() => {
                position = 0;
                updatePosition(false);
                isTransitioning = false;
            }, 500);
        } else {
            updatePosition(true);
        }
    }

    function updatePosition(animate) {
        if (!animate) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${-position * itemWidth}px)`;
            track.offsetHeight; // forçar reflow
            setTimeout(() => { track.style.transition = 'transform 0.5s ease'; }, 10);
        } else {
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(${-position * itemWidth}px)`;
        }
    }
});

// ─── Barra de Pesquisa de Notícias ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const newsCards   = document.querySelectorAll('.news-card');

    if (!searchInput || !searchClear) return;

    searchInput.addEventListener('input', function () {
        searchClear.style.display = this.value.trim() ? 'block' : 'none';
        filtrarNoticias(this.value.trim().toLowerCase());
    });

    searchClear.addEventListener('click', function () {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filtrarNoticias('');
        searchInput.focus();
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filtrarNoticias(this.value.trim().toLowerCase());
        }
    });

    function filtrarNoticias(termo) {
        let visiveis = 0;

        newsCards.forEach(card => {
            const titulo    = card.querySelector('.news-title')?.textContent.toLowerCase()    || '';
            const resumo    = card.querySelector('.news-excerpt')?.textContent.toLowerCase()   || '';
            const categoria = card.querySelector('.news-category')?.textContent.toLowerCase() || '';

            const visivel = !termo || titulo.includes(termo) || resumo.includes(termo) || categoria.includes(termo);
            card.style.display = visivel ? 'block' : 'none';
            if (visivel) visiveis++;
        });

        mostrarSemResultados(visiveis === 0 && !!termo);
    }

    function mostrarSemResultados(mostrar) {
        let msg = document.querySelector('.no-results-message');
        if (mostrar && !msg) {
            msg = document.createElement('div');
            msg.className = 'no-results-message';
            msg.innerHTML = `
                <div style="text-align:center;padding:60px 20px;color:#666;">
                    <i class="fas fa-search" style="font-size:48px;margin-bottom:20px;opacity:0.5;"></i>
                    <h3 style="margin:0 0 10px;color:#333;">Nenhuma notícia encontrada</h3>
                    <p style="margin:0;">Tente usar outros termos de pesquisa</p>
                </div>
            `;
            document.querySelector('.news-grid')?.appendChild(msg);
        } else if (!mostrar && msg) {
            msg.remove();
        }
    }
});

// ─── Paginação ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn     = document.querySelector('.prev-btn');
    const nextBtn     = document.querySelector('.next-btn');

    if (!pageNumbers.length || !prevBtn || !nextBtn) return;

    let currentPage = 1;
    const totalPages = pageNumbers.length;

    pageNumbers.forEach((btn, index) => {
        btn.addEventListener('click', () => irParaPagina(index + 1));
    });

    prevBtn.addEventListener('click', () => { if (currentPage > 1) irParaPagina(currentPage - 1); });
    nextBtn.addEventListener('click', () => { if (currentPage < totalPages) irParaPagina(currentPage + 1); });

    function irParaPagina(pagina) {
        pageNumbers.forEach(btn => btn.classList.remove('active'));
        pageNumbers[pagina - 1].classList.add('active');
        prevBtn.disabled = pagina === 1;
        nextBtn.disabled = pagina === totalPages;
        currentPage = pagina;
        document.querySelector('.news-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    irParaPagina(1);
});

// ─── Animação fadeIn (usada nas notícias) ────────────────────────────────────
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(fadeStyle);
