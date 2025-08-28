import React from 'react';
import { Layout, Typography, Button, DatePicker, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useDashboardStore from '../store/dashboardStore';
import FilterSidebar from './FilterSidebar';
import WidgetGrid from './WidgetGrid';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const {
    deliveryDate,
    filterSidebarOpen,
    setDeliveryDate,
    setFilterSidebarOpen
  } = useDashboardStore();

  return (
    <Layout className="dashboard-container">
      <Header>
        <Title level={2} className="dashboard-title">
          Logistics Dashboard
        </Title>
        <div className="header-controls">
          <Space>
            <DatePicker
              value={dayjs(deliveryDate)}
              onChange={(date) => setDeliveryDate(date.format('YYYY-MM-DD'))}
              placeholder="Select Delivery Date"
            />
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => setFilterSidebarOpen(true)}
            >
              Filters
            </Button>
          </Space>
        </div>
      </Header>
      
      <Content>
        <WidgetGrid />
        <FilterSidebar 
          open={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
        />
      </Content>
    </Layout>
  );
};

export default Dashboard;
