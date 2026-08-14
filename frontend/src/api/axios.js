import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor 1: Attach token to outgoing requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor 2: Catch 401s and refresh the token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If we get a 401 and we haven't already retried this request...
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh');
                const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
                
                // Save the new access token
                localStorage.setItem('access', res.data.access);
                
                // Update the header and retry the original request
                api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh token is expired too, force user to log in again
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;