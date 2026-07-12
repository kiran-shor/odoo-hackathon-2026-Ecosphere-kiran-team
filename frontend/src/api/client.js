import axios from 'axios';
import { mockAdapter } from './mockApi';

const API_MODE_STORAGE_KEY = 'ecosphere-api-mode';
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_MODES = {
  backend: 'backend',
  mock: 'mock',
};

export function getApiMode() {
  if (typeof window !== 'undefined') {
    const savedMode = window.localStorage.getItem(API_MODE_STORAGE_KEY);
    if (savedMode === API_MODES.backend || savedMode === API_MODES.mock) {
      return savedMode;
    }
  }

  return import.meta.env.VITE_USE_MOCK_API === 'true'
    ? API_MODES.mock
    : API_MODES.backend;
}

export function setApiMode(mode) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(API_MODE_STORAGE_KEY, mode);
}

const client = axios.create({
  baseURL: API_BASE_URL,
});

if (getApiMode() === API_MODES.mock) {
  client.defaults.adapter = mockAdapter;
}

export default client;
