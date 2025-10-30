import axios from 'axios';
import { Platform } from 'react-native';
import { Task, TaskFormData } from '../types';

// Para Android emulador: 10.0.2.2
// Para iOS emulador: localhost
// Para dispositivo físico: IP de tu computadora
const getBaseURL = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001'; // Android emulator
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:3001'; // iOS simulator
    } else {
      // Para web o casos específicos
      return 'http://localhost:3001';
    }
  }
  return 'http://localhost:3001'; // Production
};

const API_BASE_URL = getBaseURL();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    console.error('URL:', error.config?.baseURL + error.config?.url);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar al servidor. Verifica que json-server esté ejecutándose en el puerto 3001.');
    } else if (error.message.includes('Network Error')) {
      throw new Error('Error de red. Verifica tu conexión y que el servidor esté corriendo.');
    } else if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
    } else {
      throw new Error('Error desconocido de conexión');
    }
  }
);

export const taskAPI = {
  // Obtener todas las tareas
  getAll: async (): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  // Obtener tarea por ID
  getById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Crear nueva tarea
  create: async (task: TaskFormData): Promise<Task> => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const response = await api.post<Task>('/tasks', newTask);
    return response.data;
  },

  // Actualizar tarea
  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  },

  // Eliminar tarea
  delete: async (id: string): Promise<string> => {
    await api.delete(`/tasks/${id}`);
    return id;
  },

  // Actualizar estado de completado
  toggleComplete: async (id: string, completed: boolean): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, { completed });
    return response.data;
  },

  // Verificar salud del servidor
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/tasks');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

export default api;