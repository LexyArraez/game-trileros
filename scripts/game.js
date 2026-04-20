
/* inicio juego -- preparado por Yasira */
let positionBall = 0;
let gameStarted = false;
let canChooseCup = false;

const startBtn = document.querySelector(".start-game")

const gameMessage = document.getElementById("gameMessage")

/* mostrar la bolita de forma aleatoria */
function getRamdonCup() {
    return Math.floor((Math.random() * 3) + 1)
}

function startGame() {
    positionBall = getRamdonCup();
    console.log("la bolita esta en: ", positionBall)
    gameMessage.textContent = "Mira donde esta la bolita... para elegir un vaso"
    showBall(positionBall)
}


/* mostrar la bolita */

function showBall(capNumber) {
    const cup = document.getElementById(`cup-${capNumber}`);
    const ball = document.querySelector(".ball")
    const cupRect = cup.getBoundingClientRect();
    const tableRect = document.querySelector(".table-area").getBoundingClientRect();

    const left = cupRect.left - tableRect.left + cupRect.width / 2 - 12;
    const top = cupRect.top - tableRect.top + cupRect.height - 20;

   ball.style.left = `${left}px`;
ball.style.top = `${top}px`;
    ball.style.opacity = "1";
}
startBtn.addEventListener("click", startGame)


/* fin de inicio bolita */