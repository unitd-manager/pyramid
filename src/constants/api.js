import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();
let baseURL;

const { hostname } = window.location;
console.log('prod',process.env.REACT_APP_PRODUCTION_URL)

if (hostname === 'pyramid.unitdtechnologies.com') {
  baseURL = process.env.REACT_APP_PRODUCTION_URL;
} else if (hostname === 'pyramidtest.unitdtechnologies.com') { 
  baseURL = process.env.REACT_APP_TEST_URL;
} else {
  baseURL = process.env.REACT_APP_PRODUCTION_URL;
}

console.log('Current Hostname:', hostname,baseURL);
const api = axios.create({
  baseURL,
});

export default api;


