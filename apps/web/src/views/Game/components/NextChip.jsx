const NextChipPresentational = ({ player }) => {
  const { id } = player;

  return <canvas id={`nextChipPlayer${id}-canvas`} width={100} height={100} color="black" />;
};

const NextChipContainer = ({ player }) => {
  return <NextChipPresentational player={player} />;
};

export default NextChipContainer;
