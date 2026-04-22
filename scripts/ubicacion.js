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

function updateNavClima(descripcion, temperatura) {
  if (!DOM.climaIconNav) return;
  const [icono, ...resto] = descripcion.split(' ');
  DOM.climaIconNav.textContent = icono;
  DOM.climaTempNav.textContent = `${temperatura}°C`;
  DOM.climaDescNav.textContent = resto.join(' ');
}

async function obtenerClima(lat, lon) {
  try {
    DOM.clima.textContent = 'Obteniendo clima...';

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { current_weather: cw, hourly } = await res.json();
    const descripcion = interpretarClima(cw.weathercode);
    const humedad = hourly?.relative_humidity_2m?.[0] ?? '—';

    DOM.clima.innerHTML = `
      <strong>${descripcion}</strong><br>
      🌡️ ${cw.temperature}°C &nbsp;|&nbsp; 💨 ${cw.windspeed} km/h<br>
      💧 Humedad: ${humedad}%
    `;

    updateNavClima(descripcion, cw.temperature);
  } catch (err) {
    console.error('Error al obtener clima:', err);
    DOM.clima.textContent = 'No se pudo cargar el clima.';
  }
}

async function obtenerCiudad(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const ciudad = data.address?.city
      || data.address?.town
      || data.address?.village
      || data.address?.county
      || 'Ciudad desconocida';
    const pais = data.address?.country ?? '';

    return `${ciudad}, ${pais}`;
  } catch (err) {
    console.error('Error reverse geocoding:', err);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

async function onGeoSuccess({ coords: { latitude, longitude, accuracy } }) {
  DOM.location.textContent = 'Obteniendo ciudad...';
  const ciudad = await obtenerCiudad(latitude, longitude);

  DOM.location.innerHTML = `
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
  DOM.location.textContent = mensajes[error.code] ?? 'Error desconocido.';
  DOM.clima.textContent = 'No disponible (sin ubicación).';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!('geolocation' in navigator)) {
    DOM.location.textContent = 'Geolocalización no soportada.';
    DOM.clima.textContent = 'No disponible.';
    return;
  }

  DOM.location.textContent = 'Solicitando permiso...';
  DOM.clima.textContent = 'Esperando ubicación...';

  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
});
