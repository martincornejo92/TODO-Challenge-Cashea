import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { taskAPI } from '../services/api';
import { Filters, Task, TaskFormData, TaskStore } from '../types';

// Datos mock para cuando el servidor no esté disponible
const mockTasks: Task[] = [
  {
    id: '1',
    text: 'Tarea de ejemplo 1',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Tarea de ejemplo 2',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: {
        status: 'all',
        priority: 'all',
      },
      loading: false,
      error: null,
      serverAvailable: true,

      // Actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setServerAvailable: (available: boolean) => set({ serverAvailable: available }),


      loadTasks: async (): Promise<void> => {
        try {
          set({ loading: true, error: null });
          
          const isServerHealthy = await taskAPI.healthCheck();
          set({ serverAvailable: isServerHealthy });

          if (isServerHealthy) {
            const tasks = await taskAPI.getAll();
            set({ tasks, loading: false, serverAvailable: true });
          } else {
            set({ 
              tasks: mockTasks, 
              loading: false, 
              serverAvailable: false,
              error: 'Usando datos de demostración. El servidor no está disponible.' 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          console.warn('Falling back to mock data due to:', errorMessage);
          
          set({ 
            tasks: mockTasks, 
            loading: false, 
            serverAvailable: false,
            error: `Servidor no disponible. Usando datos de demostración. (${errorMessage})` 
          });
        }
      },

      addTask: async (taskData: TaskFormData): Promise<void> => {
        try {
          set({ loading: true, error: null });
          
          const { serverAvailable } = get();
          
          if (serverAvailable) {
            const newTask = await taskAPI.create(taskData);
            set((state) => ({
              tasks: [...state.tasks, newTask],
              loading: false,
            }));
          } else {
            const newTask: Task = {
              ...taskData,
              id: Date.now().toString(),
              completed: false,
              createdAt: new Date().toISOString(),
            };
            
            set((state) => ({
              tasks: [...state.tasks, newTask],
              loading: false,
              error: 'Tarea agregada localmente (servidor no disponible)'
            }));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
          console.error('Error adding task:', error);
        }
      },

      toggleTask: async (taskId: string): Promise<void> => {
        try {
          const task = get().tasks.find(t => t.id === taskId);
          if (!task) return;

          const { serverAvailable } = get();
          
          if (serverAvailable) {
            const updatedTask = await taskAPI.toggleComplete(taskId, !task.completed);
            set((state) => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? updatedTask : t
              ),
            }));
          } else {
            set((state) => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage });
          console.error('Error toggling task:', error);
        }
      },

      deleteTask: async (taskId: string): Promise<void> => {
        try {
          const { serverAvailable } = get();
          
          if (serverAvailable) {
            await taskAPI.delete(taskId);
          }
          
          set((state) => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage });
          console.error('Error deleting task:', error);
        }
      },

      updateFilters: (newFilters: Partial<Filters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },


      getFilteredTasks: (): Task[] => {
        const { tasks, filters } = get();
        
        return tasks.filter(task => {
          if (filters.status === 'completed' && !task.completed) return false;
          if (filters.status === 'pending' && task.completed) return false;
          
          if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
          
          return true;
        });
      },

      clearError: () => set({ error: null }),

      retryConnection: async (): Promise<void> => {
        try {
          set({ loading: true, error: null });
          const isServerHealthy = await taskAPI.healthCheck();
          
          if (isServerHealthy) {
            const tasks = await taskAPI.getAll();
            set({ 
              tasks, 
              loading: false, 
              serverAvailable: true,
              error: null 
            });
          } else {
            set({ 
              loading: false, 
              serverAvailable: false,
              error: 'El servidor sigue sin estar disponible' 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ 
            loading: false, 
            serverAvailable: false,
            error: errorMessage 
          });
        }
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        tasks: state.tasks,
        filters: state.filters 
      }),
    }
  )
);