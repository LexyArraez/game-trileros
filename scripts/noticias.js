// IMPORTANTE: Reemplaza 'YOUR_API_KEY' con tu clave de API de NewsAPI
// Obtén tu clave gratuita en: https://newsapi.org/

const API_KEY = 'c5210701b4454b5096c6487d77c43478';
const API_URL = 'https://newsapi.org/v2/everything';

let news = [];

/**
 * Obtiene noticias desde NewsAPI
 * @param {string} query - Término de búsqueda
 * @param {number} pageSize - Cantidad de artículos a obtener
 */


async function fetchNews(query = 'deportes', pageSize = 4) {
    const container = document.getElementById('newsContainer');

    try {
        // Mostrar indicador de carga
        container.innerHTML = '<p class="loading">Cargando noticias...</p>';

        // Construir URL con parámetros
        const params = new URLSearchParams({
            q: query,
            language: 'es',
            sortBy: 'publishedAt',
            pageSize: pageSize,
            apiKey: API_KEY
        });

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            news = data.articles;
            renderNews();
        } else {
            container.innerHTML = '<p class="error">No se encontraron noticias. Intenta con otro tipo de noticia.</p>';
        }
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        container.innerHTML = `<p class="error">Error al cargar noticias: ${error.message}</p>`;
    }
}

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Crea y retorna un elemento de tarjeta de noticia
 * @param {object} article - Objeto del artículo
 * @returns {HTMLElement} Elemento article
 */
function createNewsCard(article) {
    const card = document.createElement('article');
    card.className = 'news-card';
    console.log(article.urlToImage);

    const imageUrl = article.urlToImage || 'https://repararelpc.es/wp-content/uploads/2021/07/tecnologia.png';
    const author = article.author || 'Autor desconocido';
    const source = article.source.name || 'Fuente desconocida';
    const description = article.description || 'Sin descripción disponible';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${article.title}" class="news-card-image" loading="lazy">
        <div class="news-card-content">
            <div class="news-header">
                <span class="source-badge">${source}</span>
                <span class="date">${formatDate(article.publishedAt)}</span>
            </div>
            <h3>${article.title}</h3>
            <p class="description">${description}</p>
            <div class="news-footer">
                <p class="author">Por: <strong>${author}</strong></p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">Leer más →</a>
            </div>
        </div>
    `;

    return card;
}

/**
 * Renderiza todas las noticias en el contenedor
 */
function renderNews() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    news.forEach(article => {
        const card = createNewsCard(article);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

/**
 * Inicializa la aplicación al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchNews('deportes', 4);
});
