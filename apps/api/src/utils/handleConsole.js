/* eslint-disable no-console */
import { getCurrentDate } from './handleDates';

export const Console = {
  log: message => {
    console.log(`${getCurrentDate()} : Log => ${message}`);
  },
  error: message => {
    console.error(`${getCurrentDate()} : Error => ${message}`);
  },
  info: message => {
    console.info(`${getCurrentDate()} : Info => ${message}`);
  },
  warn: message => {
    console.warn(`${getCurrentDate()} : Warn => ${message}`);
  }
};
