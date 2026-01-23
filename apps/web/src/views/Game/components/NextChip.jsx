/**
 * Componente que muestra el canvas donde se renderiza la siguiente pieza del jugador.
 * @param {Object} player - Datos del jugador.
 */
const NextChipPresentational = ({ player }) => {
  const { id } = player; // id del jugador (1 o 2)

  return (
    <section className="flex justify-center w-1/2 p-2 mb-2">
      {/* Canvas específico para mostrar la pieza 'en espera' */}
      <canvas id={`nextChipPlayer${id}-canvas`} height={100} />
    </section>
  );
};

/**
 * Contenedor para el componente de la siguiente pieza.
 */
const NextChipContainer = ({ player }) => {
  return <NextChipPresentational player={player} />;
};

export default NextChipContainer;
