import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://fittnestrake.onrender.com/api/",
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error - please check if the server is running'));
    }
    
    // Handle specific error cases
    if (error.response.status === 409 || 
        (error.response.data && 
         (error.response.data.message?.toLowerCase().includes('duplicate') || 
          error.response.data.error?.toLowerCase().includes('duplicate')))) {
      return Promise.reject(new Error('This workout already exists for today. Please add a different workout.'));
    }
    
    // Handle other server errors
    const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
    return Promise.reject(new Error(errorMessage || 'An error occurred. Please try again.'));
  }
);

// Authentication endpoints
export const UserSignUp = async (data) => {
  const response = await API.post("/user/signup", data);
  return response;
};

export const UserSignIn = async (data) => {
  const response = await API.post("/user/signin", data);
  return response;
};

// Dashboard endpoints
export const getDashboardDetails = async (token) => {
  const response = await API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

// Workout endpoints
export const getWorkouts = async (token, date) => {
  const response = await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const addWorkout = async (token, data) => {
  const response = await API.post("/user/workout", data, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response;
};

export const updateWorkout = async (token, workoutId, data) => {
  const response = await API.put(`/user/workout/${workoutId}`, data, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response;
};

export const deleteWorkout = async (token, workoutId) => {
  const response = await API.delete(`/user/workout/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
