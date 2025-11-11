import axios from 'axios';
import type { Session, TrackPoint, RaceCourse, Maneuver, ManeuverStats, AnomalyDetectionResult, CoachingRecommendation, CoachingAnalysisResult, WindShift, WindPattern } from './types';

const API_URL = 'https://racepilot-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const getRaceCourses = async (): Promise<RaceCourse[]> => {
  const response = await api.get('/courses/courses');
  return response.data;
};

export const getRaceCourse = async (id: number): Promise<RaceCourse> => {
  const response = await api.get(`/courses/courses/${id}`);
  return response.data;
};

export const getSessionManeuvers = async (sessionId: number): Promise<Maneuver[]> => {
  const response = await api.get(`/ai/maneuvers/session/${sessionId}`);
  return response.data;
};

export const getManeuverStats = async (sessionId: number): Promise<ManeuverStats> => {
  const response = await api.get(`/ai/maneuvers/stats/${sessionId}`);
  return response.data;
};

export const detectAnomalies = async (sessionId: number, zThreshold: number = 2.0): Promise<AnomalyDetectionResult> => {
  const response = await api.post(`/ai/anomalies/detect/${sessionId}`, null, {
    params: { z_threshold: zThreshold }
  });
  return response.data;
};

export const getSessionAnomalies = async (sessionId: number): Promise<AnomalyDetectionResult> => {
  const response = await api.get(`/ai/anomalies/session/${sessionId}`);
  return response.data;
};

export const analyzeAndRecommend = async (sessionId: number): Promise<CoachingAnalysisResult> => {
  const response = await api.post(`/ai/coaching/analyze/${sessionId}`);
  return response.data;
};

export const getSessionCoaching = async (sessionId: number, limit: number = 50): Promise<{ session_id: number; total_recommendations: number; recommendations: CoachingRecommendation[] }> => {
  const response = await api.get(`/ai/coaching/session/${sessionId}`, {
    params: { limit }
  });
  return response.data;
};

export const dismissRecommendation = async (recommendationId: number): Promise<{ success: boolean }> => {
  const response = await api.post(`/ai/coaching/dismiss/${recommendationId}`);
  return response.data;
};

export const detectWindShifts = async (sessionId: number, minShiftDeg: number = 8.0): Promise<{ session_id: number; total_shifts_detected: number; shifts: any[] }> => {
  const response = await api.post(`/ai/wind/detect-shifts/${sessionId}`, null, {
    params: { min_shift_deg: minShiftDeg }
  });
  return response.data;
};

export const analyzeWindPattern = async (sessionId: number): Promise<WindPattern> => {
  const response = await api.post(`/ai/wind/analyze-pattern/${sessionId}`);
  return response.data;
};

export const getWindShifts = async (sessionId: number): Promise<{ session_id: number; total_shifts: number; shifts: WindShift[] }> => {
  const response = await api.get(`/ai/wind/shifts/${sessionId}`);
  return response.data;
};

export const getWindPattern = async (sessionId: number): Promise<WindPattern> => {
  const response = await api.get(`/ai/wind/pattern/${sessionId}`);
  return response.data;
};

export default api;
