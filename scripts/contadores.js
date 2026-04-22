/* TIMER */
function startTimer() {
  clearInterval(state.timer);
  state.time = 0;

  state.timer = setInterval(() => {
    state.time++;
    const m = Math.floor(state.time / 60);
    const s = state.time % 60;
    DOM.time.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

function updateStats() {
  DOM.points.textContent = state.points;
  DOM.round.textContent = state.round;
  DOM.successes.textContent = state.hits;
  DOM.failures.textContent = state.miss;
}

/* DIFFICULTY */
function setDifficulty(el, diff) {
  state.difficulty = diff;
  document.querySelectorAll('.button-difficulty button')
    .forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}
