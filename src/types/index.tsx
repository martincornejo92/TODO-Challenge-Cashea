export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'all' | 'completed' | 'pending';
export type PriorityFilter = 'all' | Priority;  // 'all' incluido aquí

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface TaskFormData {
  text: string;
  priority: Priority;
}

export interface Filters {
  status: TaskStatus;
  priority: PriorityFilter; 
}

export interface TaskStore {
  tasks: Task[];
  filters: Filters;
  loading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadTasks: () => Promise<void>;
  addTask: (taskData: TaskFormData) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateFilters: (newFilters: Partial<Filters>) => void;
  getFilteredTasks: () => Task[];
  clearError: () => void;
}