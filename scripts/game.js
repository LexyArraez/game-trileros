/* GAME */

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
function startGame() {
    const existPlayer = localStorage.getItem('playerName');
    if (!existPlayer) {
        registerPlayer();
    } else {
        if (state.phase === 'idle') startTimer();
        startRound();
    }
}
function registerPlayer() {
    const modal = document.getElementById('modal');
    const input = document.getElementById('playerName');
    const btnGuardar = document.getElementById("btnGuardar");
    const errorMsg = document.getElementById('error');

    const name = input.value.trim();

    modal.style.display = 'block';

    btnGuardar.addEventListener('click', () => {
        const name = input.value.trim();

        if (name.length < 2 || name == '') {
            errorMsg.style.display = 'block';
            return;
         } 
         else { 
            errorMsg.style.display = 'none';
            localStorage.setItem('playerName', name);
            btnGuardar.style.display = 'block';
         }
        modal.style.display = 'none';
        return name;
    });
}

async function startRound() {
    const jugador = localStorage.getItem('playerName') || 'Jugador';
    state.phase = 'showing';
    state.canPick = false;

    state.ballIndex = Math.floor(Math.random() * 3);

    setMessage(`${jugador} Observa la bolita...`);

    placeBall(state.ballIndex);
    ball.style.opacity = '1';
    liftCup(state.ballIndex);

    await sleep(1200);

    lowerCup(state.ballIndex);
    ball.style.opacity = '0';

    await shuffleCups();

    state.canPick = true;
    
    setMessage(`¿Dónde está la bolita ${jugador}?`);
}

function pickCup(index) {
    if (!state.canPick) return;

    state.canPick = false;

    const correct = index === state.ballIndex;

    placeBall(state.ballIndex);
    ball.style.opacity = '1';
    liftCup(state.ballIndex);

    if (correct) {
        state.points += DIFFICULTY[state.difficulty].points;
        state.hits++;
         playSound("hit")
        setMessage('¡Correcto!');
    } else {
        state.miss++;
        playSound("miss")
        setMessage(`Fallaste 😢 Era el vaso ${state.ballIndex + 1}`);
    }

    updateStats();

    setTimeout(() => {
        lowerCup(state.ballIndex);
        ball.style.opacity = '0';

        if (state.round >= state.totalRounds) {
            endGame();
        } else {
            state.round++;
            updateStats();
            setMessage('Siguiente ronda...');
        }
    }, 1500);
}

/* SHUFFLE */
async function shuffleCups() {
    const cfg = DIFFICULTY[state.difficulty];

    for (let i = 0; i < cfg.shuffles; i++) {
        let a, b;
        do {
            a = Math.floor(Math.random() * 3);
            b = Math.floor(Math.random() * 3);
        } while (a === b);

        await swapCups(a, b);

        if (state.ballIndex === a) state.ballIndex = b;
        else if (state.ballIndex === b) state.ballIndex = a;

        await sleep(cfg.speed * 0.5);
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

    document.getElementById('time').textContent = '0:00';
    updateStats();

    ball.style.opacity = '0';
    cups.forEach(c => c.classList.remove('lift'));
    localStorage.removeItem('playerName');
    setMessage('Juego reiniciado');

    resetOrder();
}

function resetOrder() {
    const container = document.querySelector('.cups-container');
    cups = getCups();
    cups.forEach(c => container.appendChild(c));
}

/* END */
function endGame() {
    clearInterval(state.timer);
    setMessage(`Juego terminado 🎉 Puntos: ${state.points}`);
}


function setMessage(msg) {
    document.getElementById('gameMessage').textContent = msg;
}

