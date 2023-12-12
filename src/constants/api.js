import axios from 'axios';

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://43.228.126.245:4011';
} else {
  baseURL = 'http://43.228.126.245:4011';
}

console.log('NODE_ENV:', process.env.NODE_ENV);
const api = axios.create({
  baseURL,
});

export default api;