import axios from 'axios';

const api = axios.create({
  baseURL: 'http://165.227.197.107:3333/api',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@mocha:token');

  if (token && config.headers) {
    config.headers.authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(`ERROR_REST: ${error.response.data}`);

    return Promise.reject(error.response);
  }
);

export { api };
