// --- LÓGICA DE CONTADORES ---

// 1. Obtenemos los elementos del DOM
const puntosElemento = document.getElementById('points');
const aciertosElemento = document.getElementById('round');
const fallosElemento =  document.getElementById('successes');
const rondaElemento = document.getElementById('failures');

// 2. Estado inicial del juego
let estadoJuego = {
    puntos: 0,
    aciertos: 0,
    fallos: 0,
    ronda: 1
};

// 3. Función para actualizar la pantalla (Visualización)
function actualizarContadores() {
    puntosElemento.textContent = estadoJuego.puntos;
    aciertosElemento.textContent = estadoJuego.aciertos;
    fallosElemento.textContent = estadoJuego.fallos;
    rondaElemento.textContent = estadoJuego.ronda;
}

// 4. Funciones para registrar aciertos, fallos y avanzar de ronda (Lógica)
window.registrarAcierto = function() {
    estadoJuego.aciertos++;
    estadoJuego.puntos += 100; // Por ejemplo, 100 puntos por acierto
    actualizarContadores();
};

window.registrarFallo = function() {
    estadoJuego.fallos++;
    actualizarContadores();
};

window.siguienteRonda = function() {
    estadoJuego.ronda++;
    actualizarContadores();
};