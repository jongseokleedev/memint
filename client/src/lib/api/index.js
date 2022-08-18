import axiosInstance from 'axios';

const axios = axiosInstance.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://memint-server.herokuapp.com/',
});

export default axios;
