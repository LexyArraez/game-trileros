import { DOM } from './dom.js';

export function renderNewsLoading() {
  DOM.newsContainer.innerHTML = '<p class="loading">Cargando noticias...</p>';
}

export function renderNewsError(message) {
  DOM.newsContainer.innerHTML = `<p class="error">Error al cargar noticias: ${message}</p>`;
}

export function renderNewsEmpty() {
  DOM.newsContainer.innerHTML = '<p class="error">No se encontraron noticias.</p>';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createNewsCard(article) {
  const card = document.createElement('article');
  card.className = 'news-card';

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

export function renderNews(articles) {
  DOM.newsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  articles.forEach(article => fragment.appendChild(createNewsCard(article)));
  DOM.newsContainer.appendChild(fragment);
}
