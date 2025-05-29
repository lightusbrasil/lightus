(function () {
    const head = document.head || document.getElementsByTagName('head')[0];

    // Insere <base href="/lightus/"> se ainda não houver
    if (!document.querySelector('base')) {
        const base = document.createElement('base');
        base.href = '/lightus/';
        head.prepend(base);
    }

    const assets = [
        'components/common.css',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        // Adicione o favicon aqui (ajuste o caminho conforme necessário)
        'favicon.ico'
        // Pode adicionar mais CSS, JS ou favicon aqui
    ];

    assets.forEach(path => {
        const isCSS = path.endsWith('.css') || path.includes('fonts.googleapis.com');
        const isJS = path.endsWith('.js');
        const isFavicon = path.endsWith('.ico') || path.includes('favicon');

        // Evita duplicação
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
    });
})();
