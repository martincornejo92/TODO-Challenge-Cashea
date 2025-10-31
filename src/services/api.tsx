import axios from 'axios';
import { Platform } from 'react-native';
import { Task, TaskFormData } from '../types';

// Configuración mejorada para debugging
const getBaseURL = (): string => {
  if (__DEV__) {
    // USA ESTA IP - LA QUE COMPARTISTE
    const YOUR_LOCAL_IP = '192.168.100.28';
    
    console.log('🎯 Using your IP:', YOUR_LOCAL_IP);
    
    // Para Expo Go siempre usa tu IP
    const url = `http://${YOUR_LOCAL_IP}:3001`;
    console.log('🔗 Final URL:', url);
    return url;
  }
  return 'http://localhost:3001';
};


const API_BASE_URL = getBaseURL();

console.log('🔄 API Base URL:', API_BASE_URL);
console.log('📱 Platform:', Platform.OS);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para debugging detallado
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    console.log('🔗 Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📊 Data received:', response.data.length, 'tasks');
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.message);
    console.error('🔗 URL Attempted:', error.config?.baseURL + error.config?.url);
    console.error('💻 Platform:', Platform.OS);
    console.error('🔄 Full Error:', JSON.stringify(error, null, 2));
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔍 Troubleshooting:');
      console.log('1. Verify json-server is running: npm run server');
      console.log('2. Check port 3001 is available');
      console.log('3. For Android emulator, try: http://10.0.2.2:3001');
      console.log('4. For iOS simulator, try: http://localhost:3001');
      
      throw new Error('No se puede conectar al servidor. Verifica que json-server esté ejecutándose en el puerto 3001.');
    } else if (error.message.includes('Network Error')) {
      throw new Error('Error de red. Verifica tu conexión y que el servidor esté corriendo.');
    } else if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
    } else {
      throw new Error('Error desconocido de conexión: ' + error.message);
    }
  }
);

export const taskAPI = {
  // Obtener todas las tareas
  getAll: async (): Promise<Task[]> => {
    try {
      console.log('🔄 Fetching tasks from:', API_BASE_URL + '/tasks');
      const response = await api.get<Task[]>('/tasks');
      console.log('✅ Tasks loaded successfully:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error in getAll:', error);
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
      console.log('🔍 Health check to:', API_BASE_URL + '/tasks');
      await api.get('/tasks');
      console.log('✅ Server health check passed');
      return true;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  },
};

export default api;