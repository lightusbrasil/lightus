/**
 * Função para injetar componentes com estrutura padronizada
 * (nomecomponente.css, nomecomponente.html, nomecomponente.js)
 * com recursividade para componentes aninhados
 */
async function injectComponent(element) {
    try {
        const componentPath = element.getAttribute('data-include').replace(/\/$/, '');
        const componentName = componentPath.split('/').pop();
        const basePath = componentPath.substring(0, componentPath.lastIndexOf('/') + 1);
        
        // 1. Carrega o CSS (primeiro)
        const cssPath = `${componentPath}/${componentName}.css`;
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = cssPath;
        
        cssLink.onerror = () => console.warn(`CSS não encontrado ou erro ao carregar: ${cssPath}`);
        document.head.appendChild(cssLink);
        
        // 2. Carrega o HTML (segundo)
        const htmlPath = `${componentPath}/${componentName}.html`;
        const htmlResponse = await fetch(htmlPath);
        
        if (!htmlResponse.ok) {
            console.warn(`HTML não encontrado ou vazio: ${htmlPath}`);
            element.innerHTML = ''; // Limpa o conteúdo se o HTML não existir
        } else {
            const html = await htmlResponse.text();
            element.innerHTML = html;
            
            // Processa componentes aninhados recursivamente APÓS inserir o HTML
            const nestedComponents = element.querySelectorAll('[data-include]');
            for (const nestedComponent of nestedComponents) {
                await injectComponent(nestedComponent); // Recursividade aqui
            }
        }
        
        // 3. Carrega o JS (último, no final do body)
        const jsPath = `${componentPath}/${componentName}.js`;
        const jsScript = document.createElement('script');
        jsScript.src = jsPath;
        
        jsScript.onerror = () => console.warn(`JS não encontrado ou erro ao carregar: ${jsPath}`);
        document.body.appendChild(jsScript);
        
    } catch (error) {
        console.error(`Erro ao carregar componente:`, error);
        element.innerHTML = `<div class="component-error" style="color: red; border: 1px dashed red; padding: 10px;">
            Erro ao carregar componente: ${element.getAttribute('data-include')}
        </div>`;
    }
}

// Iniciação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const components = document.querySelectorAll('[data-include]');
    
    // Usamos Promise.all para carregar todos os componentes raiz paralelamente
    Promise.all([...components].map(injectComponent)).catch(error => {
        console.error('Erro ao carregar componentes raiz:', error);
    });
    
    // Tratamento global de erros
    window.addEventListener('error', (event) => {
        console.error('Erro global:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise rejeitada não tratada:', event.reason);
    });
});