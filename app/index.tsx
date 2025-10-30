import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterBar from '../src/components/FilterBar';
import TaskForm from '../src/components/TaskForm';
import TaskItem from '../src/components/TaskItem';
import { useTaskStore } from '../src/store/taskStore';
import { Task } from '../src/types';

// Asegúrate de tener el logo en la carpeta assets
const LOGO_IMAGE = require('../assets/cashea-logo.png'); // Cambia esta ruta por la de tu logo

function MainApp(): JSX.Element {
  const {
    tasks,
    filters,
    loading,
    error,
    serverAvailable,
    loadTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateFilters,
    getFilteredTasks,
    clearError,
    retryConnection,
  } = useTaskStore();

  const filteredTasks = getFilteredTasks();

  // Cargar tareas al iniciar la app
  useEffect(() => {
    loadTasks();
  }, []);

  // Mostrar errores
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Información', 
        error,
        [
          { text: 'OK', onPress: clearError },
          !serverAvailable ? { text: 'Reintentar', onPress: retryConnection } : null,
        ].filter(Boolean)
      );
    }
  }, [error]);

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTask}
      onDelete={deleteTask}
      loading={loading}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Tareas</Text>
        
        {/* Indicador de estado del servidor */}
        {!serverAvailable && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              Modo sin conexión al servidor
            </Text>
            <TouchableOpacity onPress={retryConnection} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TaskForm onAddTask={addTask} loading={loading} />
        
        <FilterBar
          filters={filters}
          onUpdateFilters={updateFilters}
        />

        {loading && tasks.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando tareas...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item: Task) => item.id}
            renderItem={renderTaskItem}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {loading ? 'Cargando...' : `No hay tareas ${filters.status !== 'all' ? filters.status : ''}`}
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
            refreshing={loading}
            onRefresh={loadTasks}
          />
        )}
        
        {/* Sección de estadísticas y logo */}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              Total: {tasks.length} | 
              Completadas: {tasks.filter(t => t.completed).length} | 
              Pendientes: {tasks.filter(t => !t.completed).length}
            </Text>
            {!serverAvailable && <Text style={styles.offlineIndicator}>🔴</Text>}
            {loading && <ActivityIndicator size="small" color="#007AFF" />}
          </View>
          
          {/* Logo y crédito */}
          <View style={styles.logoContainer}>
            <Text style={styles.challengeText}>Challenge by</Text>
            <Image 
              source={LOGO_IMAGE} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App(): JSX.Element {
  return (
    <PaperProvider>
      <MainApp />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  offlineBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  offlineText: {
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  offlineIndicator: {
    fontSize: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 30,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  challengeText: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  logo: {
    width: 100,
    height: 100,
  },
});