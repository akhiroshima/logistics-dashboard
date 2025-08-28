import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const DeliveryTimeWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters } = useDashboardStore();
  
  const filteredData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'hours';
  
  // Group by delivery time ranges based on drill-down selection
  let timeRanges = {};
  
  if (grouping === 'hours') {
    timeRanges = {
      '0-6h': 0,
      '6-12h': 0,
      '12-18h': 0,
      '18-24h': 0
    };
    filteredData.forEach(item => {
      if (item.deliveryTime <= 6) timeRanges['0-6h']++;
      else if (item.deliveryTime <= 12) timeRanges['6-12h']++;
      else if (item.deliveryTime <= 18) timeRanges['12-18h']++;
      else if (item.deliveryTime <= 24) timeRanges['18-24h']++;
    });
  } else if (grouping === 'days') {
    timeRanges = {
      '1-2 days': 0,
      '2-3 days': 0,
      '3-5 days': 0,
      '5+ days': 0
    };
    filteredData.forEach(item => {
      const days = item.deliveryTime / 24;
      if (days <= 2) timeRanges['1-2 days']++;
      else if (days <= 3) timeRanges['2-3 days']++;
      else if (days <= 5) timeRanges['3-5 days']++;
      else timeRanges['5+ days']++;
    });
  } else if (grouping === 'route') {
    timeRanges = {
      'Local (<100km)': 0,
      'Regional (100-500km)': 0,
      'National (500-2000km)': 0,
      'International (2000km+)': 0
    };
    filteredData.forEach(item => {
      if (item.distance < 100) timeRanges['Local (<100km)']++;
      else if (item.distance < 500) timeRanges['Regional (100-500km)']++;
      else if (item.distance < 2000) timeRanges['National (500-2000km)']++;
      else timeRanges['International (2000km+)']++;
    });
  } else {
    // Default grouping
    timeRanges = {
      '0-24h': 0,
      '24-48h': 0,
      '48-72h': 0,
      '72h+': 0
    };
    filteredData.forEach(item => {
      if (item.deliveryTime <= 24) timeRanges['0-24h']++;
      else if (item.deliveryTime <= 48) timeRanges['24-48h']++;
      else if (item.deliveryTime <= 72) timeRanges['48-72h']++;
      else timeRanges['72h+']++;
    });
  }
  
  const data = Object.entries(timeRanges).map(([range, count]) => ({
    range,
    count
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#1890ff" fill="#1890ff" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryTimeWidget;
