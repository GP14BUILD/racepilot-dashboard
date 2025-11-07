import axios from 'axios';
import type { Session, TrackPoint } from './types';

const API_URL = 'https://racepilot-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSessions = async (): Promise<Session[]> => {
  const response = await api.get('/sessions');
  return response.data;
};

export const getSession = async (id: number): Promise<Session> => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};

export const getSessionPoints = async (id: number): Promise<TrackPoint[]> => {
  const response = await api.get(`/sessions/${id}/points`);
  return response.data;
};

export default api;
