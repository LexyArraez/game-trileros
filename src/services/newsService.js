import { apiFetch } from '../utils/fetchHelper.js';
import { NEWS_API_KEY, API_URLS } from '../config/config.js';

export async function fetchNews(query = 'tecnologia', pageSize = 4) {
  const params = new URLSearchParams({
    q: query,
    language: 'es',
    sortBy: 'publishedAt',
    pageSize,
    apiKey: NEWS_API_KEY,
  });
  return apiFetch(`${API_URLS.news}?${params}`);
}
