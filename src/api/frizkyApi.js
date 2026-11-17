import axios from 'axios';

const frizkyApi = axios.create({
  baseURL: 'https://l8zgq091-5015.use.devtunnels.ms/api',
});

export default frizkyApi;