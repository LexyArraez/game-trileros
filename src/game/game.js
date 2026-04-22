import { state, cups, setCups, resetState } from '../state/state.js';
import { DIFFICULTY } from '../config/config.js';
import {
  setMessage, updateStats, updateTimer, resetTimerDisplay,
  setDifficultyActive, revealBall, hideBall, resetCupsDisplay,
  swapCupsAnimation,
} from '../ui/gameUi.js';
import { playSound } from '../audio/audio.js';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function startGame() {
  if (state.phase === 'idle') startTimer();
  startRound();
}

async function startRound() {
  state.phase = 'showing';
  state.canPick = false;
  state.ballIndex = Math.floor(Math.random() * 3);

  setMessage('Observa la bolita...');
  revealBall();

  await sleep(1200);
  hideBall();
  await shuffleCups();

  state.canPick = true;
  setMessage('¿Dónde está la bolita?');
}

export async function pickCup(index) {
  if (!state.canPick) return;
  state.canPick = false;

  const correct = index === state.ballIndex;
  revealBall();

  if (correct) {
    state.points += DIFFICULTY[state.difficulty].points;
    state.hits++;
    playSound('hit');
    setMessage('¡Correcto!');
  } else {
    state.miss++;
    playSound('miss');
    setMessage(`Fallaste Era el vaso ${state.ballIndex + 1}`);
  }

  updateStats();
  await sleep(1500);
  hideBall();

  if (state.round >= state.totalRounds) {
    endGame();
  } else {
    state.round++;
    updateStats();
    setMessage('Siguiente ronda...');
    startRound();
  }
}

async function shuffleCups() {
  const { shuffles, speed } = DIFFICULTY[state.difficulty];

  for (let i = 0; i < shuffles; i++) {
    let a, b;
    do {
      a = Math.floor(Math.random() * 3);
      b = Math.floor(Math.random() * 3);
    } while (a === b);

    await swapCupsAnimation(a, b, sleep);

    if (state.ballIndex === a) state.ballIndex = b;
    else if (state.ballIndex === b) state.ballIndex = a;

    await sleep(speed * 0.5);
  }
}

function startTimer() {
  clearInterval(state.timer);
  state.time = 0;

  state.timer = setInterval(() => {
    state.time++;
    updateTimer();
  }, 1000);
}

function endGame() {
  clearInterval(state.timer);
  setMessage(`Juego terminado 🎉 Puntos: ${state.points}`);
}

export function resetGame() {
  clearInterval(state.timer);
  resetState();

  updateStats();
  resetTimerDisplay();
  resetCupsDisplay();
  setMessage('Juego reiniciado');
  resetOrder();
}

function resetOrder() {
  const fresh = [
    document.getElementById('cup-1'),
    document.getElementById('cup-2'),
    document.getElementById('cup-3'),
  ];
  setCups(fresh);
  fresh.forEach(c => document.querySelector('.cups-container').appendChild(c));
}

export function setDifficulty(el, diff) {
  state.difficulty = diff;
  setDifficultyActive(el);
}
