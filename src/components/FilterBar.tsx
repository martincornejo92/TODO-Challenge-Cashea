import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Modal,
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Filters, TaskStatus, PriorityFilter } from '../types';

interface FilterBarProps {
  filters: Filters;
  onUpdateFilters: (newFilters: Partial<Filters>) => void;
}

interface StatusFilter {
  label: string;
  value: TaskStatus;
}

interface PriorityFilterOption {
  label: string;
  value: PriorityFilter;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onUpdateFilters }) => {
  const [priorityModalVisible, setPriorityModalVisible] = React.useState(false);
  const [statusSectionExpanded, setStatusSectionExpanded] = React.useState(true);
  const [prioritySectionExpanded, setPrioritySectionExpanded] = React.useState(true);

  const openPriorityModal = () => setPriorityModalVisible(true);
  const closePriorityModal = () => setPriorityModalVisible(false);

  const toggleStatusSection = () => setStatusSectionExpanded(!statusSectionExpanded);
  const togglePrioritySection = () => setPrioritySectionExpanded(!prioritySectionExpanded);

  const statusFilters: StatusFilter[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Completadas', value: 'completed' },
    { label: 'Pendientes', value: 'pending' },
  ];

  const priorityFilters: PriorityFilterOption[] = [
    { label: 'Todas las prioridades', value: 'all' },
    { label: 'Alta Prioridad', value: 'high' },
    { label: 'Media Prioridad', value: 'medium' },
    { label: 'Baja Prioridad', value: 'low' },
  ];

  const getPriorityColor = (priority: PriorityFilter): string => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#666';
    }
  };

  const getPriorityText = (priority: PriorityFilter): string => {
    switch (priority) {
      case 'all': return 'Todas las prioridades';
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      case 'low': return 'Baja Prioridad';
      default: return priority;
    }
  };

  const getStatusText = (status: TaskStatus): string => {
    switch (status) {
      case 'all': return 'Todas';
      case 'completed': return 'Completadas';
      case 'pending': return 'Pendientes';
      default: return status;
    }
  };

  const PriorityFilterOption: React.FC<{ 
    value: PriorityFilter; 
    label: string; 
    onSelect: (value: PriorityFilter) => void;
    isSelected: boolean;
    showDivider?: boolean;
  }> = ({ value, label, onSelect, isSelected, showDivider = true }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.priorityOption,
          isSelected && styles.priorityOptionSelected
        ]}
        onPress={() => {
          console.log('🎯 Selected priority:', value);
          onSelect(value);
          closePriorityModal();
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
      {showDivider && <View style={styles.divider} />}
    </View>
  );

  const handleStatusFilterPress = (status: TaskStatus) => {
    console.log('🎯 Selected status:', status);
    onUpdateFilters({ status });
  };

  const handlePriorityFilterSelect = (priority: PriorityFilter) => {
    console.log('🎯 Selected priority filter:', priority);
    onUpdateFilters({ priority });
  };

  return (
    <View style={styles.container}>
      {/* Sección de Estado - Colapsable */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={toggleStatusSection}
      >
        <View style={styles.sectionHeaderContent}>
          <View style={styles.sectionTitleContainer}>
            <Icon 
              name={statusSectionExpanded ? "expand-less" : "expand-more"} 
              size={20} 
              color="#666" 
            />
            <Text style={styles.sectionTitle}>Filtrar por Estado</Text>
          </View>
          <Text style={styles.currentSelection}>
            {getStatusText(filters.status)}
          </Text>
        </View>
      </TouchableOpacity>

      {statusSectionExpanded && (
        <View style={styles.statusFilters}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                filters.status === filter.value && styles.activeFilterButton,
              ]}
              onPress={() => handleStatusFilterPress(filter.value)}
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
      )}

      {/* Sección de Prioridad - Colapsable */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={togglePrioritySection}
      >
        <View style={styles.sectionHeaderContent}>
          <View style={styles.sectionTitleContainer}>
            <Icon 
              name={prioritySectionExpanded ? "expand-less" : "expand-more"} 
              size={20} 
              color="#666" 
            />
            <Text style={styles.sectionTitle}>Filtrar por Prioridad</Text>
          </View>
          <View style={styles.currentSelectionContainer}>
            {filters.priority !== 'all' && (
              <View 
                style={[
                  styles.currentPriorityDot,
                  { backgroundColor: getPriorityColor(filters.priority) }
                ]} 
              />
            )}
            <Text style={styles.currentSelection}>
              {getPriorityText(filters.priority)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {prioritySectionExpanded && (
        <View style={styles.priorityFilterContainer}>
          <TouchableOpacity 
            style={styles.priorityFilterButton}
            onPress={openPriorityModal}
          >
            <View style={styles.priorityFilterContent}>
              <View style={styles.priorityIndicator}>
                {filters.priority !== 'all' && (
                  <View 
                    style={[
                      styles.currentPriorityDot,
                      { backgroundColor: getPriorityColor(filters.priority) }
                    ]} 
                  />
                )}
                <Text style={styles.priorityFilterText}>
                  {getPriorityText(filters.priority)}
                </Text>
              </View>
              <Icon 
                name="arrow-drop-down" 
                size={20} 
                color="#666" 
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para selección de prioridad */}
      <Modal
        visible={priorityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePriorityModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Prioridad</Text>
              <TouchableOpacity 
                onPress={closePriorityModal}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {priorityFilters.map((filter, index) => (
                <PriorityFilterOption 
                  key={filter.value}
                  value={filter.value}
                  label={filter.label}
                  onSelect={handlePriorityFilterSelect}
                  isSelected={filters.priority === filter.value}
                  showDivider={index < priorityFilters.length - 1}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Debug info */}
      {/* <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Filtros activos: Estado: {filters.status} | Prioridad: {filters.priority}
        </Text>
      </View> */}
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
  sectionHeader: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  currentSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSelection: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusFilters: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 8,
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
    marginBottom: 8,
    marginTop: 8,
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
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentPriorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  priorityFilterText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 300,
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
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  debugInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default FilterBar;