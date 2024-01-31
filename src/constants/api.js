import axios from 'axios';

// Define the base URL(s) conditionally
let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://43.228.126.245:3022';
} else {
  baseURL = 'http://localhost:3022';
}

console.log('NODE_ENV:', process.env.NODE_ENV);
const api = axios.create({
<<<<<<< HEAD
//baseURL: 'http://43.228.126.245:4011',
baseURL: 'http://localhost:6001',


=======
  baseURL, // Use the baseURL variable here
>>>>>>> 1947c4fe09427a9dc328b9c522722ebd9eea1297
});


export default api;