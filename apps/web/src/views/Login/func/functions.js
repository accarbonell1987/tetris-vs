export const isExpiredDate = saveTime => {
  console.log(saveTime);
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
  if (Date.now() - saveTime > EXPIRATION_TIME) {
    return true;
  } else {
    return false;
  }
};
