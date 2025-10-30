import React from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Priority, Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  loading: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, loading }) => {
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#666';
    }
  };

  const getPriorityText = (priority: Priority): string => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const handleDelete = (): void => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => onDelete(task.id), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskContent}>
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Checkbox
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={() => onToggle(task.id)}
            color="#007AFF"
            disabled={loading}
          />
        )}
        
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.taskText,
              task.completed && styles.completedText
            ]}
            numberOfLines={2}
          >
            {task.text}
          </Text>
          
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(task.priority) }
          ]}>
            <Text style={styles.priorityText}>
              {getPriorityText(task.priority)}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ff4444" />
        ) : (
          <Icon name="delete-outline" size={24} color="#ff4444" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  priorityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default TaskItem;