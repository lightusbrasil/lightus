// pages/insights/insights.js

document.addEventListener('DOMContentLoaded', () => {
    // Este script será executado APÓS o DOM estar carregado e HTMLs injetados.
    const insightsGrid = document.getElementById('insights-grid');

    if (insightsGrid) {
        console.log('Página de Insights: Inicializando lógica específica.');

        // Exemplo: Simular carregamento de dados e renderização
        const insightsData = [
            { title: "Tendências de Mercado 2025", summary: "Análise das principais tendências que moldarão o mercado no próximo ano." },
            { title: "O Futuro da Inteligência Artificial", summary: "Como a IA está transformando indústrias e o dia a dia." },
            { title: "Desafios da Sustentabilidade Corporativa", summary: "Estratégias para empresas se tornarem mais sustentáveis." }
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
        console.log('Conteúdo dos insights carregado dinamicamente.');
    }
});