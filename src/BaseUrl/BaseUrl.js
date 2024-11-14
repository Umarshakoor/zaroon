import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const BASEURL = 'http://84.247.185.76:8006'; //Testing
export const BASEURL = 'http://84.247.185.76:8684'; // Client

const instance = axios.create({
  //   baseURL: 'http://84.247.185.76:8006/api', //Testing
  baseURL: 'http://84.247.185.76:8684/api', // Client
});

instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
