import { AUDIO } from './audio-data.js';

export function playSound(type) {
  const path = AUDIO[type];
  if (!path) return;
  const audio = new Audio(path);
  audio.play();
}
