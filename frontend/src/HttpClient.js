import axios from 'axios';

const httpClient = axios.create({
   baseURL: `http://localhost:${process.env.BACKEND_PORT || 5000}`
});

export {httpClient}