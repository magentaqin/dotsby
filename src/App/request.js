import axios from 'axios';

const baseURL = `http://localhost:4000`;

export const httpRequest = axios.create({
  baseURL,
  timeout: 30000
})
