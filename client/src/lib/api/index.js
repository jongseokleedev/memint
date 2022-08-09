import axiosInstance from 'axios';

const axios = axiosInstance.create({
  baseURL: 'http://localhost:5000',
});

export default axios;
