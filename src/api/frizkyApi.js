import axios from 'axios';

// Creamos una instancia preconfigurada de Axios
const frizkyApi = axios.create({
    baseURL: 'http://localhost:5015/api',
});

export default frizkyApi;