import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTimeSeriesData, mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const ShipmentVolumeWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalRangeFilter } = useDashboardStore();
  
  const filteredLogisticsData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'day';
  
  const data = getTimeSeriesData(filteredLogisticsData, grouping);

  const handleLineClick = (data) => {
    if (data && data.date) {
      const clickedDate = data.date;
      if (grouping === 'day') {
        setGlobalRangeFilter('dateRange', [clickedDate, clickedDate]);
      } else if (grouping === 'week') {
        const weekMatch = clickedDate.match(/(\d{4}-\d{2})-W(\d+)/);
        if (weekMatch) {
          const [, yearMonth, weekNum] = weekMatch;
          const startDate = `${yearMonth}-${String(parseInt(weekNum) * 7 - 6).padStart(2, '0')}`;
          const endDate = `${yearMonth}-${String(parseInt(weekNum) * 7).padStart(2, '0')}`;
          setGlobalRangeFilter('dateRange', [startDate, endDate]);
        }
      } else if (grouping === 'month') {
        const startDate = `${clickedDate}-01`;
        const endDate = `${clickedDate}-28`;
        setGlobalRangeFilter('dateRange', [startDate, endDate]);
      }
    }
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} onClick={handleLineClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length > 0) {
                return (
                  <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0 }}>Shipments: {payload[0].value}</p>
                    {payload[1] && <p style={{ margin: 0 }}>Packages: {payload[1].value}</p>}
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Click to filter by this {grouping}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="shipments" 
            stroke="#1890ff" 
            strokeWidth={2}
            style={{ cursor: 'pointer' }}
          />
          <Line 
            type="monotone" 
            dataKey="packages" 
            stroke="#52c41a" 
            strokeWidth={2}
            style={{ cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShipmentVolumeWidget;
