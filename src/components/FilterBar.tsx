import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Filters, Priority, TaskStatus } from '../types';

interface FilterBarProps {
  filters: Filters;
  onUpdateFilters: (newFilters: Partial<Filters>) => void;
}

interface StatusFilter {
  label: string;
  value: TaskStatus;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onUpdateFilters }) => {
  const [priorityMenuVisible, setPriorityMenuVisible] = React.useState(false);

  const openPriorityMenu = () => setPriorityMenuVisible(true);
  const closePriorityMenu = () => setPriorityMenuVisible(false);

  const statusFilters: StatusFilter[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Completadas', value: 'completed' },
    { label: 'Pendientes', value: 'pending' },
  ];

  const priorityFilters = [
    { label: 'Todas las prioridades', value: 'all' },
    { label: 'Alta Prioridad', value: 'high' },
    { label: 'Media Prioridad', value: 'medium' },
    { label: 'Baja Prioridad', value: 'low' },
  ];

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#666';
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'all': return 'Todas las prioridades';
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      case 'low': return 'Baja Prioridad';
      default: return priority;
    }
  };

  const PriorityFilterOption: React.FC<{ 
    value: string; 
    label: string; 
    onSelect: (value: string) => void;
    isSelected: boolean;
  }> = ({ value, label, onSelect, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.priorityOption,
        isSelected && styles.priorityOptionSelected
      ]}
      onPress={() => {
        onSelect(value);
        closePriorityMenu();
      }}
    >
      <View style={styles.priorityOptionContent}>
        {value !== 'all' && (
          <View 
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(value) }
            ]} 
          />
        )}
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
      <View style={styles.statusFilters}>
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              filters.status === filter.value && styles.activeFilterButton,
            ]}
            onPress={() => onUpdateFilters({ status: filter.value })}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.status === filter.value && styles.activeFilterButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.priorityFilterContainer}>
        <Menu
          visible={priorityMenuVisible}
          onDismiss={closePriorityMenu}
          anchor={
            <TouchableOpacity 
              style={styles.priorityFilterButton}
              onPress={openPriorityMenu}
            >
              <View style={styles.priorityFilterContent}>
                <Text style={styles.priorityFilterText}>
                  {getPriorityText(filters.priority)}
                </Text>
                <Icon 
                  name={priorityMenuVisible ? "arrow-drop-up" : "arrow-drop-down"} 
                  size={20} 
                  color="#666" 
                />
              </View>
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Filtrar por Prioridad</Text>
          </View>
          <Divider />
          {priorityFilters.map((filter, index) => (
            <React.Fragment key={filter.value}>
              <PriorityFilterOption 
                value={filter.value}
                label={filter.label}
                onSelect={(value) => onUpdateFilters({ priority: value as Priority | 'all' })}
                isSelected={filters.priority === filter.value}
              />
              {index < priorityFilters.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Menu>
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
  statusFilters: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  priorityFilterContainer: {
    marginTop: 4,
  },
  priorityFilterButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  priorityFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityFilterText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  priorityOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default FilterBar;