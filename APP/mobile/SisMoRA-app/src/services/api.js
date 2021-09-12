import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
    baseURL: 'https://<PROJECT>.cloudfunctions.net/app'
 });

axiosRetry(api, { retries: 3 , retryDelay: axiosRetry.exponentialDelay});


export default api;