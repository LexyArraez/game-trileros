import { APIS }      from '../config/apis.js';
import { fetchJSON } from './http.js';

let news = [];

async function fetchNews(query = 'deportes', pageSize = 4) {
  console.log("fetchNews iniciada");

  const container = document.getElementById('newsContainer');
  console.log("container:", container);

  if (!container) {
    console.error("No existe #newsContainer");
    return;
  }

  try {
    container.innerHTML = '<p>Cargando noticias...</p>';

    const params = new URLSearchParams({
      q: query,
      language: 'es',
      sortBy: 'publishedAt',
      pageSize,
      apiKey: APIS.news.key,
    });

    const url = `${APIS.news.url}?${params}`;
    console.log("URL:", url);

    const data = await fetchJSON(url);
    console.log("Respuesta API:", data);

    if (data.articles && data.articles.length > 0) {
      news = data.articles;
      renderNews();
    } else {
      container.innerHTML = '<p>No se encontraron noticias.</p>';
    }

  } catch (error) {
    console.error("ERROR REAL:", error);
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function renderNews() {
  const container = document.getElementById('newsContainer');
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  news.forEach(article => fragment.appendChild(createNewsCard(article)));
  container.appendChild(fragment);
}

fetchNews('deportes', 4);
