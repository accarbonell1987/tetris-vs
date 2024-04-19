const NextChipPresentational = ({ player }) => {
  const { id } = player;

  return (
    <section className="flex justify-center w-1/2 p-4">
      <canvas id={`nextChipPlayer${id}-canvas`} height={100} />
    </section>
  );
};

const NextChipContainer = ({ player }) => {
  return <NextChipPresentational player={player} />;
};

export default NextChipContainer;
