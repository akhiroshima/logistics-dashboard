import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const WeightDistributionWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalRangeFilter, globalFilters } = useDashboardStore();
  
  const filteredData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'weight';

  const handleScatterClick = (data) => {
    if (data && data.payload) {
      const point = data.payload;
      if (grouping === 'weight') {
        // Set weight range around clicked point
        const weight = point.weight;
        const range = 5; // ±5kg range
        setGlobalRangeFilter('weightRange', [Math.max(0, weight - range), weight + range]);
      } else if (grouping === 'package') {
        // Set package range around clicked point
        const packages = point.weight; // In package mode, weight axis shows packages
        const range = 10; // ±10 packages range
        setGlobalRangeFilter('packageRange', [Math.max(0, packages - range), packages + range]);
      } else if (grouping === 'route') {
        // Set distance range around clicked point
        const distance = point.weight; // In route mode, weight axis shows distance
        const range = 500; // ±500km range
        setGlobalRangeFilter('distanceRange', [Math.max(0, distance - range), distance + range]);
      }
    }
  };
  
  let data;
  
  if (grouping === 'weight') {
    // Weight vs Cost scatter plot
    data = filteredData.map(item => ({
      weight: item.weight,
      cost: item.cost,
      packages: item.packageCount
    }));
  } else if (grouping === 'package') {
    // Package Count vs Cost
    data = filteredData.map(item => ({
      weight: item.packageCount, // Use packageCount as x-axis
      cost: item.cost,
      packages: item.weight // Use weight as bubble size
    }));
  } else if (grouping === 'route') {
    // Distance vs Weight
    data = filteredData.map(item => ({
      weight: item.distance, // Use distance as x-axis
      cost: item.weight, // Use weight as y-axis
      packages: item.cost // Use cost as bubble size
    }));
  } else {
    // Default: weight vs cost
    data = filteredData.map(item => ({
      weight: item.weight,
      cost: item.cost,
      packages: item.packageCount
    }));
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data} onClick={handleScatterClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="weight" 
            name={grouping === 'package' ? 'Packages' : grouping === 'route' ? 'Distance' : 'Weight'} 
            unit={grouping === 'package' ? 'pkg' : grouping === 'route' ? 'km' : 'kg'} 
          />
          <YAxis 
            dataKey="cost" 
            name={grouping === 'route' ? 'Weight' : 'Cost'} 
            unit={grouping === 'route' ? 'kg' : '$'} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
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
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {grouping === 'package' ? 'Package Analysis' : grouping === 'route' ? 'Route Analysis' : 'Weight Analysis'}
                    </p>
                    <p style={{ margin: 0 }}>
                      {grouping === 'package' ? `Packages: ${data.weight}` : grouping === 'route' ? `Distance: ${data.weight}km` : `Weight: ${data.weight}kg`}
                    </p>
                    <p style={{ margin: 0 }}>
                      {grouping === 'route' ? `Weight: ${data.cost}kg` : `Cost: $${data.cost}`}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Click to filter by this range
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            name={grouping === 'package' ? 'Packages vs Cost' : grouping === 'route' ? 'Distance vs Weight' : 'Weight vs Cost'} 
            dataKey="packages" 
            fill="#1890ff"
            style={{ cursor: 'pointer' }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightDistributionWidget;
