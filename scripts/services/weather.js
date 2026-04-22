import { APIS }      from '../config/apis.js';
import { fetchJSON } from './http.js';

const locationEl = document.getElementById('location');
const climaEl    = document.getElementById('clima');

function interpretarClima(codigo) {
  const codigos = {
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
  return codigos[codigo] ?? '🌡️ Condición desconocida';
}

async function obtenerClima(lat, lon) {
  try {
    climaEl.textContent = 'Obteniendo clima...';

    const url  = `${APIS.weather.url}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`;
    const data = await fetchJSON(url);
    const cw   = data.current_weather;

    const descripcion = interpretarClima(cw.weathercode);
    const humedad     = data.hourly?.relative_humidity_2m?.[0] ?? '—';

    climaEl.innerHTML = `
      <strong>${descripcion}</strong><br>
      🌡️ ${cw.temperature}°C &nbsp;|&nbsp; 💨 ${cw.windspeed} km/h<br>
      💧 Humedad: ${humedad}%
    `;

    const iconNav = document.getElementById('climaIconNav');
    const tempNav = document.getElementById('climaTempNav');
    const descNav = document.getElementById('climaDescNav');

    if (iconNav && tempNav && descNav) {
      const partes = descripcion.split(' ');
      iconNav.textContent = partes[0];
      tempNav.textContent = `${cw.temperature}°C`;
      descNav.textContent = partes.slice(1).join(' ');
    }
  } catch (err) {
    console.error('Error al obtener clima:', err);
    climaEl.textContent = 'No se pudo cargar el clima.';
  }
}

async function obtenerCiudad(lat, lon) {
  try {
    const url  = `${APIS.geocoding.url}?lat=${lat}&lon=${lon}&format=json`;
    const data = await fetchJSON(url, { headers: { 'Accept-Language': 'es' } });

    const ciudad = data.address?.city
      || data.address?.town
      || data.address?.village
      || data.address?.county
      || 'Ciudad desconocida';

    return `${ciudad}, ${data.address?.country ?? ''}`;
  } catch (err) {
    console.error('Error reverse geocoding:', err);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

async function onGeoSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;

  locationEl.textContent = 'Obteniendo ciudad...';

  const ciudad = await obtenerCiudad(latitude, longitude);

  locationEl.innerHTML = `
    <strong>${ciudad}</strong><br>
    📐 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}<br>
    Precisión: ${Math.round(accuracy)} m
  `;

  await obtenerClima(latitude, longitude);
}

function onGeoError(error) {
  const mensajes = {
    1: 'Permiso de ubicación denegado.',
    2: 'Posición no disponible.',
    3: 'Tiempo de espera agotado.',
  };
  locationEl.textContent = mensajes[error.code] ?? 'Error desconocido.';
  climaEl.textContent    = 'No disponible (sin ubicación).';
}

if (!('geolocation' in navigator)) {
  locationEl.textContent = 'Geolocalización no soportada.';
  climaEl.textContent    = 'No disponible.';
} else {
  locationEl.textContent = 'Solicitando permiso...';
  climaEl.textContent    = 'Esperando ubicación...';

  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout:            10000,
    maximumAge:         0,
  });
}
