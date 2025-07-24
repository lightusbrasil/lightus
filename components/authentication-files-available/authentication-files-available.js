// authentication-files-available.js
// Este script lida com a lógica da área de arquivos disponíveis, carregando-os de um JSON.

(async function() {
    // Obtém referências aos elementos HTML
    const filesContainer = document.getElementById('files-container');
    const displayNameSpan = document.getElementById('display-user-name');
    const logoutLink = document.querySelector('.logout-btn'); // O botão de logout
    // downloadLinks será populado após o carregamento dinâmico
    let downloadLinks = [];
    const filesMessageDiv = document.getElementById('files-message'); // Div para mensagens de feedback
    const excelFilesGrid = document.getElementById('excel-files-grid');
    const pdfFilesGrid = document.getElementById('pdf-files-grid');

    // URL do seu Google Apps Script para rastreamento de downloads e envio de e-mail
    const GOOGLE_APPS_SCRIPT_DOWNLOAD_TRACKING_URL = "https://script.google.com/macros/s/AKfycbzvQpeW5amFcQKT7iUzBTllhXAuNYfsWIBrmFSQbmfvyDk73h7fpLEeUV38nzoH58akvw/exec";
    // URL do arquivo JSON com a lista de arquivos
    const FILES_JSON_URL = "./data/authentication-files-available.json"; // Ajuste o caminho se necessário

    // Variáveis para armazenar o e-mail e nome do usuário logado (serão preenchidas pelo script principal)
    let currentUserEmail = null;
    let currentUserName = null;

    /**
     * Exibe uma mensagem de feedback para o usuário.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo da mensagem ('success' ou 'error').
     */
    function showMessage(message, type) {
        filesMessageDiv.textContent = message;
        filesMessageDiv.className = `auth-message ${type}`; // Adiciona a classe de estilo
        filesMessageDiv.style.display = 'block'; // Mostra a div
        // Opcional: esconder a mensagem após alguns segundos
        const displayDuration = (type === 'success') ? 10000 : 5000;
        setTimeout(() => {
            filesMessageDiv.style.display = 'none';
        }, displayDuration);
        console.log(`showMessage: Exibindo mensagem de ${type}: "${message}" por ${displayDuration / 1000} segundos.`);
    }

    /**
     * Atualiza as informações do usuário na interface.
     * Esta função será chamada pelo script principal da página.
     * @param {string} name - O nome do usuário.
     * @param {string} email - O e-mail do usuário.
     */
    function updateUserInfo(name, email) {
        currentUserName = name;
        currentUserEmail = email;
        if (displayNameSpan) {
            displayNameSpan.textContent = name || email; // Exibe o nome ou e-mail
        }
        console.log("updateUserInfo: Usuário atualizado para:", { name, email });
    }

    // Adiciona listener para o botão de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault(); // Previne o comportamento padrão do link
            console.log("Logout clicado.");
            // Dispara um evento personalizado para o gerenciador de componentes lidar com o logout
            window.dispatchEvent(new CustomEvent('auth:navigate', { detail: { action: 'logout' } }));
        });
    }

    /**
     * Adiciona listeners de clique aos links de download.
     * Esta função é chamada após os arquivos serem renderizados dinamicamente.
     */
    function attachDownloadListeners() {
        // Seleciona TODOS os links de download (agora criados dinamicamente)
        downloadLinks = document.querySelectorAll('.file-link');

        downloadLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault(); // Impede o download direto!
                console.log("Download link clicado.");

                if (!currentUserEmail) {
                    console.warn("Usuário não logado. Não é possível processar o download. currentUserName:", currentUserName, "currentUserEmail:", currentUserEmail);
                    showMessage("Por favor, faça login para acessar os downloads.", 'error');
                    return;
                }
                console.log("currentUserEmail está definido:", currentUserEmail);

                // Encontra o link pai mais próximo para obter os dados
                const clickedLink = e.target.closest('.file-link');
                if (!clickedLink) {
                    console.error("Elemento clicado não é um link de arquivo ou não está dentro de um.");
                    showMessage("Erro ao processar o clique no arquivo. Tente novamente.", 'error');
                    return;
                }

                const fileName = clickedLink.dataset.filename; // Obtém o nome do arquivo do atributo data-filename
                const fileUrl = clickedLink.href; // Obtém o URL direto do arquivo

                console.log(`Solicitação de download para '${fileName}' (${fileUrl}) por '${currentUserEmail}'`);

                // Enviar dados como 'application/x-www-form-urlencoded'
                const params = new URLSearchParams();
                params.append('action', 'track_download'); // Ação para o Apps Script
                params.append('email', currentUserEmail);
                params.append('fileName', fileName);
                params.append('fileUrl', fileUrl); // Envia o URL do arquivo
                console.log("Parâmetros para o fetch:", params.toString());

                try {
                    console.log("Iniciando requisição fetch...");
                    const response = await fetch(GOOGLE_APPS_SCRIPT_DOWNLOAD_TRACKING_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: params.toString()
                    });
                    console.log("Resposta fetch recebida:", response);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`Erro HTTP na resposta do servidor: ${response.status} - ${errorText}`);
                        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
                    }

                    const result = await response.text();
                    console.log(`Resposta do Apps Script para solicitação de download: ${result}`);

                    if (result.trim() === "OK") {
                        console.log("Download registrado e e-mail enviado com sucesso (resposta OK do Apps Script).");
                        // Mensagem de sucesso aprimorada
                        showMessage(`🎉 O link para baixar "${fileName}" foi enviado com sucesso para o seu e-mail (${currentUserEmail}). Verifique sua caixa de entrada!`, 'success');
                    } else {
                        console.warn(`Apps Script retornou um status diferente de OK: ${result}`);
                        showMessage(`Erro ao processar o download: ${result}`, 'error');
                    }

                } catch (error) {
                    console.error("Erro na requisição de download (catch block):", error);
                    showMessage("Ocorreu um erro ao tentar processar o download. Verifique sua conexão ou tente novamente.", 'error');
                }
            });
        });
    }

    /**
     * Renderiza os arquivos na interface a partir dos dados JSON.
     * @param {Array} filesData - Array de objetos de arquivo.
     */
    function renderFiles(filesData) {
        excelFilesGrid.innerHTML = ''; // Limpa os grids existentes
        pdfFilesGrid.innerHTML = '';

        filesData.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-grid-item';

            const fileLink = document.createElement('a');
            fileLink.href = file.url;
            fileLink.target = '_blank';
            fileLink.className = 'file-link';
            fileLink.dataset.filename = file.name; // Armazena o nome do arquivo no data-attribute

            const fileIconDiv = document.createElement('div');
            fileIconDiv.className = `file-icon ${file.type}-icon`; // Usa o tipo para a classe do ícone

            const icon = document.createElement('i');
            if (file.type === 'excel') {
                icon.className = 'fas fa-file-excel';
            } else if (file.type === 'pdf') {
                icon.className = 'fas fa-file-pdf';
            }
            fileIconDiv.appendChild(icon);

            const fileNameH4 = document.createElement('h4');
            fileNameH4.className = 'file-name';
            fileNameH4.textContent = file.name;

            const fileDescriptionP = document.createElement('p');
            fileDescriptionP.className = 'file-description';
            fileDescriptionP.textContent = file.description;

            fileLink.appendChild(fileIconDiv);
            fileLink.appendChild(fileNameH4);
            fileLink.appendChild(fileDescriptionP);
            fileItem.appendChild(fileLink);

            if (file.type === 'excel') {
                excelFilesGrid.appendChild(fileItem);
            } else if (file.type === 'pdf') {
                pdfFilesGrid.appendChild(fileItem);
            }
        });

        attachDownloadListeners(); // Anexa os listeners após a renderização
    }

    /**
     * Carrega os dados dos arquivos do arquivo JSON.
     */
    async function loadFiles() {
        try {
            console.log(`Carregando arquivos de: ${FILES_JSON_URL}`);
            const response = await fetch(FILES_JSON_URL);
            if (!response.ok) {
                // Se o JSON não for encontrado, exibe um erro mais claro
                if (response.status === 404) {
                    throw new Error(`Arquivo JSON não encontrado em ${FILES_JSON_URL}. Verifique o caminho.`);
                }
                throw new Error(`Erro ao carregar arquivos: ${response.status} ${response.statusText}`);
            }
            const filesData = await response.json();
            console.log("Arquivos carregados com sucesso:", filesData);
            renderFiles(filesData);
        } catch (error) {
            console.error("Erro ao carregar arquivos JSON:", error);
            showMessage(`Erro ao carregar a lista de arquivos: ${error.message}. Tente novamente mais tarde.`, 'error');
        }
    }

    // --- Event Listener para receber informações do usuário logado do script principal ---
    window.addEventListener('auth:updateUserInfo', (event) => {
        const { name, email } = event.detail;
        updateUserInfo(name, email);
        // Carrega os arquivos assim que as informações do usuário estiverem disponíveis
        loadFiles();
    });

    // Log inicial para verificar se o script foi carregado
    console.log("authentication-files-available.js carregado.");

    // *** MUDANÇA AQUI: Tenta carregar os arquivos imediatamente se o usuário já estiver logado ***
    // Isso cobre o caso de recarregar a página após o login, onde 'auth:updateUserInfo'
    // pode já ter sido disparado antes de este script estar pronto para ouvi-lo.
    if (currentUserName && currentUserEmail) {
        console.log("Usuário já logado na inicialização do script. Carregando arquivos...");
        loadFiles();
    } else {
        console.log("Usuário não logado na inicialização do script. Aguardando evento 'auth:updateUserInfo'...");
    }

})(); // Fim da função auto-executável
