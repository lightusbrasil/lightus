(async function () {
    const componentContainer = document.querySelector('div[data-include=\"components/card-products/\"]');

    if (!componentContainer) {
        return;
    }

    const dataItem = componentContainer.dataset.item;

    if (!dataItem) {
        console.warn("Nenhum 'data-item' especificado para o componente card-products. Por favor, adicione data-item='seuConfigId' ao div.");
        return;
    }

    try {
        const response = await fetch('/components/card-products/card-products.json');

        if (!response.ok) {
            throw new Error(`Erro ao carregar card-products.json: ${response.statusText}`);
        }

        const allConfigs = await response.json();
        const selectedConfig = allConfigs.find(config => config.id === dataItem);

        if (selectedConfig) {
            const taglineElement = componentContainer.querySelector('.card-products-tagline');
            const mainTitleElement = componentContainer.querySelector('.card-products-main-title');
            const cardsGridElement = componentContainer.querySelector('.card-products-cards-grid');

            if (taglineElement) {
                taglineElement.textContent = selectedConfig.tagline || '';
            }
            if (mainTitleElement) {
                mainTitleElement.textContent = selectedConfig.title || '';
            }

            if (cardsGridElement && selectedConfig.cards && Array.isArray(selectedConfig.cards)) {
                selectedConfig.cards.forEach(card => {
                    const cardItem = document.createElement('div');
                    cardItem.classList.add('card-products-item');

                    const cardContent = document.createElement('div');
                    cardContent.classList.add('card-products-content');
                    cardItem.appendChild(cardContent);

                    const cardTitle = document.createElement('h3');
                    cardTitle.classList.add('card-products-title');
                    cardTitle.textContent = card['card-products-title'] || '';
                    cardContent.appendChild(cardTitle);

                    // --- INÍCIO DA MUDANÇA SIGNIFICATIVA AQUI ---

                    // Cria a lista TOP
                    const topList = document.createElement('ul');
                    topList.classList.add('card-products-list');
                    topList.classList.add('card-products-top'); // Adiciona a classe 'card-products-top' diretamente à UL

                    const topItems = card['card-products-top'].split('<br>').filter(item => item.trim() !== '');
                    topItems.forEach(itemText => {
                        const listItem = document.createElement('li');
                        // Remove os marcadores de texto do JSON, o CSS vai adicioná-los
                        listItem.innerHTML = itemText.replace(/✅\s*/, '').trim();
                        topList.appendChild(listItem);
                    });
                    cardContent.appendChild(topList);

                    // Adiciona o título da seção "Indicado para" (se houver)
                    if (card['card-products-bottom-section-title']) {
                        const bottomSectionTitle = document.createElement('h4');
                        bottomSectionTitle.classList.add('card-products-section-title');
                        bottomSectionTitle.textContent = card['card-products-bottom-section-title'];
                        cardContent.appendChild(bottomSectionTitle);
                    }

                    // Cria a lista BOTTOM
                    const bottomList = document.createElement('ul');
                    bottomList.classList.add('card-products-list');
                    bottomList.classList.add('card-products-bottom'); // Adiciona a classe 'card-products-bottom' diretamente à UL

                    const bottomItems = card['card-products-bottom'].split('<br>').filter(item => item.trim() !== '');
                    bottomItems.forEach(itemText => {
                        const listItem = document.createElement('li');
                        // Remova o marcador de texto do JSON, o CSS vai adicioná-lo
                        listItem.innerHTML = itemText.replace(/📌\\s*/, '').trim();
                        bottomList.appendChild(listItem);
                    });
                    cardContent.appendChild(bottomList);

                    // --- FIM DA MUDANÇA SIGNIFICATIVA AQUI ---

                    cardsGridElement.appendChild(cardItem);
                });
            } else {
                console.warn(`Nenhum 'cards' definido ou não é um array para a configuração \"${dataItem}\".`);
            }

        } else {
            console.warn(`Configuração com id=\"${dataItem}\" não encontrada em card-products.json.`);
        }

    } catch (error) {
        console.error("Erro ao carregar ou processar card-products.json:", error);
        componentContainer.innerHTML = `<p style=\"color: red;\">Erro ao carregar o componente de cards de produtos.</p>`;
    }
})();