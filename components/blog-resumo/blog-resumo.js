// Vari�veis globais acess�veis
const blogUrl = 'https://lightusbrasil.blogspot.com/';
// max-results ajustado para 6 para obter os posts necess�rios
const feedUrl = blogUrl + 'feeds/posts/default?alt=json-in-script&callback=showBloggerPosts&max-results=6&orderby=published&order=desc';
const insightsPageUrl = '/pages/insights/';

// Refer�ncias aos elementos DOM (assumindo que o script � carregado ap�s o HTML ou que o ambiente lida com isso)
// ATEN��O: 'carousel' neste contexto � o cont�iner dos posts do carrossel, N�O o elemento a ser limpo diretamente.
const mainPostContainer = document.getElementById('main-post');
const secondaryPostsContainer = document.getElementById('secondary-posts');
const secondaryPostsElements = secondaryPostsContainer ? secondaryPostsContainer.querySelectorAll('.blogger-post.secondary') : [];
const sidebarPostsList = document.getElementById('sidebar-posts');


// Fun��o para extrair o postId do objeto post do Blogger
function getPostId(post) {
    const fullId = post.id.$t;
    const postId = fullId.split('post-')[1];
    return postId;
}

// Fun��o para criar o HTML de um post principal/secund�rio para o CAROUSEL
const createCarouselPostHTML = (post, isMain = false) => {
    if (!post) return '';

    let imageUrl = '';
    const content = post.content.$t || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);

    if (imgMatch && imgMatch.length > 1) {
        imageUrl = imgMatch[1];
    }
    const firstTag = post.category && post.category[0] ? post.category[0].term : '';
    const postClass = isMain ? 'blogger-post main' : 'blogger-post secondary';
    const postItem = isMain ? 'main' : 'secondary';
    const postId = getPostId(post);
    const insightsUrl = `${insightsPageUrl}?post=${postId}`;

    return `
        
            ${imageUrl ? `<img src="${imageUrl}" alt="${post.title.$t}">` : '<div class="no-image">Sem imagem</div>'}
            <span class="post-tag ${postItem}">${firstTag}</span>
            <h3><a class="post-title-link ${postItem}" href="${insightsUrl}">${post.title.$t}</a></h3>
            <span class="article-below-title ${postItem}">Artigo</span>
       
    `;
};

// Fun��o para renderizar os posts "Resultado na Pr�tica" na sidebar
function renderSidebarPostsList(postsToRender) {
    if (!sidebarPostsList) return;

    sidebarPostsList.innerHTML = postsToRender.map(post => {
        const firstTag = post.category && post.category[0] ? post.category[0].term : '';
        const postId = getPostId(post);
        const insightsUrl = `${insightsPageUrl}?post=${postId}`;
        return `
            <li>
                ${firstTag ? `<span class="sidebar-tag">${firstTag}</span>` : ''}
                <a href="${insightsUrl}">${post.title.$t}</a>
                <span class="sidebar-article">ARTIGO</span>
            </li>
        `;
    }).join('');
}

// Fun��o global que ser� chamada pelo JSONP (o callback do Blogger)
window.showBloggerPosts = function (data) {
    try {
        const posts = data.feed.entry || [];
        console.log("Total de posts recebidos:", posts.length); // DEBUG

        if (posts.length < 6) {
            console.warn('N�o h� posts suficientes para preencher todas as se��es (m�nimo de 6 posts necess�rios). Atualmente: ' + posts.length);
        }

        // --- CORRE��O: Limpar o CONTE�DO dos elementos espec�ficos, n�o o elemento pai que cont�m eles ---
        if (mainPostContainer) mainPostContainer.innerHTML = '';
        if (secondaryPostsElements.length > 0) { // Limpa o primeiro secund�rio
            secondaryPostsElements[0].innerHTML = '';
        }
        if (secondaryPostsElements.length > 1) { // Limpa o segundo secund�rio
            secondaryPostsElements[1].innerHTML = '';
        }
        if (sidebarPostsList) sidebarPostsList.innerHTML = ''; // Este j� estava correto

        // --- Renderizar posts do Carrossel ---
        // �ltimo post (�ndice 0)
        const firstPost = posts[0] || null;
        // Pen�ltimo post (�ndice 1)
        const secondPost = posts[1] || null;
        // Antepen�ltimo post (�ndice 2)
        const thirdPost = posts[2] || null;

        console.log("Post 1 (main):", firstPost); // DEBUG
        console.log("Post 2 (secondary 1):", secondPost); // DEBUG
        console.log("Post 3 (secondary 2):", thirdPost); // DEBUG

        if (mainPostContainer) {
            mainPostContainer.innerHTML = createCarouselPostHTML(firstPost, true);
        } else {
            console.warn("mainPostContainer n�o encontrado!"); // DEBUG
        }

        if (secondaryPostsElements.length > 0) {
            secondaryPostsElements[0].innerHTML = createCarouselPostHTML(secondPost);
        } else {
             console.warn("secondaryPostsElements[0] n�o encontrado ou container vazio!"); // DEBUG
        }

        if (secondaryPostsElements.length > 1) {
            secondaryPostsElements[1].innerHTML = createCarouselPostHTML(thirdPost);
        } else {
             console.warn("secondaryPostsElements[1] n�o encontrado ou container insuficiente!"); // DEBUG
        }

        // --- Renderizar posts "Resultado na Pr�tica" na sidebar (4�, 5� e 6� posts) ---
        const postsForSidebar = posts.slice(3, 6); // Pega os posts do �ndice 3 ao 5
        renderSidebarPostsList(postsForSidebar);
        console.log("Posts para Sidebar:", postsForSidebar); // DEBUG

    } catch (error) {
        console.error('Erro ao processar posts:', error);
        // Exibir mensagem de erro nos cont�ineres principais
        if (mainPostContainer) mainPostContainer.innerHTML = '<div class="error-message">Erro ao exibir posts.</div>';
        if (secondaryPostsElements.length > 0) secondaryPostsElements[0].innerHTML = '<div class="error-message">Erro.</div>';
        if (secondaryPostsElements.length > 1) secondaryPostsElements[1].innerHTML = '<div class="error-message">Erro.</div>';
        if (sidebarPostsList) sidebarPostsList.innerHTML = '<div class="error-message">Erro ao carregar not�cias.</div>';
    }
};

// Fun��o para buscar dados do blog (similar ao seu exemplo)
function fetchBlogData(callback) {
    const script = document.createElement('script');
    script.src = `${blogUrl}feeds/posts/default?alt=json-in-script&callback=${callback}&max-results=6&orderby=published&order=desc`;
    document.body.appendChild(script);

    // Tratamento de erro para falha no carregamento do script
    script.onerror = function () {
        // Exibir mensagem de erro nos cont�ineres principais
        if (mainPostContainer) mainPostContainer.innerHTML = '<div class="error-message">Erro ao carregar o feed de not�cias.</div>';
        if (secondaryPostsElements.length > 0) secondaryPostsElements[0].innerHTML = '<div class="error-message">Erro.</div>';
        if (secondaryPostsElements.length > 1) secondaryPostsElements[1].innerHTML = '<div class="error-message">Erro.</div>';
        if (sidebarPostsList) sidebarPostsList.innerHTML = '<div class="error-message">Erro ao carregar o feed de not�cias.</div>';
    };
}

// === Chamada de fun��o para iniciar o processo no final do script ===
// Exibir mensagem de carregamento imediatamente
if (mainPostContainer) mainPostContainer.innerHTML = '<div class="loading-message">Carregando not�cia principal...</div>';
if (secondaryPostsElements.length > 0) secondaryPostsElements[0].innerHTML = '<div class="loading-message">Carregando...</div>';
if (secondaryPostsElements.length > 1) secondaryPostsElements[1].innerHTML = '<div class="loading-message">Carregando...</div>';
if (sidebarPostsList) sidebarPostsList.innerHTML = '<div class="loading-message">Carregando not�cias da sidebar...</div>';

fetchBlogData('showBloggerPosts');