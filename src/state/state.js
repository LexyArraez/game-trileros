export const state = {
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
  time: 0,
};

export const cups = [];
export let ballEl = null;

export function setBall(el) { ballEl = el; }

export function setCups(arr) {
  cups.length = 0;
  cups.push(...arr);
}

export function resetState() {
  Object.assign(state, {
    phase: 'idle', round: 1, points: 0, hits: 0, miss: 0, time: 0,
  });
}
