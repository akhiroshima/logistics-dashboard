import React from 'react';
import { ConfigProvider, Layout, Typography, Button, Row, Col, Statistic } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import useDashboardStore from './store/dashboardStore';
import { mockLogisticsData, getCarrierPerformanceData, getRegionalData, getStatusDistribution, getTimeSeriesData } from './data/mockData';
import CarrierPerformanceWidget from './components/widgets/CarrierPerformanceWidget';
import RegionalDistributionWidget from './components/widgets/RegionalDistributionWidget';
import StatusOverviewWidget from './components/widgets/StatusOverviewWidget';
import ShipmentVolumeWidget from './components/widgets/ShipmentVolumeWidget';
import DeliveryTimeWidget from './components/widgets/DeliveryTimeWidget';
import PriorityBreakdownWidget from './components/widgets/PriorityBreakdownWidget';
import WeightDistributionWidget from './components/widgets/WeightDistributionWidget';
import CostAnalysisWidget from './components/widgets/CostAnalysisWidget';
import ComprehensiveFilterSidebar from './components/ComprehensiveFilterSidebar';
import ActiveFiltersDisplay from './components/ActiveFiltersDisplay';
import SmartDateInput from './components/SmartDateInput';
import MasonryWidget from './components/MasonryWidget';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

// Step 5: Add back fixed store
function App() {
  console.log('App with fixed store rendering...');
  
  // Test fixed store
  const { 
    filterSidebarOpen, 
    setFilterSidebarOpen, 
    getFilteredData,
    globalFilters,
    setGlobalRangeFilter 
  } = useDashboardStore();
  
  // Test simplified filtering and data processing
  const filteredData = getFilteredData('test', mockLogisticsData);
  console.log('Filtered data length:', filteredData.length);
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'auto',
          lineHeight: 'normal'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            height: '64px'
          }}>
            <Title level={2} style={{ margin: 0, color: '#1890ff', flex: '0 0 auto' }}>
              Logistics Dashboard
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SmartDateInput
                value={globalFilters.dateRange}
                onChange={(dateRange, label) => {
                  setGlobalRangeFilter('dateRange', dateRange);
                }}
                placeholder="Type: Q1 2023, Last Quarter, 2024..."
              />
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              >
                Filters {filterSidebarOpen ? '(Open)' : ''}
              </Button>
            </div>
          </div>
        </Header>
        
                <Content style={{ padding: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
            <h2>🚀 Logistics Dashboard</h2>
            <p>Real-time logistics data with comprehensive filtering and analytics across all carriers, regions, and delivery metrics.</p>
          </div>

          {/* Active Filters Display */}
          <ActiveFiltersDisplay />

          {/* Masonry Dashboard Widgets with Drill-down Controls */}
          <div className="masonry-grid">
            
            <MasonryWidget 
              title="Cost Analysis" 
              widgetId="cost-analysis"
              drillDownOptions={[
                { label: 'Daily', value: 'day' },
                { label: 'Weekly', value: 'week' },
                { label: 'Monthly', value: 'month' },
                { label: 'Quarterly', value: 'quarter' }
              ]}
            >
              <CostAnalysisWidget widgetId="cost-analysis" />
            </MasonryWidget>

            <MasonryWidget 
              title="Priority Breakdown" 
              widgetId="priority-breakdown"
              drillDownOptions={[
                { label: 'All Priorities', value: 'all' },
                { label: 'High Only', value: 'high' },
                { label: 'Med + High', value: 'medium_high' }
              ]}
            >
              <PriorityBreakdownWidget widgetId="priority-breakdown" />
            </MasonryWidget>

            <MasonryWidget 
              title="Performance Metrics" 
              widgetId="performance-metrics"
              drillDownOptions={[
                { label: 'Live', value: 'realtime' },
                { label: 'Hourly', value: 'hour' },
                { label: 'Daily', value: 'day' }
              ]}
            >
              <div className="compact-widget">
                                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Statistic
                        title="Avg Delivery"
                        value={getFilteredData('performance-metrics', mockLogisticsData).length > 0 ? (getFilteredData('performance-metrics', mockLogisticsData).reduce((sum, item) => sum + item.deliveryTime, 0) / getFilteredData('performance-metrics', mockLogisticsData).length).toFixed(1) : 0}
                        suffix="hrs"
                        valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Distance"
                        value={(getFilteredData('performance-metrics', mockLogisticsData).reduce((sum, item) => sum + item.distance, 0) / 1000).toFixed(1)}
                        suffix="k km"
                        valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Weight"
                        value={(getFilteredData('performance-metrics', mockLogisticsData).reduce((sum, item) => sum + item.weight, 0) / 1000).toFixed(1)}
                        suffix="t"
                        valueStyle={{ color: '#faad14', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Efficiency"
                        value={getFilteredData('performance-metrics', mockLogisticsData).length > 0 ? ((getFilteredData('performance-metrics', mockLogisticsData).filter(item => item.status === 'Delivered').length / getFilteredData('performance-metrics', mockLogisticsData).length) * 100).toFixed(1) : 0}
                        suffix="%"
                        valueStyle={{ color: '#f5222d', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
              </div>
            </MasonryWidget>

            <MasonryWidget 
              title="Carrier Performance" 
              widgetId="carrier-performance"
              drillDownOptions={[
                { label: 'All Carriers', value: 'all' },
                { label: 'Top 3', value: 'top3' },
                { label: 'Performance', value: 'performance' }
              ]}
            >
              <CarrierPerformanceWidget widgetId="carrier-performance" />
            </MasonryWidget>

            <MasonryWidget 
              title="Regional Distribution" 
              widgetId="regional-distribution"
              drillDownOptions={[
                { label: 'By Region', value: 'region' },
                { label: 'By Country', value: 'country' },
                { label: 'By City', value: 'city' }
              ]}
            >
              <RegionalDistributionWidget widgetId="regional-distribution" />
            </MasonryWidget>

            <MasonryWidget 
              title="Status Overview" 
              widgetId="status-overview"
              drillDownOptions={[
                { label: 'All Status', value: 'all' },
                { label: 'Active Only', value: 'active' },
                { label: 'Issues', value: 'issues' }
              ]}
            >
              <StatusOverviewWidget widgetId="status-overview" />
            </MasonryWidget>

            <MasonryWidget 
              title="Live Stats" 
              widgetId="live-stats"
              drillDownOptions={[
                { label: 'Real-time', value: 'realtime' },
                { label: 'Last Hour', value: 'hour' },
                { label: 'Today', value: 'today' }
              ]}
            >
              <div className="compact-widget">
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="In Transit"
                      value={getFilteredData('live-stats', mockLogisticsData).filter(item => item.status === 'In Transit').length}
                      valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Delivered"
                      value={getFilteredData('live-stats', mockLogisticsData).filter(item => item.status === 'Delivered').length}
                      valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Pending"
                      value={getFilteredData('live-stats', mockLogisticsData).filter(item => item.status === 'Pending').length}
                      valueStyle={{ color: '#faad14', fontSize: '16px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Delayed"
                      value={getFilteredData('live-stats', mockLogisticsData).filter(item => item.status === 'Delayed').length}
                      valueStyle={{ color: '#f5222d', fontSize: '16px' }}
                    />
                  </Col>
                </Row>
              </div>
            </MasonryWidget>

            <MasonryWidget 
              title="Shipment Volume Trends" 
              widgetId="shipment-volume"
              drillDownOptions={[
                { label: 'Daily', value: 'day' },
                { label: 'Weekly', value: 'week' },
                { label: 'Monthly', value: 'month' },
                { label: 'Yearly', value: 'year' }
              ]}
            >
              <ShipmentVolumeWidget widgetId="shipment-volume" />
            </MasonryWidget>

            <MasonryWidget 
              title="Delivery Time Analysis" 
              widgetId="delivery-time"
              drillDownOptions={[
                { label: 'By Hours', value: 'hours' },
                { label: 'By Days', value: 'days' },
                { label: 'By Route', value: 'route' }
              ]}
            >
              <DeliveryTimeWidget widgetId="delivery-time" />
            </MasonryWidget>

            <MasonryWidget 
              title="Weight Distribution" 
              widgetId="weight-distribution"
              drillDownOptions={[
                { label: 'By Weight', value: 'weight' },
                { label: 'By Package', value: 'package' },
                { label: 'By Route', value: 'route' }
              ]}
            >
              <WeightDistributionWidget widgetId="weight-distribution" />
            </MasonryWidget>

            <MasonryWidget 
              title="High Priority Alert" 
              widgetId="high-priority"
              drillDownOptions={[
                { label: 'Critical', value: 'critical' },
                { label: 'Urgent', value: 'urgent' },
                { label: 'All Alerts', value: 'all' }
              ]}
            >
              <div className="compact-widget">
                <Row gutter={8}>
                  <Col span={8}>
                    <Statistic
                      title="High Priority"
                      value={getFilteredData('high-priority', mockLogisticsData).filter(item => item.priority === 'High').length}
                      valueStyle={{ color: '#f5222d', fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Exceptions"
                      value={getFilteredData('high-priority', mockLogisticsData).filter(item => item.status === 'Exception').length}
                      valueStyle={{ color: '#f5222d', fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Revenue"
                      value={(getFilteredData('high-priority', mockLogisticsData).reduce((sum, item) => sum + item.cost, 0) / 1000).toFixed(0)}
                      prefix="$"
                      suffix="k"
                      valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                    />
                  </Col>
                </Row>
              </div>
            </MasonryWidget>

            <MasonryWidget 
              title="Capacity Utilization" 
              widgetId="capacity"
              drillDownOptions={[
                { label: 'Current', value: 'current' },
                { label: 'Projected', value: 'projected' },
                { label: 'Historical', value: 'historical' }
              ]}
            >
              <div className="compact-widget">
                <Row gutter={[8, 12]}>
                  <Col span={24}>
                    <Statistic
                      title="Total Shipments Processed"
                      value={getFilteredData('capacity', mockLogisticsData).length}
                      valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Avg Package Size"
                      value={getFilteredData('capacity', mockLogisticsData).length > 0 ? (getFilteredData('capacity', mockLogisticsData).reduce((sum, item) => sum + item.packageCount, 0) / getFilteredData('capacity', mockLogisticsData).length).toFixed(1) : 0}
                      suffix="pkg"
                      valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Success Rate"
                      value={getFilteredData('capacity', mockLogisticsData).length > 0 ? (((getFilteredData('capacity', mockLogisticsData).filter(item => item.status === 'Delivered' || item.status === 'In Transit').length) / getFilteredData('capacity', mockLogisticsData).length) * 100).toFixed(1) : 0}
                      suffix="%"
                      valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    />
                  </Col>
                </Row>
              </div>
            </MasonryWidget>

          </div>
        </Content>
        
        {/* Comprehensive Filter Sidebar */}
        <ComprehensiveFilterSidebar />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
