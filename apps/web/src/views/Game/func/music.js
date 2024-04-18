import aTypeMusic from '../../../assets/sounds/a-Type_Remix.mp3';

const music = new Audio();

export const Music = {
  init: () => {
    music.src = aTypeMusic;
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
