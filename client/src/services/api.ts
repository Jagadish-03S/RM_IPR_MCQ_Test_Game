import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

// Attach student or admin token automatically
api.interceptors.request.use((config) => {
  const studentToken = localStorage.getItem('rm_ipr_student_session');
  const adminToken = localStorage.getItem('rm_ipr_admin_token');

  // If request is to admin route, prioritize admin token
  if (config.url?.startsWith('/admin') || config.url?.startsWith('/downloads/admin-report')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else if (studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }

  return config;
});

// Student APIs
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

// Admin APIs
export const adminApi = {
  login: (credentials: { email: string; password: string }) => api.post('/admin/login', credentials),
  getMe: () => api.get('/admin/me'),
  getDashboard: () => api.get('/admin/dashboard'),
  getAttempts: (params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string }) =>
    api.get('/admin/attempts', { params }),
  getAttemptDetail: (id: string) => api.get(`/admin/attempts/${id}`),
  resetAttempt: (id: string) => api.post(`/admin/attempts/${id}/reset`),
  getConfig: () => api.get('/admin/config'),
  updateConfig: (data: any) => api.put('/admin/config', data)
};

