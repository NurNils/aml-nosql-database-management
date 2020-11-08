import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  app: {
    baseUrl: 'https://lmf.software/',
  },
  api: {
    baseUrl: 'https://api.lmf.software/',
  },
};
