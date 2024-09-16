import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export const initializeAxiosInterceptors = (navigate: ReturnType<typeof useNavigate>) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.data && error.response.data.Content) {
        const content = error.response.data.Content;
        const fileName = error.response.data.FileName;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        navigate('serverdown');
      }
      else if (!error.response) {
        navigate('serverdown');
      } 
      return Promise.reject(error);
    }
  );
};

export default api;
