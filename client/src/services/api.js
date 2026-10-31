import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

let customTokenGetter = null;

export const setAuthTokenGetter = (getterFn) => {
  customTokenGetter = getterFn;
};

// Request interceptor to attach Clerk bearer token
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;

      // 1. Try custom getter (from useAuth().getToken)
      if (customTokenGetter) {
        token = await customTokenGetter();
      }

      // 2. Fallback to window.Clerk session
      if (!token && window.Clerk?.session) {
        token = await window.Clerk.session.getToken();
      }

      // 3. If Clerk is still initializing, wait briefly and retry
      if (!token && window.Clerk && !window.Clerk.loaded) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (window.Clerk?.session) {
          token = await window.Clerk.session.getToken();
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to retrieve Clerk token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log clean, actionable console errors for any network failures or 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        `[API Network Error] Could not connect to backend server at "${error.config?.baseURL || api.defaults.baseURL}". ` +
        `Make sure your backend Express server is running on http://localhost:5000 and MongoDB is connected.`,
        error
      );
    } else {
      const status = error.response.status;
      if (status === 401) {
        console.warn(
          `[API 401 Unauthorized] Session token invalid or expired for ${error.config?.url}.`,
          error.response.data
        );
      } else if (status === 403) {
        console.warn(
          `[API 403 Forbidden] Not authorized for ${error.config?.url}.`,
          error.response.data
        );
      } else if (status >= 500) {
        console.error(
          `[API 500 Server Error] Backend failure on ${error.config?.url}:`,
          error.response.data
        );
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (!error.response
        ? 'Cannot connect to backend server. Make sure it is running on http://localhost:5000'
        : error.message || 'An unexpected error occurred');

    return Promise.reject(new Error(message));
  }
);

/**
 * Fetch transactions with optional filters (type, category, startDate, endDate)
 */
export const fetchTransactions = async (params = {}) => {
  const cleanParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      cleanParams[key] = value;
    }
  }
  const response = await api.get('/transactions', { params: cleanParams });
  return response.data;
};

/**
 * Create a new transaction
 */
export const createTransaction = async (data) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

/**
 * Delete a transaction by ID
 */
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

/**
 * Fetch financial summary (totals & category breakdown)
 */
export const fetchSummary = async () => {
  const response = await api.get('/transactions/summary');
  return response.data;
};

export default api;
