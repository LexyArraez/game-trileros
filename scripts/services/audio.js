import { AUDIO } from '../config/audio.js';

export function playSound(type) {
  const path = AUDIO[type];
  if (!path) return;
  new Audio(path).play();
}
