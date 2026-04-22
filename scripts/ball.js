
/* BALL */
function placeBall(index) {
  const cup = cups[index];
  const container = document.querySelector('.table-area');

  const cupRect = cup.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();

  const x = cupRect.left - contRect.left + cupRect.width / 2 - 10;
  const y = cupRect.top - contRect.top + cupRect.height - 24;

  ball.style.left = x + 'px';
  ball.style.top = y + 'px';
}


/* INIT */
function initGame() {
  cups = getCups();

  ball = document.querySelector('.ball');

  cups.forEach((cup, i) => {
    cup.onclick = () => pickCup(i);
  });

  document.querySelector('.start-game').onclick = startGame;
  document.querySelector('.reset-game').onclick = resetGame;
}

initGame();
