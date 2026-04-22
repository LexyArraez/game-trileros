import { apiFetch } from '../utils/fetchHelper.js';
import { API_URLS } from '../config/config.js';

export async function fetchWeather(lat, lon) {
  const url = `${API_URLS.weather}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`;
  return apiFetch(url);
}

export async function fetchCity(lat, lon) {
  const url = `${API_URLS.geocoding}?lat=${lat}&lon=${lon}&format=json`;
  return apiFetch(url, { headers: { 'Accept-Language': 'es' } });
}
