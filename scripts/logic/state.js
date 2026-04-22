export const state = {
  phase:       'idle',
  difficulty:  'easy',
  round:       1,
  totalRounds: 5,
  points:      0,
  hits:        0,
  miss:        0,
  ballIndex:   0,
  canPick:     false,
  timer:       null,
  time:        0,
  cups:        [],
  ball:        null,
};

export function getCups() {
  return [
    document.getElementById('cup-1'),
    document.getElementById('cup-2'),
    document.getElementById('cup-3'),
  ];
}
