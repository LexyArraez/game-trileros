/* GAME */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function startGame() {
  if (state.phase === 'idle') startTimer();
  startRound();
}

async function startRound() {
  state.phase = 'showing';
  state.canPick = false;
  state.ballIndex = Math.floor(Math.random() * 3);

  setMessage('Observa la bolita...');
  revealBall(state.ballIndex);

  await sleep(1200);

  hideBall(state.ballIndex);
  await shuffleCups();

  state.canPick = true;
  setMessage('¿Dónde está la bolita?');
}

async function pickCup(index) {
  if (!state.canPick) return;
  state.canPick = false;

  const correct = index === state.ballIndex;
  revealBall(state.ballIndex);

  if (correct) {
    state.points += DIFFICULTY[state.difficulty].points;
    state.hits++;
    setMessage('¡Correcto!');
  } else {
    state.miss++;
    setMessage(`Fallaste 😢 Era el vaso ${state.ballIndex + 1}`);
  }

  updateStats();
  await sleep(1500);
  hideBall(state.ballIndex);

  if (state.round >= state.totalRounds) {
    endGame();
  } else {
    state.round++;
    updateStats();
    setMessage('Siguiente ronda...');
  }
}

/* SHUFFLE */
async function shuffleCups() {
  const { shuffles, speed } = DIFFICULTY[state.difficulty];

  for (let i = 0; i < shuffles; i++) {
    let a, b;
    do {
      a = Math.floor(Math.random() * 3);
      b = Math.floor(Math.random() * 3);
    } while (a === b);

    await swapCups(a, b);

    if (state.ballIndex === a) state.ballIndex = b;
    else if (state.ballIndex === b) state.ballIndex = a;

    await sleep(speed * 0.5);
  }
}

async function swapCups(a, b) {
  const cupA = cups[a];
  const cupB = cups[b];

  const rectA = cupA.getBoundingClientRect();
  const rectB = cupB.getBoundingClientRect();
  const dx = rectB.left - rectA.left;

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

/* CUP */
function revealBall(index) {
  placeBall(index);
  ball.style.opacity = '1';
  liftCup(index);
}

function hideBall(index) {
  lowerCup(index);
  ball.style.opacity = '0';
}

function liftCup(i) {
  cups[i].classList.add('lift');
  ball.classList.add('lift');
}

function lowerCup(i) {
  cups[i].classList.remove('lift');
  ball.classList.remove('lift');
}

/* RESET */
function resetGame() {
  clearInterval(state.timer);
  state = { ...state, phase: 'idle', round: 1, points: 0, hits: 0, miss: 0, time: 0 };

  updateStats();
  DOM.time.textContent = '0:00';
  ball.style.opacity = '0';
  cups.forEach(c => c.classList.remove('lift'));
  setMessage('Juego reiniciado');
  resetOrder();
}

function resetOrder() {
  cups = getCups();
  cups.forEach(c => DOM.cupsContainer.appendChild(c));
}

/* END */
function endGame() {
  clearInterval(state.timer);
  setMessage(`Juego terminado 🎉 Puntos: ${state.points}`);
}

function setMessage(msg) {
  DOM.gameMessage.textContent = msg;
}
