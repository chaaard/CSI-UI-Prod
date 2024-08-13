import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export const initializeAxiosInterceptors = (navigate: ReturnType<typeof useNavigate>) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        navigate('serverdown');
      }
      return Promise.reject(error);
    }
  );
};

export default api;
