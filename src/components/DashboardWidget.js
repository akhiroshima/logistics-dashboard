import React from 'react';
import { Card, Select, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';

const { Option } = Select;

const DashboardWidget = ({ title, widgetId, component: Component }) => {
  const { widgetFilters, setWidgetFilter } = useDashboardStore();
  
  const currentFilter = widgetFilters[widgetId] || {};

  const timeGroupingOptions = [
    { label: 'Daily', value: 'day' },
    { label: 'Weekly', value: 'week' },
    { label: 'Monthly', value: 'month' },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="export">Export Data</Menu.Item>
      <Menu.Item key="fullscreen">Full Screen</Menu.Item>
      <Menu.Item key="settings">Widget Settings</Menu.Item>
    </Menu>
  );

  return (
    <Card
      className="widget-container"
      title={
        <div className="widget-header">
          <span>{title}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Select
              size="small"
              placeholder="Time Group"
              value={currentFilter.timeGrouping}
              onChange={(value) => setWidgetFilter(widgetId, 'timeGrouping', value)}
              style={{ width: 100 }}
              allowClear
            >
              {timeGroupingOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Dropdown overlay={menu} trigger={['click']}>
              <MoreOutlined style={{ cursor: 'pointer', fontSize: '16px' }} />
            </Dropdown>
          </div>
        </div>
      }
      bordered={false}
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <Component widgetId={widgetId} />
    </Card>
  );
};

export default DashboardWidget;
