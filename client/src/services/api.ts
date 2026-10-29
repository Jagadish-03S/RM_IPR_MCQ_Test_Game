import axios from 'axios';
import { mockStorage } from './mockStorage';

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

// Helper that tries backend first, and gracefully falls back to mockStorage when backend is not deployed
async function tryBackendOrFallback<T>(
  backendCall: () => Promise<T>,
  fallbackCall: () => any
): Promise<T> {
  try {
    return await backendCall();
  } catch (err: any) {
    // If backend is not available (e.g. on Vercel static deployment or server stopped)
    if (
      err.code === 'ERR_NETWORK' ||
      err.message === 'Network Error' ||
      err.response?.status === 404 ||
      err.response?.status === 405 ||
      err.response?.status === 502 ||
      err.response?.status === 503 ||
      err.response?.status === 504 ||
      !err.response
    ) {
      return await fallbackCall();
    }
    // If backend responded with a real application response (like 401 Invalid Credentials), rethrow
    throw err;
  }
}

// Student APIs
export const studentApi = {
  login: (fullName: string, usn: string) =>
    tryBackendOrFallback(
      () => api.post('/student/login', { fullName, usn }),
      () => mockStorage.studentLogin(fullName, usn)
    ),
  getAttempt: () =>
    tryBackendOrFallback(
      () => api.get('/student/attempt'),
      () => mockStorage.getStudentAttempt()
    ),
  getModuleQuestions: (moduleId: number) =>
    tryBackendOrFallback(
      () => api.get(`/student/module/${moduleId}`),
      () => mockStorage.getModuleQuestions(moduleId)
    ),
  saveAnswer: (questionId: string, selectedOption: string | null) =>
    tryBackendOrFallback(
      () => api.post('/student/save-answer', { questionId, selectedOption }),
      () => mockStorage.saveAnswer(questionId, selectedOption)
    ),
  submitModule: (moduleId: number, timeTakenSeconds?: number) =>
    tryBackendOrFallback(
      () => api.post('/student/submit-module', { moduleId, timeTakenSeconds }),
      () => mockStorage.submitModule(moduleId, timeTakenSeconds)
    ),
  sendFocusEvent: (moduleId: number, eventType: string, durationAwayMs?: number) =>
    tryBackendOrFallback(
      () => api.post('/student/focus-event', { moduleId, eventType, durationAwayMs }),
      () => mockStorage.sendFocusEvent(moduleId, eventType, durationAwayMs)
    ),
  restartTest: () =>
    tryBackendOrFallback(
      () => api.post('/student/restart'),
      () => mockStorage.restartTest()
    ),
  getResults: () =>
    tryBackendOrFallback(
      () => api.get('/student/results'),
      () => mockStorage.getResults()
    )
};

// Admin APIs
export const adminApi = {
  login: (credentials: { email: string; password: string }) =>
    tryBackendOrFallback(
      () => api.post('/admin/login', credentials),
      () => mockStorage.adminLogin(credentials)
    ),
  getMe: () =>
    tryBackendOrFallback(
      () => api.get('/admin/me'),
      () => ({
        data: {
          admin: {
            id: 'admin-super-01',
            name: 'Jagadish S',
            email: 'sjagadish89772@gmail.com',
            role: 'SUPER_ADMIN'
          }
        }
      })
    ),
  getDashboard: () =>
    tryBackendOrFallback(
      () => api.get('/admin/dashboard'),
      () => mockStorage.getDashboard()
    ),
  getAttempts: (params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string }) =>
    tryBackendOrFallback(
      () => api.get('/admin/attempts', { params }),
      () => mockStorage.getAttempts(params)
    ),
  getAttemptDetail: (id: string) =>
    tryBackendOrFallback(
      () => api.get(`/admin/attempts/${id}`),
      () => mockStorage.getAttemptDetail(id)
    ),
  resetAttempt: (id: string) =>
    tryBackendOrFallback(
      () => api.post(`/admin/attempts/${id}/reset`),
      () => mockStorage.resetAttempt(id)
    ),
  deleteAttempt: (id: string) =>
    tryBackendOrFallback(
      () => api.delete(`/admin/attempts/${id}`),
      () => mockStorage.deleteAttempt(id)
    ),
  getConfig: () =>
    tryBackendOrFallback(
      () => api.get('/admin/config'),
      () => mockStorage.getConfig()
    ),
  updateConfig: (data: any) =>
    tryBackendOrFallback(
      () => api.put('/admin/config', data),
      () => mockStorage.updateConfig(data)
    )
};
