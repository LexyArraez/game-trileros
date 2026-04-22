import { toggleMenu }              from './ui/menu.js';
import { setDifficulty }           from './ui/counters.js';
import './ui/ball.js';
import './services/news.js';
import './services/weather.js';

document.getElementById('menuBtn')
  .addEventListener('click', toggleMenu);

document.querySelectorAll('.button-difficulty button').forEach(btn => {
  btn.addEventListener('click', () => setDifficulty(btn, btn.dataset.difficulty));
});
