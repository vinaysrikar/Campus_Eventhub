import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, just reject the promise — don't touch localStorage or redirect.
// AuthContext handles session management. The interceptor should NEVER redirect.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP:   (email: string)              => api.post("/auth/send-otp",   { email }),
  verifyOTP: (email: string, code: string)=> api.post("/auth/verify-otp", { email, code }),
  register:  (data: object)               => api.post("/auth/register",   data),
  login:     (data: object)               => api.post("/auth/login",      data),
  me:        ()                           => api.get("/auth/me"),
};

export const eventsAPI = {
  getAll:  (params?: object) => api.get("/events",      { params }),
  getOne:  (id: string)      => api.get(`/events/${id}`),
  getStats:()                => api.get("/events/stats"),
  create:  (data: object)    => api.post("/events",     data),
  update:  (id: string, data: object) => api.put(`/events/${id}`, data),
  delete:  (id: string)      => api.delete(`/events/${id}`),
};

export const registrationsAPI = {
  register:    (data: object)      => api.post("/registrations",              data),
  getForEvent: (eventId: string)   => api.get(`/registrations/event/${eventId}`),
};

export const organizersAPI = {
  getAll: (params?: object) => api.get("/organizers", { params }),
};

export const uploadAPI = {
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post("/upload/event-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
