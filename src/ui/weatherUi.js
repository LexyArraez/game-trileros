import { DOM } from './dom.js';

const WEATHER_CODES = {
  0:  '☀️ Despejado',
  1:  '🌤️ Principalmente despejado',
  2:  '⛅ Parcialmente nublado',
  3:  '☁️ Nublado',
  45: '🌫️ Niebla',
  48: '🌫️ Niebla con escarcha',
  51: '🌦️ Llovizna ligera',
  53: '🌦️ Llovizna moderada',
  55: '🌧️ Llovizna intensa',
  61: '🌧️ Lluvia ligera',
  63: '🌧️ Lluvia moderada',
  65: '🌧️ Lluvia fuerte',
  71: '🌨️ Nieve ligera',
  73: '🌨️ Nieve moderada',
  75: '❄️ Nieve intensa',
  80: '🌦️ Chubascos ligeros',
  81: '🌧️ Chubascos moderados',
  82: '⛈️ Chubascos fuertes',
  95: '⛈️ Tormenta',
  96: '⛈️ Tormenta con granizo',
  99: '⛈️ Tormenta con granizo intenso',
};

export function interpretarClima(codigo) {
  return WEATHER_CODES[codigo] ?? '🌡️ Condición desconocida';
}

function updateNavClima(descripcion, temperatura) {
  if (!DOM.climaIconNav) return;
  const [icono, ...resto] = descripcion.split(' ');
  DOM.climaIconNav.textContent = icono;
  DOM.climaTempNav.textContent = `${temperatura}°C`;
  DOM.climaDescNav.textContent = resto.join(' ');
}

export function renderWeatherLoading() {
  DOM.clima.textContent = 'Obteniendo clima...';
}

export function renderWeatherError(msg = 'No se pudo cargar el clima.') {
  DOM.clima.textContent = msg;
}

export function renderWeather({ temperature, windspeed }, humedad, descripcion) {
  DOM.clima.innerHTML = `
    <strong>${descripcion}</strong><br>
    🌡️ ${temperature}°C &nbsp;|&nbsp; 💨 ${windspeed} km/h<br>
    💧 Humedad: ${humedad}%
  `;
  updateNavClima(descripcion, temperature);
}

export function renderLocationLoading() {
  DOM.location.textContent = 'Solicitando permiso...';
  DOM.clima.textContent = 'Esperando ubicación...';
}

export function renderLocationError(code) {
  const mensajes = {
    1: 'Permiso de ubicación denegado.',
    2: 'Posición no disponible.',
    3: 'Tiempo de espera agotado.',
  };
  DOM.location.textContent = mensajes[code] ?? 'Error desconocido.';
  DOM.clima.textContent = 'No disponible (sin ubicación).';
}

export function renderLocation(ciudad, lat, lon, accuracy) {
  DOM.location.innerHTML = `
    <strong>${ciudad}</strong><br>
    📐 ${lat.toFixed(5)}, ${lon.toFixed(5)}<br>
     Precisión: ${Math.round(accuracy)} m
  `;
}
