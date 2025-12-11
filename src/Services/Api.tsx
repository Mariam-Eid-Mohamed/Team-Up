import axios from 'axios';


const Api = axios.create({
  baseURL: 'https://localhost:5000/api',
  withCredentials: true,});

export default Api