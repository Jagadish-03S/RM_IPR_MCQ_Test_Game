import axios from 'axios';

// Wipe any previous mock storage keys so only real database data is used
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('rm_ipr_storage_attempts');
    localStorage.removeItem('rm_ipr_storage_students');
    localStorage.removeItem('rm_ipr_storage_config');
  } catch {
    // Ignore in non-browser environments
  }
}

// Connect directly to your live Render backend
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? '/api'
    : 'https://rm-ipr-mcq-test-game.onrender.com/api');

export const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach student or admin token automatically
api.interceptors.request.use((config) => {
  const studentToken = localStorage.getItem('rm_ipr_student_session');
  const adminToken = localStorage.getItem('rm_ipr_admin_token');

  // If request is to admin route or downloads route, prioritize admin token
  if (config.url?.startsWith('/admin') || config.url?.startsWith('/downloads/admin-report')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else if (config.url?.startsWith('/downloads')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
    }
  } else if (studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }

  return config;
});

// Student APIs - Connected directly to your real Render database
export const studentApi = {
  login: (fullName: string, usn: string) => api.post('/student/login', { fullName, usn }),
  getAttempt: () => api.get('/student/attempt'),
  getModuleQuestions: (moduleId: number) => api.get(`/student/module/${moduleId}`),
  saveAnswer: (questionId: string, selectedOption: string | null) =>
    api.post('/student/save-answer', { questionId, selectedOption }),
  submitModule: (moduleId: number, timeTakenSeconds?: number) =>
    api.post('/student/submit-module', { moduleId, timeTakenSeconds }),
  sendFocusEvent: (moduleId: number, eventType: string, durationAwayMs?: number) =>
    api.post('/student/focus-event', { moduleId, eventType, durationAwayMs }),
  restartTest: () => api.post('/student/restart'),
  getResults: () => api.get('/student/results')
};

// Admin APIs - Connected directly to your real Render database
export const adminApi = {
  login: (credentials: { email: string; password: string }) => api.post('/admin/login', credentials),
  getMe: () => api.get('/admin/me'),
  getDashboard: () => api.get('/admin/dashboard'),
  getAttempts: (params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string }) =>
    api.get('/admin/attempts', { params }),
  getAttemptDetail: (id: string) => api.get(`/admin/attempts/${id}`),
  resetAttempt: (id: string) => api.post(`/admin/attempts/${id}/reset`),
  deleteAttempt: (id: string) => api.delete(`/admin/attempts/${id}`),
  getConfig: () => api.get('/admin/config'),
  updateConfig: (data: any) => api.put('/admin/config', data)
};
