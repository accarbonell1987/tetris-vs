import { version } from '../../package.json';

export const SystemServices = {
  healthCheck: (_, res) => {
    res.status(200).json('It works!');
  },
  systemVersion: (_, res) => {
    res.status(200).json(`${version}`);
  }
};
