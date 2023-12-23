import axios from 'axios'

// Define the base URL(s) conditionally
// let baseURL;

// if (process.env.NODE_ENV === 'production') {
//   baseURL = 'http://43.228.126.245:5001';
// } else {
//   baseURL = 'http://localhost:5001';
// }

// console.log('NODE_ENV:', process.env.NODE_ENV);
// const api = axios.create({
//   baseURL, // Use the baseURL variable here
// });

const api = axios.create({
//baseURL: 'http://43.228.126.245:4011',
 baseURL: 'http://localhost:6001',

});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api