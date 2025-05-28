// /components/button-start/button-start.js

// Este c�digo ser� executado assim que o navegador carregar o arquivo JS.
// Como o HTML do bot�o j� estar� no DOM (conforme seu index renderizado),
// ele ser� encontrado imediatamente.
(function() { // Isso � uma IIFE (Immediately Invoked Function Expression)
               // para manter as vari�veis e fun��es encapsuladas e n�o poluir o escopo global.

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Verifica se o bot�o foi encontrado no DOM
    if (scrollToTopBtn) {
        // Fun��o para mostrar/esconder o bot�o baseado na posi��o de rolagem
        const toggleScrollToTopButton = () => {
            // Se a rolagem for maior que 200 pixels, adiciona a classe 'show' (para torn�-lo vis�vel)
            if (window.scrollY > 200) {
                scrollToTopBtn.classList.add('show');
            } else {
                // Caso contr�rio, remove a classe 'show' (para escond�-lo)
                scrollToTopBtn.classList.remove('show');
            }
        };

        // Adiciona um "listener" para o evento de rolagem da janela.
        // Toda vez que o usu�rio rolar a p�gina, a fun��o 'toggleScrollToTopButton' ser� chamada.
        window.addEventListener('scroll', toggleScrollToTopButton);

        // Chama a fun��o uma vez logo que o script � executado.
        // Isso garante que o bot�o esteja no estado correto (vis�vel ou escondido)
        // logo ao carregar a p�gina, caso ela j� inicie rolada (ex: se o link tem #hash).
        toggleScrollToTopButton();

        // Adiciona um "listener" para o evento de clique no bot�o.
        // Quando o bot�o for clicado, ele rolar� a p�gina para o topo.
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,        // Rola para a posi��o 0 (o topo da p�gina)
                behavior: 'smooth' // Faz a rolagem ser suave, n�o instant�nea
            });
        });
    } else {
        // Opcional: Para depura��o, caso o bot�o n�o seja encontrado.
        console.warn('Bot�o "Voltar ao Topo" (#scrollToTopBtn) n�o encontrado no DOM. Verifique o HTML.');
    }
})();