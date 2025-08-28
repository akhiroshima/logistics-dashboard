import dayjs from 'dayjs';

/**
 * Determines which drill-down options should be disabled based on active global filters
 */
export const getDisabledDrillDownOptions = (widgetId, globalFilters) => {
  const disabledOptions = [];

  // Helper function to calculate date range in days
  const getDateRangeDays = () => {
    if (globalFilters.dateRange.length === 2) {
      const start = dayjs(globalFilters.dateRange[0]);
      const end = dayjs(globalFilters.dateRange[1]);
      return end.diff(start, 'day');
    }
    return null;
  };

  switch (widgetId) {
    case 'cost-analysis':
      // Disable time groupings based on date range
      const dateRangeDays = getDateRangeDays();
      if (dateRangeDays !== null) {
        if (dateRangeDays < 7) {
          disabledOptions.push('week', 'month', 'quarter');
        } else if (dateRangeDays < 30) {
          disabledOptions.push('month', 'quarter');
        } else if (dateRangeDays < 90) {
          disabledOptions.push('quarter');
        }
      }
      break;

    case 'priority-breakdown':
      // Disable options based on selected priorities
      if (globalFilters.priorities.length > 0) {
        if (globalFilters.priorities.length === 1 && globalFilters.priorities[0] === 'High') {
          disabledOptions.push('all', 'medium_high');
        } else if (globalFilters.priorities.length === 2 && 
                   globalFilters.priorities.includes('High') && 
                   globalFilters.priorities.includes('Medium')) {
          disabledOptions.push('all', 'high'); // Since we have both High and Medium
        } else if (!globalFilters.priorities.includes('High')) {
          disabledOptions.push('high', 'medium_high');
        } else if (!globalFilters.priorities.includes('Medium') && !globalFilters.priorities.includes('Low')) {
          disabledOptions.push('medium_high');
        }
      }
      break;

    case 'carrier-performance':
      // Disable options based on selected carriers
      if (globalFilters.carriers.length > 0) {
        if (globalFilters.carriers.length === 1) {
          disabledOptions.push('all', 'top3'); // Only one carrier selected
        } else if (globalFilters.carriers.length === 2) {
          disabledOptions.push('top3'); // Only 2 carriers, "top3" doesn't make sense
        } else if (globalFilters.carriers.length >= 3) {
          // If 3+ carriers selected, "top3" could still be relevant
        }
      }
      break;

    case 'regional-distribution':
      // Disable options based on selected regions
      if (globalFilters.regions.length > 0) {
        if (globalFilters.regions.length === 1) {
          // If only one region, country/city drill-downs are still relevant
          // but "region" grouping is less meaningful
        }
      }
      break;

    case 'status-overview':
      // Disable options based on selected statuses
      if (globalFilters.statuses.length > 0) {
        const hasActiveStatuses = globalFilters.statuses.some(status => 
          ['In Transit', 'Delivered'].includes(status));
        const hasIssueStatuses = globalFilters.statuses.some(status => 
          ['Delayed', 'Exception'].includes(status));
        
        if (!hasActiveStatuses) {
          disabledOptions.push('active');
        }
        if (!hasIssueStatuses) {
          disabledOptions.push('issues');
        }
        if (globalFilters.statuses.length === 1) {
          disabledOptions.push('all');
        }
      }
      break;

    case 'live-stats':
      // Disable time-based options if date range is too long
      const liveStatsDateRange = getDateRangeDays();
      if (liveStatsDateRange !== null && liveStatsDateRange > 7) {
        disabledOptions.push('realtime', 'hour');
      }
      if (liveStatsDateRange !== null && liveStatsDateRange > 1) {
        disabledOptions.push('today');
      }
      break;

    case 'shipment-volume':
      // Disable time groupings based on date range
      const shipmentDateRange = getDateRangeDays();
      if (shipmentDateRange !== null) {
        if (shipmentDateRange < 7) {
          disabledOptions.push('week', 'month', 'year');
        } else if (shipmentDateRange < 30) {
          disabledOptions.push('month', 'year');
        } else if (shipmentDateRange < 365) {
          disabledOptions.push('year');
        }
      }
      break;

    case 'delivery-time':
      // Disable route option if distance range is very narrow
      const distanceRange = globalFilters.distanceRange;
      if (distanceRange[1] - distanceRange[0] < 500) {
        disabledOptions.push('route');
      }
      break;

    case 'weight-distribution':
      // Disable weight option if weight range is very narrow
      const weightRange = globalFilters.weightRange;
      if (weightRange[1] - weightRange[0] < 10) {
        disabledOptions.push('weight');
      }
      
      // Disable package option if package range is very narrow
      const packageRange = globalFilters.packageRange;
      if (packageRange[1] - packageRange[0] < 20) {
        disabledOptions.push('package');
      }
      break;

    case 'high-priority':
      // Disable options based on priority filters
      if (globalFilters.priorities.length > 0) {
        if (!globalFilters.priorities.includes('High')) {
          disabledOptions.push('critical', 'urgent');
        }
      }
      
      // Disable critical if no problem statuses are available
      if (globalFilters.statuses.length > 0) {
        const hasProblemStatuses = globalFilters.statuses.some(status => 
          ['Delayed', 'Exception'].includes(status));
        if (!hasProblemStatuses) {
          disabledOptions.push('critical');
        }
      }
      break;

    case 'capacity':
      // Disable historical if date range is in the future or very recent
      const capacityDateRange = getDateRangeDays();
      if (capacityDateRange !== null) {
        const startDate = dayjs(globalFilters.dateRange[0]);
        const now = dayjs();
        if (startDate.isAfter(now.subtract(7, 'day'))) {
          disabledOptions.push('historical');
        }
      }
      break;

    case 'performance-metrics':
      // Disable real-time options if date range is too old
      const performanceDateRange = getDateRangeDays();
      if (performanceDateRange !== null) {
        const endDate = dayjs(globalFilters.dateRange[1]);
        const now = dayjs();
        if (endDate.isBefore(now.subtract(1, 'day'))) {
          disabledOptions.push('realtime');
        }
        if (endDate.isBefore(now.subtract(1, 'hour'))) {
          disabledOptions.push('hour');
        }
      }
      break;

    default:
      // No specific logic for other widgets
      break;
  }

  return disabledOptions;
};
