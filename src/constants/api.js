import axios from 'axios';

// Define the base URL(s) conditionally
//let baseURL;

// if (process.env.NODE_ENV === 'production') {
//   baseURL = 'http://43.228.126.245:3022';
// } else {
//   baseURL = 'http://localhost:3022';
// }
const baseURL = 'http://43.228.126.245:3022';
console.log('NODE_ENV:', process.env.NODE_ENV);
const api = axios.create({
  baseURL, // Use the baseURL variable here
  
});

export default api