import { state, getCups }           from '../logic/state.js';
import { pickCup, startGame, resetGame } from '../logic/game.js';

export function initGame() {
  state.cups = getCups();
  state.ball = document.querySelector('.ball');

  state.cups.forEach((cup, i) => {
    cup.onclick = () => pickCup(i);
  });

  document.querySelector('.start-game').onclick = startGame;
  document.querySelector('.reset-game').onclick = resetGame;
}

initGame();
