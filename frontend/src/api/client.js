import axios from 'axios';
import { mockAdapter } from './mockApi';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

if (import.meta.env.VITE_USE_MOCK_API === 'true') {
  client.defaults.adapter = mockAdapter;
}

export default client;
