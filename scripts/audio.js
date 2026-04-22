
/* inicio de sonido */
function playSound(type) {
  const path = AUDIO[type];

  if (!path) return;

  const audio = new Audio(path);
  audio.play();
}