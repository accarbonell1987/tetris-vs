const NextChipPresentational = () => {
  return <h1></h1>;
};

const NextChipContainer = ({ player }) => {
  console.log('🚀 ~ NextChipContainer ~ player:', player);
  return <NextChipPresentational player={player} />;
};

export default NextChipContainer;
