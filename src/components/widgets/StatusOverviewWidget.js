import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStatusDistribution, mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const StatusOverviewWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalArrayFilter, globalFilters } = useDashboardStore();
  
  const filteredLogisticsData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'all';
  
  let data = getStatusDistribution(filteredLogisticsData);
  
  // Apply widget-specific grouping
  if (grouping === 'active') {
    data = data.filter(item => ['In Transit', 'Delivered'].includes(item.status));
  } else if (grouping === 'issues') {
    data = data.filter(item => ['Delayed', 'Exception'].includes(item.status));
  }

  const handleStatusClick = (data) => {
    if (data && data.status) {
      const status = data.status;
      const currentStatuses = globalFilters.statuses || [];
      
      // Toggle status selection
      if (currentStatuses.includes(status)) {
        // Remove status if already selected
        setGlobalArrayFilter('statuses', currentStatuses.filter(s => s !== status));
      } else {
        // Add status to selection
        setGlobalArrayFilter('statuses', [...currentStatuses, status]);
      }
    }
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length > 0) {
                const isSelected = globalFilters.statuses.includes(label);
                return (
                  <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0 }}>{payload[0].value} items</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Click to {isSelected ? 'remove' : 'add'} filter
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#1890ff"
            style={{ cursor: 'pointer' }}
            onClick={(data) => handleStatusClick(data)}
          >
            {data.map((entry, index) => {
              const isSelected = globalFilters.statuses.includes(entry.status);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={isSelected ? '#ff7300' : '#1890ff'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusOverviewWidget;
