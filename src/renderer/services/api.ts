import axios from 'axios';
import { toast } from 'react-toastify';

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
    console.error(`ERROR_REST: ${error.response}`);

    if (error.response.data.status === 'error') {
      toast.error(error.response.data.message);
    }

    if (error.response.data.status === 'validation_error') {
      window.alert(JSON.stringify(error.response.data.errors));
    }

    return Promise.reject(error.response);
  }
);

export { api };
