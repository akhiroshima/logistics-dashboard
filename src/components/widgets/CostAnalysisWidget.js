import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const CostAnalysisWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalRangeFilter, globalFilters } = useDashboardStore();
  
  const filteredData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'day';

  const handleDateClick = (data) => {
    if (data && data.date) {
      // Set date range filter based on clicked date
      const clickedDate = data.date;
      if (grouping === 'day') {
        // Set single day range
        setGlobalRangeFilter('dateRange', [clickedDate, clickedDate]);
      } else if (grouping === 'week') {
        // Extract week info and set week range
        const weekMatch = clickedDate.match(/(\d{4}-\d{2})-W(\d+)/);
        if (weekMatch) {
          const [, yearMonth, weekNum] = weekMatch;
          const startDate = `${yearMonth}-${String(parseInt(weekNum) * 7 - 6).padStart(2, '0')}`;
          const endDate = `${yearMonth}-${String(parseInt(weekNum) * 7).padStart(2, '0')}`;
          setGlobalRangeFilter('dateRange', [startDate, endDate]);
        }
      } else if (grouping === 'month') {
        // Set month range
        const startDate = `${clickedDate}-01`;
        const endDate = `${clickedDate}-28`; // Simplified end date
        setGlobalRangeFilter('dateRange', [startDate, endDate]);
      }
    }
  };
  
  let data = [];
  
  if (grouping === 'day') {
    // Daily cost analysis
    const dailyCosts = {};
    filteredData.forEach(item => {
      const date = item.deliveryDate;
      if (!dailyCosts[date]) {
        dailyCosts[date] = { date, totalCost: 0, avgCost: 0, count: 0 };
      }
      dailyCosts[date].totalCost += item.cost;
      dailyCosts[date].count += 1;
    });
    
    data = Object.values(dailyCosts).map(item => ({
      ...item,
      avgCost: item.count > 0 ? (item.totalCost / item.count).toFixed(2) : 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
  } else if (grouping === 'week') {
    // Weekly cost analysis
    const weeklyCosts = {};
    filteredData.forEach(item => {
      const date = new Date(item.deliveryDate);
      const week = Math.ceil(date.getDate() / 7);
      const weekKey = `${item.deliveryDate.substring(0, 7)}-W${week}`;
      
      if (!weeklyCosts[weekKey]) {
        weeklyCosts[weekKey] = { date: weekKey, totalCost: 0, avgCost: 0, count: 0 };
      }
      weeklyCosts[weekKey].totalCost += item.cost;
      weeklyCosts[weekKey].count += 1;
    });
    
    data = Object.values(weeklyCosts).map(item => ({
      ...item,
      avgCost: item.count > 0 ? (item.totalCost / item.count).toFixed(2) : 0
    }));
    
  } else if (grouping === 'month') {
    // Monthly cost analysis
    const monthlyCosts = {};
    filteredData.forEach(item => {
      const month = item.deliveryDate.substring(0, 7);
      if (!monthlyCosts[month]) {
        monthlyCosts[month] = { date: month, totalCost: 0, avgCost: 0, count: 0 };
      }
      monthlyCosts[month].totalCost += item.cost;
      monthlyCosts[month].count += 1;
    });
    
    data = Object.values(monthlyCosts).map(item => ({
      ...item,
      avgCost: item.count > 0 ? (item.totalCost / item.count).toFixed(2) : 0
    }));
    
  } else if (grouping === 'quarter') {
    // Quarterly cost analysis
    const quarterlyCosts = {};
    filteredData.forEach(item => {
      const date = new Date(item.deliveryDate);
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      const quarterKey = `${date.getFullYear()}-Q${quarter}`;
      
      if (!quarterlyCosts[quarterKey]) {
        quarterlyCosts[quarterKey] = { date: quarterKey, totalCost: 0, avgCost: 0, count: 0 };
      }
      quarterlyCosts[quarterKey].totalCost += item.cost;
      quarterlyCosts[quarterKey].count += 1;
    });
    
    data = Object.values(quarterlyCosts).map(item => ({
      ...item,
      avgCost: item.count > 0 ? (item.totalCost / item.count).toFixed(2) : 0
    }));
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
                    <p style={{ margin: 0 }}>Total Cost: ${payload[0].value}</p>
                    {payload[1] && <p style={{ margin: 0 }}>Avg Cost: ${payload[1].value}</p>}
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Click to filter by this {grouping === 'day' ? 'day' : grouping === 'week' ? 'week' : 'month'}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="totalCost" 
            fill="#1890ff" 
            name="Total Cost"
            style={{ cursor: 'pointer' }}
            onClick={(data) => handleDateClick(data)}
          />
          <Bar 
            dataKey="avgCost" 
            fill="#52c41a" 
            name="Average Cost"
            style={{ cursor: 'pointer' }}
            onClick={(data) => handleDateClick(data)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostAnalysisWidget;