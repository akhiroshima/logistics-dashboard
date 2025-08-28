import React from 'react';
import { Space, Tag, Typography } from 'antd';
import { CloseOutlined, FilterOutlined } from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';
import { mockLogisticsData } from '../data/mockData';

const { Text } = Typography;

const ActiveFiltersDisplay = () => {
  const { 
    globalFilters, 
    setGlobalArrayFilter, 
    setGlobalRangeFilter,
    clearGlobalFilters,
    getFilteredData 
  } = useDashboardStore();

  const filteredCount = getFilteredData('filter-preview', mockLogisticsData).length;
  const totalCount = mockLogisticsData.length;

  // Check if any filters are active
  const hasActiveFilters = 
    globalFilters.carriers.length > 0 ||
    globalFilters.regions.length > 0 ||
    globalFilters.statuses.length > 0 ||
    globalFilters.priorities.length > 0 ||
    globalFilters.dateRange.length === 2 ||
    JSON.stringify(globalFilters.costRange) !== JSON.stringify([0, 1100]) ||
    JSON.stringify(globalFilters.weightRange) !== JSON.stringify([0, 55]) ||
    JSON.stringify(globalFilters.packageRange) !== JSON.stringify([0, 105]) ||
    JSON.stringify(globalFilters.distanceRange) !== JSON.stringify([0, 5500]) ||
    JSON.stringify(globalFilters.deliveryTimeRange) !== JSON.stringify([0, 75]);

  if (!hasActiveFilters) {
    return null;
  }

  const handleRemoveArrayFilter = (filterKey, value) => {
    const currentValues = globalFilters[filterKey];
    const newValues = currentValues.filter(v => v !== value);
    setGlobalArrayFilter(filterKey, newValues);
  };

  const handleRemoveRangeFilter = (filterKey, defaultRange) => {
    setGlobalRangeFilter(filterKey, defaultRange);
  };

  const handleRemoveDateRange = () => {
    setGlobalRangeFilter('dateRange', []);
  };

  const isRangeFilterActive = (range, defaultRange) => {
    return JSON.stringify(range) !== JSON.stringify(defaultRange);
  };

  return (
    <div style={{ 
      background: '#fafafa', 
      padding: '16px 24px', 
      marginBottom: '24px',
      borderRadius: '8px',
      border: '1px solid #d9d9d9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text strong>Active Filters:</Text>
          <Tag color="blue">
            {filteredCount} of {totalCount} records
          </Tag>
        </div>
        <Tag
          color="red"
          style={{ cursor: 'pointer' }}
          onClick={clearGlobalFilters}
        >
          Clear All Filters
        </Tag>
      </div>

      <Space size={[8, 8]} wrap>
        {/* Date Range Filter */}
        {globalFilters.dateRange.length === 2 && (
          <Tag
            closable
            onClose={handleRemoveDateRange}
            color="purple"
          >
            📅 {globalFilters.dateRange[0]} to {globalFilters.dateRange[1]}
          </Tag>
        )}

        {/* Multi-select Filters */}
        {globalFilters.carriers.map(carrier => (
          <Tag
            key={`carrier-${carrier}`}
            closable
            onClose={() => handleRemoveArrayFilter('carriers', carrier)}
            color="blue"
          >
            🚚 {carrier}
          </Tag>
        ))}

        {globalFilters.regions.map(region => (
          <Tag
            key={`region-${region}`}
            closable
            onClose={() => handleRemoveArrayFilter('regions', region)}
            color="green"
          >
            🌍 {region}
          </Tag>
        ))}

        {globalFilters.statuses.map(status => (
          <Tag
            key={`status-${status}`}
            closable
            onClose={() => handleRemoveArrayFilter('statuses', status)}
            color="orange"
          >
            📦 {status}
          </Tag>
        ))}

        {globalFilters.priorities.map(priority => (
          <Tag
            key={`priority-${priority}`}
            closable
            onClose={() => handleRemoveArrayFilter('priorities', priority)}
            color="red"
          >
            ⚡ {priority}
          </Tag>
        ))}

        {/* Range Filters */}
        {isRangeFilterActive(globalFilters.costRange, [0, 1100]) && (
          <Tag
            closable
            onClose={() => handleRemoveRangeFilter('costRange', [0, 1100])}
            color="gold"
          >
            💰 ${globalFilters.costRange[0]} - ${globalFilters.costRange[1]}
          </Tag>
        )}

        {isRangeFilterActive(globalFilters.weightRange, [0, 55]) && (
          <Tag
            closable
            onClose={() => handleRemoveRangeFilter('weightRange', [0, 55])}
            color="cyan"
          >
            ⚖️ {globalFilters.weightRange[0]} - {globalFilters.weightRange[1]} kg
          </Tag>
        )}

        {isRangeFilterActive(globalFilters.packageRange, [0, 105]) && (
          <Tag
            closable
            onClose={() => handleRemoveRangeFilter('packageRange', [0, 105])}
            color="geekblue"
          >
            📦 {globalFilters.packageRange[0]} - {globalFilters.packageRange[1]} packages
          </Tag>
        )}

        {isRangeFilterActive(globalFilters.distanceRange, [0, 5500]) && (
          <Tag
            closable
            onClose={() => handleRemoveRangeFilter('distanceRange', [0, 5500])}
            color="magenta"
          >
            🛣️ {globalFilters.distanceRange[0]} - {globalFilters.distanceRange[1]} km
          </Tag>
        )}

        {isRangeFilterActive(globalFilters.deliveryTimeRange, [0, 75]) && (
          <Tag
            closable
            onClose={() => handleRemoveRangeFilter('deliveryTimeRange', [0, 75])}
            color="volcano"
          >
            ⏱️ {globalFilters.deliveryTimeRange[0]} - {globalFilters.deliveryTimeRange[1]} hours
          </Tag>
        )}
      </Space>
    </div>
  );
};

export default ActiveFiltersDisplay;
