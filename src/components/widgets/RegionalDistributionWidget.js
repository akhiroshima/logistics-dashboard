import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getRegionalData, mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];

const RegionalDistributionWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalArrayFilter, globalFilters } = useDashboardStore();
  
  const filteredLogisticsData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'region';
  
  const data = getRegionalData(filteredLogisticsData, grouping);

  const handleRegionClick = (data) => {
    if (data && data.region) {
      const region = data.region;
      const currentRegions = globalFilters.regions || [];
      
      // Toggle region selection
      if (currentRegions.includes(region)) {
        // Remove region if already selected
        setGlobalArrayFilter('regions', currentRegions.filter(r => r !== region));
      } else {
        // Add region to selection
        setGlobalArrayFilter('regions', [...currentRegions, region]);
      }
    }
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalShipments"
            onClick={handleRegionClick}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => {
              const isSelected = globalFilters.regions.includes(entry.region);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={isSelected ? '#ff7300' : COLORS[index % COLORS.length]}
                  stroke={isSelected ? '#333' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                />
              );
            })}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{data.region}</p>
                    <p style={{ margin: 0 }}>{data.totalShipments} shipments</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Click to {globalFilters.regions.includes(data.region) ? 'remove' : 'add'} filter
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalDistributionWidget;
