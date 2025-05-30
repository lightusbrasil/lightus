(function () {
    const head = document.head || document.getElementsByTagName('head')[0];

    // Insere <base href="/lightus/"> se ainda n�o houver
    if (!document.querySelector('base')) {
        const base = document.createElement('base');
        base.href = '/';
        head.prepend(base);
    }

    // Fun��o para adicionar um recurso ao head, evitando duplica��o
    function addAsset(path) {
        const isCSS = path.endsWith('.css') || path.includes('fonts.googleapis.com');
        const isJS = path.endsWith('.js');
        const isFavicon = path.endsWith('.ico') || path.includes('favicon');

        // Evita duplica��o
        const alreadyExists = Array.from(head.children).some(el => {
            return (isCSS && el.tagName === 'LINK' && el.href.includes(path)) ||
                   (isJS && el.tagName === 'SCRIPT' && el.src.includes(path)) ||
                   (isFavicon && el.tagName === 'LINK' && el.rel.includes('icon'));
        });

        if (alreadyExists) return;

        if (isCSS) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            link.type = 'text/css';
            head.prepend(link);
        } else if (isJS) {
            const script = document.createElement('script');
            script.src = path;
            head.prepend(script);
        } else if (isFavicon) {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = path;
            link.type = 'image/x-icon';
            head.prepend(link);
        }
    }

    // Assets globais que sempre ser�o carregados
    const globalAssets = [
        'components/common.css',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        'favicon.ico'
    ];

    // Carrega os assets globais
    globalAssets.forEach(addAsset);

    // Detecta a p�gina atual e carrega os assets espec�ficos
    const currentPath = window.location.pathname;
    
    // Verifica se estamos em uma p�gina dentro de /lightus/pages/
    if (currentPath.includes('/pages/')) {
        // Extrai o nome da p�gina (�ltimo diret�rio antes do index.html)
        const pagePathMatch = currentPath.match(/\/pages\/([^\/]+)/);
        
        if (pagePathMatch && pagePathMatch[1]) {
            const pageName = pagePathMatch[1];
            const pageBasePath = `pages/${pageName}/${pageName}`;
            
            // Adiciona CSS e JS espec�ficos da p�gina se existirem
            addAsset(`${pageBasePath}.css`);
            addAsset(`${pageBasePath}.js`);
        }
    }
})();