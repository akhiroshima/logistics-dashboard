import React from 'react';
import { Drawer, Form, Select, Button, Space, Divider, Typography } from 'antd';
import useDashboardStore from '../store/dashboardStore';

const { Title } = Typography;
const { Option } = Select;

const FilterSidebar = ({ open, onClose }) => {
  const {
    globalFilters,
    setGlobalFilter,
    clearGlobalFilters
  } = useDashboardStore();

  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const statuses = ['In Transit', 'Delivered', 'Pending', 'Delayed', 'Exception'];
  const priorities = ['High', 'Medium', 'Low'];

  const handleClearFilters = () => {
    clearGlobalFilters();
  };

  return (
    <Drawer
      title="Dashboard Filters"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      className="filter-sidebar"
    >
      <Form layout="vertical">
        <Title level={4}>Global Filters</Title>
        <Form.Item label="Carrier">
          <Select
            placeholder="Select carrier"
            value={globalFilters.carrier}
            onChange={(value) => setGlobalFilter('carrier', value)}
            allowClear
          >
            {carriers.map(carrier => (
              <Option key={carrier} value={carrier}>{carrier}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Region">
          <Select
            placeholder="Select region"
            value={globalFilters.region}
            onChange={(value) => setGlobalFilter('region', value)}
            allowClear
          >
            {regions.map(region => (
              <Option key={region} value={region}>{region}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Status">
          <Select
            placeholder="Select status"
            value={globalFilters.status}
            onChange={(value) => setGlobalFilter('status', value)}
            allowClear
          >
            {statuses.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Priority">
          <Select
            placeholder="Select priority"
            value={globalFilters.priority}
            onChange={(value) => setGlobalFilter('priority', value)}
            allowClear
          >
            {priorities.map(priority => (
              <Option key={priority} value={priority}>{priority}</Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        <Space>
          <Button type="primary" onClick={onClose}>
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters}>
            Clear All
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default FilterSidebar;
