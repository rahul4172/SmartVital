import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Predictions
  predictHeart: (data) => apiClient.post('/predict/heart', data),
  predictStroke: (data) => apiClient.post('/predict/stroke', data),
  predictDiabetes: (data) => apiClient.post('/predict/diabetes', data),
  predictLung: (data) => apiClient.post('/predict/lung', data),

  // Analytics
  getTimeline: () => apiClient.get('/predict/timeline'),
  getComorbidity: () => apiClient.get('/predict/comorbidity'),
  
  // Simulation
  getSimulationBaseline: () => apiClient.get('/predict/simulation/baseline'),
  runSimulation: (scenarios) => apiClient.post('/predict/simulation/run', { scenarios }),

  // IoT
  scanIoT: () => apiClient.get('/api/iot/scan'),
  connectIoT: (port_id) => apiClient.post('/api/iot/connect', { port_id }),
  disconnectIoT: () => apiClient.post('/api/iot/disconnect'),
  getIoTMode: (disease) => apiClient.get(`/api/iot/mode/${disease}`),
};
