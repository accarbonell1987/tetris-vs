import { SESSION_EXPIRY_MS } from '../../../config/constants.js';

export const isExpiredDate = saveTime => {
  if (!saveTime) return true;

  return Date.now() - saveTime > SESSION_EXPIRY_MS;
};
