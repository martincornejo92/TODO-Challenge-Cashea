import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Divider, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Priority, TaskFormData } from '../types';

interface TaskFormProps {
  onAddTask: (taskData: TaskFormData) => Promise<void>;
  loading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, loading }) => {
  const [text, setText] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSubmit = async (): Promise<void> => {
    if (text.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }

    if (loading) return;

    await onAddTask({
      text: text.trim(),
      priority,
    });

    // Limpiar el formulario solo si no hay error
    setText('');
    setPriority('medium');
  };

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
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      case 'low': return 'Baja Prioridad';
      default: return priority;
    }
  };

  const PriorityOption: React.FC<{ 
    value: Priority; 
    label: string; 
    onSelect: (value: Priority) => void;
    isSelected: boolean;
  }> = ({ value, label, onSelect, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.priorityOption,
        isSelected && styles.priorityOptionSelected
      ]}
      onPress={() => {
        onSelect(value);
        closeMenu();
      }}
    >
      <View style={styles.priorityOptionContent}>
        <View 
          style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(value) }
          ]} 
        />
        <Text style={[
          styles.priorityOptionText,
          isSelected && styles.priorityOptionTextSelected
        ]}>
          {label}
        </Text>
      </View>
      {isSelected && (
        <Icon name="check" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="¿Qué necesitas hacer?"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        editable={!loading}
      />
      
      <View style={styles.controls}>
        <View style={styles.priorityContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity 
                style={styles.prioritySelector}
                onPress={openMenu}
                disabled={loading}
              >
                <View style={styles.prioritySelectorContent}>
                  <View 
                    style={[
                      styles.currentPriorityDot,
                      { backgroundColor: getPriorityColor(priority) }
                    ]} 
                  />
                  <Text style={styles.prioritySelectorText}>
                    {getPriorityText(priority)}
                  </Text>
                  <Icon 
                    name={menuVisible ? "arrow-drop-up" : "arrow-drop-down"} 
                    size={24} 
                    color="#666" 
                  />
                </View>
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Seleccionar Prioridad</Text>
            </View>
            <Divider />
            <PriorityOption 
              value="high" 
              label="Alta Prioridad" 
              onSelect={setPriority}
              isSelected={priority === 'high'}
            />
            <Divider />
            <PriorityOption 
              value="medium" 
              label="Media Prioridad" 
              onSelect={setPriority}
              isSelected={priority === 'medium'}
            />
            <Divider />
            <PriorityOption 
              value="low" 
              label="Baja Prioridad" 
              onSelect={setPriority}
              isSelected={priority === 'low'}
            />
          </Menu>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addButton, 
            (!text.trim() || loading) && styles.addButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() || loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Agregando...' : 'Agregar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityContainer: {
    flex: 1,
  },
  prioritySelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  prioritySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPriorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  prioritySelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    width: 250,
  },
  menuHeader: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  priorityOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  priorityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  priorityOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskForm;