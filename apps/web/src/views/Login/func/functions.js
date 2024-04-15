export const isExpiredDate = saveTime => {
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
  return Date.now() - saveTime > EXPIRATION_TIME;
};
