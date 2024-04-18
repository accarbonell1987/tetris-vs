import originalTetrisSound from '../../../assets/sounds/tetris.mp3';

const music = new Audio(originalTetrisSound);

export const Music = {
  init: () => {
    music.src = originalTetrisSound;
    music.loop = true;
    music.volume = 0.2;
  },
  play: () => {
    music.play();
  },
  pause: () => {
    music.pause();
  }
};
