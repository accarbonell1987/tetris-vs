import aTypeMusic from '../../../assets/sounds/a-Type_Remix.mp3';

const music = new Audio();

/**
 * Objeto para controlar la música de fondo del juego.
 */
export const Music = {
  /**
   * Configura la fuente, el bucle y el volumen inicial.
   */
  init: () => {
    music.src = aTypeMusic;
    music.loop = true;
    music.volume = 0.2;
  },

  /** Reproduce la música */
  play: () => {
    music.play();
  },

  /** Pausa la música */
  pause: () => {
    music.pause();
  },

  /** Alterna entre silenciado y sonido */
  mute: () => {
    music.muted = !music.muted;
  },

  /** Retorna si la música está silenciada */
  isMuted: () => !!music.muted
};
