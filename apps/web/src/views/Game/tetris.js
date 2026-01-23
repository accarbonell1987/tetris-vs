import { Game } from './classes/game';
import { NextChipPlayer } from './canvas/nextChip';
import { setGameToEvents } from './func/events';

/**
 * Instancias globales del motor del juego.
 */
const game = new Game(); // El motor principal del juego
const nextChipPlayer1 = new NextChipPlayer(1); // Preview para P1
const nextChipPlayer2 = new NextChipPlayer(2); // Preview para P2

// Inyectar el objeto game a los eventos para que los teclados puedan controlarlo
setGameToEvents(game);

/**
 * Función que arranca el motor del juego.
 * Vincula los estados de React y comienza el bucle de animación.
 * @param {Object} state - Estados y setters de React.
 */
export const inject = state => {
  game.inject(state);
  game.init();
  nextChipPlayer1.init();
  nextChipPlayer2.init();

  animate();
};

/**
 * Bucle de animación (Game Loop).
 * Se ejecuta aproximadamente 60 veces por segundo.
 */
const animate = (time = 0) => {
  requestAnimationFrame(animate);

  // Limpiamos los canvas en cada frame para redibujar
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

  nextChipPlayer1.context.clearRect(
    0,
    0,
    nextChipPlayer1.canvas.width,
    nextChipPlayer1.canvas.height
  );

  nextChipPlayer2.context.clearRect(
    0,
    0,
    nextChipPlayer2.canvas.width,
    nextChipPlayer2.canvas.height
  );

  // Actualizamos la lógica y el dibujado de todo el juego
  game.update(time, nextChipPlayer1, nextChipPlayer2);
};
