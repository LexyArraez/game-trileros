/* BALL */
function placeBall(index) {
  const cup = cups[index];
  const cupRect = cup.getBoundingClientRect();
  const contRect = DOM.tableArea.getBoundingClientRect();

  ball.style.left = (cupRect.left - contRect.left + cupRect.width / 2 - 10) + 'px';
  ball.style.top  = (cupRect.top  - contRect.top  + cupRect.height - 24) + 'px';
}

function getCups() {
  return [
    document.getElementById('cup-1'),
    document.getElementById('cup-2'),
    document.getElementById('cup-3'),
  ];
}

function initGame() {
  cups = getCups();
  ball = document.querySelector('.ball');

  cups.forEach((cup, i) => cup.addEventListener('click', () => pickCup(i)));

  document.querySelector('.start-game').addEventListener('click', startGame);
  document.querySelector('.reset-game').addEventListener('click', resetGame);
  document.getElementById('menuBtn').addEventListener('click', toggleMenu);

  document.querySelectorAll('.button-difficulty button').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn, btn.dataset.difficulty));
  });
}

initGame();
