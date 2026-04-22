import { DOM } from './dom.js';
import { state, cups, ballEl } from '../state/state.js';

export function setMessage(msg) {
  DOM.gameMessage.textContent = msg;
}

export function updateStats() {
  DOM.points.textContent = state.points;
  DOM.round.textContent = state.round;
  DOM.successes.textContent = state.hits;
  DOM.failures.textContent = state.miss;
}

export function updateTimer() {
  const m = Math.floor(state.time / 60);
  const s = state.time % 60;
  DOM.time.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

export function resetTimerDisplay() {
  DOM.time.textContent = '0:00';
}

export function setDifficultyActive(el) {
  document.querySelectorAll('.button-difficulty button').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

export function toggleMenu() {
  DOM.navLinks.classList.toggle('active');
  DOM.usersBlock.classList.toggle('active');
}

function placeBall() {
  const cup = cups[state.ballIndex];
  const cupRect = cup.getBoundingClientRect();
  const contRect = DOM.tableArea.getBoundingClientRect();
  ballEl.style.left = (cupRect.left - contRect.left + cupRect.width / 2 - 10) + 'px';
  ballEl.style.top  = (cupRect.top  - contRect.top  + cupRect.height - 24) + 'px';
}

function liftCup(i) {
  cups[i].classList.add('lift');
  ballEl.classList.add('lift');
}

function lowerCup(i) {
  cups[i].classList.remove('lift');
  ballEl.classList.remove('lift');
}

export function revealBall() {
  placeBall();
  ballEl.style.opacity = '1';
  liftCup(state.ballIndex);
}

export function hideBall() {
  lowerCup(state.ballIndex);
  ballEl.style.opacity = '0';
}

export function resetCupsDisplay() {
  ballEl.style.opacity = '0';
  cups.forEach(c => c.classList.remove('lift'));
}

export async function swapCupsAnimation(a, b, sleep) {
  const cupA = cups[a];
  const cupB = cups[b];

  const dx = cupB.getBoundingClientRect().left - cupA.getBoundingClientRect().left;

  cupA.style.transform = `translateX(${dx}px)`;
  cupB.style.transform = `translateX(${-dx}px)`;

  await sleep(400);

  cupA.style.transition = 'none';
  cupB.style.transition = 'none';
  cupA.style.transform = '';
  cupB.style.transform = '';

  const parent = cupA.parentNode;
  const placeholder = document.createElement('div');
  parent.insertBefore(placeholder, cupA);
  parent.insertBefore(cupA, cupB);
  parent.insertBefore(cupB, placeholder);
  parent.removeChild(placeholder);

  [cups[a], cups[b]] = [cups[b], cups[a]];

  setTimeout(() => {
    cupA.style.transition = 'transform 0.4s ease';
    cupB.style.transition = 'transform 0.4s ease';
  }, 50);
}
