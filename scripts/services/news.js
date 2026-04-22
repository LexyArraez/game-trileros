import { APIS }      from '../config/apis.js';
import { fetchJSON } from './http.js';

let news = [];

async function fetchNews(query = 'deportes', pageSize = 4) {
  const container = document.getElementById('newsContainer');

  try {
    container.innerHTML = '<p class="loading">Cargando noticias...</p>';

    const params = new URLSearchParams({
      q:        query,
      language: 'es',
      sortBy:   'publishedAt',
      pageSize,
      apiKey:   APIS.news.key,
    });

    const data = await fetchJSON(`${APIS.news.url}?${params}`);

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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year:   'numeric',
    month:  'long',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function createNewsCard(article) {
  const card        = document.createElement('article');
  card.className    = 'news-card';

  const imageUrl    = article.urlToImage || 'https://repararelpc.es/wp-content/uploads/2021/07/tecnologia.png';
  const author      = article.author || 'Autor desconocido';
  const source      = article.source.name || 'Fuente desconocida';
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

function renderNews() {
  const container = document.getElementById('newsContainer');
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  news.forEach(article => fragment.appendChild(createNewsCard(article)));
  container.appendChild(fragment);
}

fetchNews('deportes', 4);
