import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task, Priority } from '../types';

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

  const handleToggle = (): void => {
    console.log('🎯 Toggle task:', task.id, 'current completed:', task.completed);
    if (!loading) {
      onToggle(task.id);
    } else {
      console.log('⏳ Task is loading, cannot toggle');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskContent}>
        <TouchableOpacity 
          onPress={handleToggle}
          style={styles.checkboxContainer}
          disabled={loading}
        >
          <View style={[
            styles.customCheckbox,
            styles.checkboxWithBorder,
            task.completed && styles.customCheckboxChecked,
            task.completed && { backgroundColor: getPriorityColor(task.priority) }
          ]}>
            {task.completed && (
              <Icon name="check" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
        
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
          
          <View style={styles.taskMeta}>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) }
            ]}>
              <Text style={styles.priorityText}>
                {getPriorityText(task.priority)}
              </Text>
            </View>
            
            {task.completed && (
              <View style={styles.completedBadge}>
                <Icon name="check-circle" size={12} color="#44ff44" />
                <Text style={styles.completedBadgeText}>Completada</Text>
              </View>
            )}
            
            {/* Debug info */}
            <Text style={styles.debugText}>
              ID: {task.id.substring(0, 4)} | {task.completed ? '✅' : '⭕'}
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
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxWithBorder: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  customCheckboxChecked: {
    borderColor: 'transparent',
  },
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
    color: '#666',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '500',
  },
  debugText: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
});

export default TaskItem;