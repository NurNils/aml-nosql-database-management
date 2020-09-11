import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: false,
  app: {
    baseUrl: 'http://localhost:4200/',
  },
  api: {
    baseUrl: 'http://localhost:3000/',
  },
};
