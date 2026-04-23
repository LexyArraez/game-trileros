import { state, getCups }       from './state.js';
import { DIFFICULTY }            from '../config/difficulty.js';
import { playSound }             from '../services/audio.js';
import { startTimer, updateStats } from '../ui/counters.js';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function placeBall(index) {
  const cup       = state.cups[index];
  const container = document.querySelector('.table-area');
  const cupRect   = cup.getBoundingClientRect();
  const contRect  = container.getBoundingClientRect();
  state.ball.style.left = (cupRect.left - contRect.left + cupRect.width / 2 - 10) + 'px';
  state.ball.style.top  = (cupRect.top  - contRect.top  + cupRect.height - 24)    + 'px';
}

function liftCup(i) {
  state.cups[i].classList.add('lift');
  state.ball.classList.add('lift');
}

function lowerCup(i) {
  state.cups[i].classList.remove('lift');
  state.ball.classList.remove('lift');
}

function setMessage(msg) {
  document.getElementById('gameMessage').textContent = msg;
}

function registerPlayer() {
  const modal      = document.getElementById('modal');
  const input      = document.getElementById('playerName');
  const btnGuardar = document.getElementById('btnGuardar');
  const errorMsg   = document.getElementById('error');

  modal.style.display = 'block';

  btnGuardar.addEventListener('click', () => {
    const name = input.value.trim();
    if (name.length < 2) {
      errorMsg.style.display = 'block';
      return;
    }
    errorMsg.style.display = 'none';
    localStorage.setItem('playerName', name);
    modal.style.display = 'none';
  });
}

async function startRound() {
  const jugador   = localStorage.getItem('playerName') || 'Jugador';
  state.phase     = 'showing';
  state.canPick   = false;
  state.ballIndex = Math.floor(Math.random() * 3);

  setMessage(`${jugador} Observa la bolita...`);
  placeBall(state.ballIndex);
  state.ball.style.opacity = '1';
  liftCup(state.ballIndex);

  await sleep(1200);

  lowerCup(state.ballIndex);
  state.ball.style.opacity = '0';
  await shuffleCups();

  state.canPick = true;
  setMessage(`¿Dónde está la bolita ${jugador}?`);
}

async function shuffleCups() {
  const cfg = DIFFICULTY[state.difficulty];
  for (let i = 0; i < cfg.shuffles; i++) {
    let a, b;
    do {
      a = Math.floor(Math.random() * 3);
      b = Math.floor(Math.random() * 3);
    } while (a === b);

    await swapCups(a, b);

    if      (state.ballIndex === a) state.ballIndex = b;
    else if (state.ballIndex === b) state.ballIndex = a;

    await sleep(cfg.speed * 0.5);
  }
}

async function swapCups(a, b) {
  const cupA = state.cups[a];
  const cupB = state.cups[b];
  const dx   = cupB.getBoundingClientRect().left - cupA.getBoundingClientRect().left;

  cupA.style.transform = `translateX(${dx}px)`;
  cupB.style.transform = `translateX(${-dx}px)`;

  await sleep(400);

  cupA.style.transition = 'none';
  cupB.style.transition = 'none';
  cupA.style.transform  = '';
  cupB.style.transform  = '';

  const parent      = cupA.parentNode;
  const placeholder = document.createElement('div');
  parent.insertBefore(placeholder, cupA);
  parent.insertBefore(cupA, cupB);
  parent.insertBefore(cupB, placeholder);
  parent.removeChild(placeholder);

  [state.cups[a], state.cups[b]] = [state.cups[b], state.cups[a]];

  setTimeout(() => {
    cupA.style.transition = 'transform 0.4s ease';
    cupB.style.transition = 'transform 0.4s ease';
  }, 50);
}

function resetOrder() {
  const container = document.querySelector('.cups-container');
  state.cups = getCups();
  state.cups.forEach(c => container.appendChild(c));
}

function endGame() {
  clearInterval(state.timer);
  localStorage.removeItem('playerName');
  setMessage(`Juego terminado 🎉 Puntos: ${state.points}`);
}

export function startGame() {
  const existPlayer = localStorage.getItem('playerName');
  if (!existPlayer) {
    registerPlayer();
  } else {
    if (state.phase === 'idle') startTimer();
    startRound();
  }
}

export function pickCup(index) {
  if (!state.canPick) return;
  state.canPick = false;

  const correct = index === state.ballIndex;

  placeBall(state.ballIndex);
  state.ball.style.opacity = '1';
  liftCup(state.ballIndex);

  if (correct) {
    state.points += DIFFICULTY[state.difficulty].points;
    state.hits++;
    playSound('hit');
    setMessage('¡Correcto!');
  } else {
    state.miss++;
    playSound('miss');
    setMessage(`Fallaste 😢 Era el vaso ${state.ballIndex + 1}`);
  }

  updateStats();

  setTimeout(() => {
    lowerCup(state.ballIndex);
    state.ball.style.opacity = '0';
    if (state.round >= state.totalRounds) {
      endGame();
    } else {
      state.round++;
      updateStats();
      setMessage('Siguiente ronda...');
    }
  }, 1500);
}

export function resetGame() {
  clearInterval(state.timer);
  Object.assign(state, { phase: 'idle', round: 1, points: 0, hits: 0, miss: 0, time: 0 });

  document.getElementById('time').textContent = '0:00';
  updateStats();

  state.ball.style.opacity = '0';
  state.cups.forEach(c => c.classList.remove('lift'));
  localStorage.removeItem('playerName');
  setMessage('Juego reiniciado');

  resetOrder();
}
