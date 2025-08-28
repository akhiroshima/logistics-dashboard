import React from 'react';
import { Progress, Space, Typography } from 'antd';
import { mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const { Text } = Typography;

const PriorityBreakdownWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalArrayFilter, globalFilters } = useDashboardStore();
  
  const data = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'all';
  
  const priorityCounts = {
    High: 0,
    Medium: 0,
    Low: 0
  };
  
  // Filter data based on grouping before counting
  let filteredData = data;
  if (grouping === 'high') {
    filteredData = data.filter(item => item.priority === 'High');
  } else if (grouping === 'medium_high') {
    filteredData = data.filter(item => ['High', 'Medium'].includes(item.priority));
  }
  
  filteredData.forEach(item => {
    priorityCounts[item.priority]++;
  });
  
  const total = filteredData.length;
  const colors = {
    High: '#f5222d',
    Medium: '#faad14',
    Low: '#52c41a'
  };

  const handlePriorityClick = (priority) => {
    const currentPriorities = globalFilters.priorities || [];
    
    // Toggle priority selection
    if (currentPriorities.includes(priority)) {
      // Remove priority if already selected
      setGlobalArrayFilter('priorities', currentPriorities.filter(p => p !== priority));
    } else {
      // Add priority to selection
      setGlobalArrayFilter('priorities', [...currentPriorities, priority]);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {Object.entries(priorityCounts)
        .filter(([priority, count]) => count > 0) // Only show priorities with data
        .map(([priority, count]) => {
          const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
          const isSelected = globalFilters.priorities.includes(priority);
          return (
            <div 
              key={priority} 
              style={{ 
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                border: isSelected ? '2px solid #ff7300' : '2px solid transparent',
                backgroundColor: isSelected ? '#fff7e6' : 'transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handlePriorityClick(priority)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{priority} Priority</Text>
                <Text>{count} ({percentage}%)</Text>
              </div>
              <Progress 
                percent={parseFloat(percentage)} 
                strokeColor={isSelected ? '#ff7300' : colors[priority]}
                showInfo={false}
              />
              {isSelected && (
                <Text style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Click to remove filter
                </Text>
              )}
            </div>
          );
        })}
    </Space>
  );
};

export default PriorityBreakdownWidget;
