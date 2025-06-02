(async function () {
    const submenuContainer = document.querySelector('div[data-include="components/submenu-basic/"]');
    if (!submenuContainer) return;

    const dataItem = submenuContainer.dataset.item;
    if (!dataItem) {
        console.warn("Adicione data-item='seuMenuId' ao componente submenu-basic");
        return;
    }

    try {
        const response = await fetch('/components/submenu-basic/submenu-basic.json');
        if (!response.ok) throw new Error(`Falha ao carregar: ${response.status}`);

        const allSubmenus = await response.json();
        const selectedSubmenu = allSubmenus.find(menu => menu.id === dataItem);

        if (!selectedSubmenu?.items?.length) {
            console.warn(`Menu ${dataItem} n�o encontrado ou vazio`);
            return;
        }

        const submenuList = submenuContainer.querySelector('.submenu-basic-list');
        if (!submenuList) {
            console.error('Lista de submenu n�o encontrada');
            return;
        }

        // Limpa e recria os itens do menu
        submenuList.innerHTML = selectedSubmenu.items.map(item => `
            <li class="submenu-basic-item">
                <a href="${item.url}" class="submenu-basic-link" role="menuitem">
                    ${item.icon ? `<i class="submenu-basic-icon ${item.icon}"></i>` : ''}
                    ${item.text}
                </a>
            </li>
        `).join('');

        // Adiciona os event listeners
        submenuList.querySelectorAll('.submenu-basic-link').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // S� interfere em links �ncora (#)
                if (href.startsWith('#')) {
                    e.preventDefault();

                    const targetId = href.slice(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // 1. Rolagem suave
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // 2. Atualiza URL sem recarregar
                        window.history.pushState(null, null, href);

                        // 3. Foco para acessibilidade
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                    } else {
                        console.warn(`Elemento #${targetId} n�o encontrado`);
                        // Fallback: comportamento normal
                        window.location.href = href;
                    }
                }
                // Links normais (n�o �ncora) mant�m comportamento padr�o
            });
        });

    } catch (error) {
        console.error('Erro no submenu:', error);
        submenuContainer.innerHTML = '<p class="error">Erro ao carregar menu</p>';
    }
})();