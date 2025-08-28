import React from 'react';
import { Card, Select, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';
import { getDisabledDrillDownOptions } from '../utils/filterLogic';

const { Option } = Select;

const MasonryWidget = ({ title, widgetId, children, className = "widget-card", drillDownOptions = [] }) => {
  const { widgetFilters, setWidgetFilter, globalFilters } = useDashboardStore();
  
  const currentFilter = widgetFilters[widgetId] || {};

  // Default drill-down options for different widget types
  const getDefaultDrillDownOptions = () => {
    if (drillDownOptions.length > 0) return drillDownOptions;
    
    // Default time-based options
    return [
      { label: 'Daily', value: 'day' },
      { label: 'Weekly', value: 'week' },
      { label: 'Monthly', value: 'month' },
    ];
  };

  // Get disabled options based on global filters
  const disabledOptions = getDisabledDrillDownOptions(widgetId, globalFilters);

  const menu = (
    <Menu>
      <Menu.Item key="export">Export Data</Menu.Item>
      <Menu.Item key="fullscreen">Expand Widget</Menu.Item>
      <Menu.Item key="refresh">Refresh Data</Menu.Item>
    </Menu>
  );

  return (
    <div className="masonry-item">
      <Card 
        className={className}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{title}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Select
                size="small"
                placeholder="Drill Down"
                value={currentFilter.timeGrouping}
                onChange={(value) => setWidgetFilter(widgetId, 'timeGrouping', value)}
                style={{ width: 120, fontSize: '12px' }}
                allowClear
              >
                {getDefaultDrillDownOptions().map(option => (
                  <Option 
                    key={option.value} 
                    value={option.value}
                    disabled={disabledOptions.includes(option.value)}
                  >
                    {option.label}
                    {disabledOptions.includes(option.value) && ' (filtered)'}
                  </Option>
                ))}
              </Select>
              <Dropdown overlay={menu} trigger={['click']}>
                <MoreOutlined 
                  style={{ 
                    cursor: 'pointer', 
                    fontSize: '14px', 
                    color: '#8c8c8c',
                    padding: '2px' 
                  }} 
                />
              </Dropdown>
            </div>
          </div>
        }
      >
        {children}
      </Card>
    </div>
  );
};

export default MasonryWidget;
