import React from 'react';
import { Table, Tag } from 'antd';
import { getCarrierPerformanceData, mockLogisticsData } from '../../data/mockData';
import useDashboardStore from '../../store/dashboardStore';

const CarrierPerformanceWidget = ({ widgetId }) => {
  const { getFilteredData, widgetFilters, setGlobalArrayFilter, globalFilters } = useDashboardStore();
  
  const filteredLogisticsData = getFilteredData(widgetId, mockLogisticsData);
  const currentFilters = widgetFilters[widgetId] || {};
  const grouping = currentFilters.timeGrouping || 'all';
  
  const data = getCarrierPerformanceData(filteredLogisticsData, grouping);

  const handleCarrierClick = (carrier) => {
    const currentCarriers = globalFilters.carriers || [];
    
    // Toggle carrier selection
    if (currentCarriers.includes(carrier)) {
      // Remove carrier if already selected
      setGlobalArrayFilter('carriers', currentCarriers.filter(c => c !== carrier));
    } else {
      // Add carrier to selection
      setGlobalArrayFilter('carriers', [...currentCarriers, carrier]);
    }
  };

  const columns = [
    {
      title: 'Carrier',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: 'Packages',
      dataIndex: 'totalPackages',
      key: 'totalPackages',
      sorter: (a, b) => a.totalPackages - b.totalPackages,
    },
    {
      title: 'On-Time Rate',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      render: (rate) => (
        <Tag color={rate > 90 ? 'green' : rate > 70 ? 'orange' : 'red'}>
          {rate}%
        </Tag>
      ),
      sorter: (a, b) => parseFloat(a.onTimeRate) - parseFloat(b.onTimeRate),
    },
    {
      title: 'Avg Cost',
      dataIndex: 'avgCost',
      key: 'avgCost',
      render: (cost) => `$${cost}`,
      sorter: (a, b) => parseFloat(a.avgCost) - parseFloat(b.avgCost),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
      rowKey="carrier"
      onRow={(record) => ({
        onClick: () => handleCarrierClick(record.carrier),
        style: { 
          cursor: 'pointer',
          backgroundColor: globalFilters.carriers.includes(record.carrier) ? '#fff7e6' : 'transparent'
        },
        onMouseEnter: (e) => {
          if (!globalFilters.carriers.includes(record.carrier)) {
            e.target.closest('tr').style.backgroundColor = '#f5f5f5';
          }
        },
        onMouseLeave: (e) => {
          if (!globalFilters.carriers.includes(record.carrier)) {
            e.target.closest('tr').style.backgroundColor = 'transparent';
          }
        }
      })}
      rowClassName={(record) => 
        globalFilters.carriers.includes(record.carrier) ? 'selected-row' : ''
      }
    />
  );
};

export default CarrierPerformanceWidget;
