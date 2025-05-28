(function () {
  const head = document.head || document.getElementsByTagName('head')[0];

  const assets = [
    '/components/common.css',
    '//fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    '//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'      
    // Pode adicionar mais CSS ou JS aqui
  ];


  assets.forEach(path => {
    const isCSS = path.endsWith('.css') || path.includes('fonts.googleapis.com');
    const isJS = path.endsWith('.js');

    // Evita duplicação
    const alreadyExists = Array.from(head.children).some(el => {
      return (isCSS && el.tagName === 'LINK' && el.href.includes(path)) ||
             (isJS && el.tagName === 'SCRIPT' && el.src.includes(path));
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
    }
  });
})();
