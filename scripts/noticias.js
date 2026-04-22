const API_KEY = 'c5210701b4454b5096c6487d77c43478';
const API_URL = 'https://newsapi.org/v2/everything';

async function fetchNews(query = 'tecnologia', pageSize = 4) {
  DOM.newsContainer.innerHTML = '<p class="loading">Cargando noticias...</p>';

  try {
    const params = new URLSearchParams({
      q: query,
      language: 'es',
      sortBy: 'publishedAt',
      pageSize,
      apiKey: API_KEY,
    });

    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();

    if (data.articles?.length > 0) {
      renderNews(data.articles);
    } else {
      DOM.newsContainer.innerHTML = '<p class="error">No se encontraron noticias.</p>';
    }
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    DOM.newsContainer.innerHTML = `<p class="error">Error al cargar noticias: ${error.message}</p>`;
  }
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

function renderNews(articles) {
  DOM.newsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  articles.forEach(article => fragment.appendChild(createNewsCard(article)));
  DOM.newsContainer.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => fetchNews('tecnologia', 4));
