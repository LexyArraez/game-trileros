import { setCups, setBall } from './state/state.js';
import { startGame, resetGame, setDifficulty, pickCup } from './game/game.js';
import { toggleMenu } from './ui/gameUi.js';
import { fetchNews } from './services/newsService.js';
import { renderNews, renderNewsLoading, renderNewsError, renderNewsEmpty } from './ui/newsUi.js';
import { fetchWeather, fetchCity } from './services/weatherService.js';
import {
  interpretarClima,
  renderWeather,
  renderWeatherLoading,
  renderWeatherError,
  renderLocation,
  renderLocationLoading,
  renderLocationError,
} from './ui/weatherUi.js';

function initGame() {
  const cupEls = [
    document.getElementById('cup-1'),
    document.getElementById('cup-2'),
    document.getElementById('cup-3'),
  ];
  setCups(cupEls);
  setBall(document.querySelector('.ball'));

  cupEls.forEach((cup, i) => cup.addEventListener('click', () => pickCup(i)));
  document.querySelector('.start-game').addEventListener('click', startGame);
  document.querySelector('.reset-game').addEventListener('click', resetGame);
  document.getElementById('menuBtn').addEventListener('click', toggleMenu);
  document.querySelectorAll('.button-difficulty button').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn, btn.dataset.difficulty));
  });
}

async function loadNews() {
  renderNewsLoading();
  try {
    const data = await fetchNews('tecnologia', 4);
    if (data.articles?.length > 0) {
      renderNews(data.articles);
    } else {
      renderNewsEmpty();
    }
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    renderNewsError(err.message);
  }
}

async function onGeoSuccess({ coords: { latitude, longitude, accuracy } }) {
  renderWeatherLoading();
  try {
    const cityData = await fetchCity(latitude, longitude);
    const ciudad =
      cityData.address?.city ||
      cityData.address?.town ||
      cityData.address?.village ||
      cityData.address?.county ||
      'Ciudad desconocida';
    const pais = cityData.address?.country ?? '';

    renderLocation(`${ciudad}, ${pais}`, latitude, longitude, accuracy);

    const weatherData = await fetchWeather(latitude, longitude);
    const { current_weather: cw, hourly } = weatherData;
    const descripcion = interpretarClima(cw.weathercode);
    const humedad = hourly?.relative_humidity_2m?.[0] ?? '—';

    renderWeather(cw, humedad, descripcion);
  } catch (err) {
    console.error('Error al obtener datos geográficos:', err);
    renderWeatherError();
  }
}

function onGeoError({ code }) {
  renderLocationError(code);
}

function initLocation() {
  if (!('geolocation' in navigator)) {
    document.getElementById('location').textContent = 'Geolocalización no soportada.';
    document.getElementById('clima').textContent = 'No disponible.';
    return;
  }
  renderLocationLoading();
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  loadNews();
  initLocation();
});
