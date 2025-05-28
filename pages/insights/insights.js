// pages/insights/insights.js

document.addEventListener('DOMContentLoaded', () => {
    // Este script ser� executado AP�S o DOM estar carregado e HTMLs injetados.
    const insightsGrid = document.getElementById('insights-grid');

    if (insightsGrid) {
        console.log('P�gina de Insights: Inicializando l�gica espec�fica.');

        // Exemplo: Simular carregamento de dados e renderiza��o
        const insightsData = [
            { title: "Tend�ncias de Mercado 2025", summary: "An�lise das principais tend�ncias que moldar�o o mercado no pr�ximo ano." },
            { title: "O Futuro da Intelig�ncia Artificial", summary: "Como a IA est� transformando ind�strias e o dia a dia." },
            { title: "Desafios da Sustentabilidade Corporativa", summary: "Estrat�gias para empresas se tornarem mais sustent�veis." }
        ];

        insightsData.forEach(insight => {
            const article = document.createElement('article');
            article.className = 'insight-card';
            article.innerHTML = `
                <h3>${insight.title}</h3>
                <p>${insight.summary}</p>
                <a href="#">Leia o artigo completo</a>
            `;
            insightsGrid.appendChild(article);
        });
        console.log('Conte�do dos insights carregado dinamicamente.');
    }
});