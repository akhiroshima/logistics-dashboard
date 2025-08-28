import React from 'react';
import { 
  Drawer, 
  Space, 
  Button, 
  Select, 
  DatePicker, 
  Slider, 
  InputNumber,
  Divider,
  Typography,
  Row,
  Col,
  Tag
} from 'antd';
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useDashboardStore from '../store/dashboardStore';
import { mockLogisticsData } from '../data/mockData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ComprehensiveFilterSidebar = () => {
  const { 
    filterSidebarOpen, 
    setFilterSidebarOpen, 
    globalFilters, 
    setGlobalArrayFilter,
    setGlobalRangeFilter,
    clearGlobalFilters,
    getFilteredData
  } = useDashboardStore();

  // Extract unique values from data for filter options
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const statuses = ['In Transit', 'Delivered', 'Pending', 'Delayed', 'Exception'];
  const priorities = ['High', 'Medium', 'Low'];

  // Calculate data ranges for sliders
  const dataRanges = React.useMemo(() => {
    const costs = mockLogisticsData.map(item => item.cost);
    const weights = mockLogisticsData.map(item => item.weight);
    const packages = mockLogisticsData.map(item => item.packageCount);
    const distances = mockLogisticsData.map(item => item.distance);
    const deliveryTimes = mockLogisticsData.map(item => item.deliveryTime);

    return {
      cost: [Math.min(...costs), Math.max(...costs)],
      weight: [Math.min(...weights), Math.max(...weights)],
      package: [Math.min(...packages), Math.max(...packages)],
      distance: [Math.min(...distances), Math.max(...distances)],
      deliveryTime: [Math.min(...deliveryTimes), Math.max(...deliveryTimes)]
    };
  }, []);

  const filteredDataCount = getFilteredData('filter-preview', mockLogisticsData).length;

  const handleClearFilters = () => {
    clearGlobalFilters();
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterOutlined />
          <span>Dashboard Filters</span>
          <Tag color="blue">{filteredDataCount} records</Tag>
        </div>
      }
      placement="right"
      onClose={() => setFilterSidebarOpen(false)}
      open={filterSidebarOpen}
      width={400}
      extra={
        <Button 
          icon={<ClearOutlined />} 
          onClick={handleClearFilters}
          type="text"
          size="small"
        >
          Clear All
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          <Text strong>📅 Date Range</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Use the date range picker in the top header to filter by delivery dates. 
            It includes quick presets for week, month, quarter, and year.
          </Text>
        </div>

        {/* Multi-Select Filters */}
        <div>
          <Title level={5}>🚚 Carriers</Title>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select carriers"
            value={globalFilters.carriers}
            onChange={(values) => setGlobalArrayFilter('carriers', values)}
            maxTagCount="responsive"
          >
            {carriers.map(carrier => (
              <Option key={carrier} value={carrier}>{carrier}</Option>
            ))}
          </Select>
        </div>

        <div>
          <Title level={5}>🌍 Regions</Title>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select regions"
            value={globalFilters.regions}
            onChange={(values) => setGlobalArrayFilter('regions', values)}
            maxTagCount="responsive"
          >
            {regions.map(region => (
              <Option key={region} value={region}>{region}</Option>
            ))}
          </Select>
        </div>

        <div>
          <Title level={5}>📦 Status</Title>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select statuses"
            value={globalFilters.statuses}
            onChange={(values) => setGlobalArrayFilter('statuses', values)}
            maxTagCount="responsive"
          >
            {statuses.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </div>

        <div>
          <Title level={5}>⚡ Priority</Title>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select priorities"
            value={globalFilters.priorities}
            onChange={(values) => setGlobalArrayFilter('priorities', values)}
            maxTagCount="responsive"
          >
            {priorities.map(priority => (
              <Option key={priority} value={priority}>{priority}</Option>
            ))}
          </Select>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Range Filters */}
        <div>
          <Title level={5}>💰 Cost Range</Title>
          <Slider
            range
            min={dataRanges.cost[0]}
            max={dataRanges.cost[1]}
            value={globalFilters.costRange}
            onChange={(range) => setGlobalRangeFilter('costRange', range)}
            tooltip={{
              formatter: (value) => `$${value}`
            }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.costRange[0]}
                onChange={(value) => setGlobalRangeFilter('costRange', [value, globalFilters.costRange[1]])}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.costRange[1]}
                onChange={(value) => setGlobalRangeFilter('costRange', [globalFilters.costRange[0], value])}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>⚖️ Weight Range (kg)</Title>
          <Slider
            range
            min={dataRanges.weight[0]}
            max={dataRanges.weight[1]}
            value={globalFilters.weightRange}
            onChange={(range) => setGlobalRangeFilter('weightRange', range)}
            tooltip={{
              formatter: (value) => `${value} kg`
            }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.weightRange[0]}
                onChange={(value) => setGlobalRangeFilter('weightRange', [value, globalFilters.weightRange[1]])}
                suffix="kg"
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.weightRange[1]}
                onChange={(value) => setGlobalRangeFilter('weightRange', [globalFilters.weightRange[0], value])}
                suffix="kg"
              />
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>📦 Package Count</Title>
          <Slider
            range
            min={dataRanges.package[0]}
            max={dataRanges.package[1]}
            value={globalFilters.packageRange}
            onChange={(range) => setGlobalRangeFilter('packageRange', range)}
            tooltip={{
              formatter: (value) => `${value} packages`
            }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.packageRange[0]}
                onChange={(value) => setGlobalRangeFilter('packageRange', [value, globalFilters.packageRange[1]])}
                suffix="pkg"
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.packageRange[1]}
                onChange={(value) => setGlobalRangeFilter('packageRange', [globalFilters.packageRange[0], value])}
                suffix="pkg"
              />
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>🛣️ Distance Range (km)</Title>
          <Slider
            range
            min={dataRanges.distance[0]}
            max={dataRanges.distance[1]}
            value={globalFilters.distanceRange}
            onChange={(range) => setGlobalRangeFilter('distanceRange', range)}
            tooltip={{
              formatter: (value) => `${value} km`
            }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.distanceRange[0]}
                onChange={(value) => setGlobalRangeFilter('distanceRange', [value, globalFilters.distanceRange[1]])}
                suffix="km"
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.distanceRange[1]}
                onChange={(value) => setGlobalRangeFilter('distanceRange', [globalFilters.distanceRange[0], value])}
                suffix="km"
              />
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>⏱️ Delivery Time (hours)</Title>
          <Slider
            range
            min={dataRanges.deliveryTime[0]}
            max={dataRanges.deliveryTime[1]}
            value={globalFilters.deliveryTimeRange}
            onChange={(range) => setGlobalRangeFilter('deliveryTimeRange', range)}
            tooltip={{
              formatter: (value) => `${value} hours`
            }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.deliveryTimeRange[0]}
                onChange={(value) => setGlobalRangeFilter('deliveryTimeRange', [value, globalFilters.deliveryTimeRange[1]])}
                suffix="h"
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                style={{ width: '100%' }}
                value={globalFilters.deliveryTimeRange[1]}
                onChange={(value) => setGlobalRangeFilter('deliveryTimeRange', [globalFilters.deliveryTimeRange[0], value])}
                suffix="h"
              />
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Summary */}
        <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '6px' }}>
          <Text strong>Active Filters Summary:</Text>
          <br />
          <Text type="secondary">
            Showing {filteredDataCount} of {mockLogisticsData.length} total records
          </Text>
          {globalFilters.carriers.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">Carriers: {globalFilters.carriers.join(', ')}</Text>
            </div>
          )}
          {globalFilters.regions.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">Regions: {globalFilters.regions.join(', ')}</Text>
            </div>
          )}
          {globalFilters.statuses.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">Status: {globalFilters.statuses.join(', ')}</Text>
            </div>
          )}
          {globalFilters.priorities.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">Priority: {globalFilters.priorities.join(', ')}</Text>
            </div>
          )}
        </div>

      </Space>
    </Drawer>
  );
};

export default ComprehensiveFilterSidebar;
