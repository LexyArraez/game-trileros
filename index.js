function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
  document.getElementById('usersBlock').classList.toggle('active');
}

const DIFFICULTY = {
  easy: { shuffles: 3, speed: 800, points: 100 },
  medium: { shuffles: 6, speed: 500, points: 200 },
  hard: { shuffles: 10, speed: 300, points: 400 },
};

let state = {
  phase: 'idle',
  difficulty: 'easy',
  round: 1,
  totalRounds: 5,
  points: 0,
  hits: 0,
  miss: 0,
  ballIndex: 0,
  canPick: false,
  timer: null,
  time: 0
};

let cups = [];
let ball;
