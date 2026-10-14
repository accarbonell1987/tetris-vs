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
    if (music.src) return; // keep the player's mute choice across matches
    music.src = aTypeMusic;
    music.loop = true;
    music.volume = 0.2;
    music.muted = true; // starts muted by default
  },

  /** Reproduce la música */
  play: () => {
    music.play().catch(() => {}); // autoplay can be blocked until the user interacts
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
