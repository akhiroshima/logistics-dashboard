import React from 'react';
import { Row, Col } from 'antd';
import DashboardWidget from './DashboardWidget';
import CarrierPerformanceWidget from './widgets/CarrierPerformanceWidget';
import RegionalDistributionWidget from './widgets/RegionalDistributionWidget';
import ShipmentVolumeWidget from './widgets/ShipmentVolumeWidget';
import StatusOverviewWidget from './widgets/StatusOverviewWidget';
import CostAnalysisWidget from './widgets/CostAnalysisWidget';
import DeliveryTimeWidget from './widgets/DeliveryTimeWidget';
import PriorityBreakdownWidget from './widgets/PriorityBreakdownWidget';
import WeightDistributionWidget from './widgets/WeightDistributionWidget';

const WidgetGrid = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Carrier Performance"
          widgetId="carrier-performance"
          component={CarrierPerformanceWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Regional Distribution"
          widgetId="regional-distribution"
          component={RegionalDistributionWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Shipment Volume Trends"
          widgetId="shipment-volume"
          component={ShipmentVolumeWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Status Overview"
          widgetId="status-overview"
          component={StatusOverviewWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Cost Analysis"
          widgetId="cost-analysis"
          component={CostAnalysisWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Delivery Time Analysis"
          widgetId="delivery-time"
          component={DeliveryTimeWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Priority Breakdown"
          widgetId="priority-breakdown"
          component={PriorityBreakdownWidget}
        />
      </Col>
      
      <Col xs={24} lg={12}>
        <DashboardWidget
          title="Weight Distribution"
          widgetId="weight-distribution"
          component={WeightDistributionWidget}
        />
      </Col>
    </Row>
  );
};

export default WidgetGrid;
