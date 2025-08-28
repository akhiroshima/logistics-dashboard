import { create } from 'zustand';
import dayjs from 'dayjs';

const useDashboardStore = create((set, get) => ({
  // Global filters
  deliveryDate: dayjs().format('YYYY-MM-DD'),
  globalFilters: {
    // Multi-select filters
    carriers: [], // ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics']
    regions: [], // ['North America', 'Europe', 'Asia Pacific', 'Latin America']
    statuses: [], // ['In Transit', 'Delivered', 'Pending', 'Delayed', 'Exception']
    priorities: [], // ['High', 'Medium', 'Low']
    
    // Range filters
    dateRange: [], // [startDate, endDate]
    costRange: [0, 1100], // [min, max] cost
    weightRange: [0, 55], // [min, max] weight in kg
    packageRange: [0, 105], // [min, max] package count
    distanceRange: [0, 5500], // [min, max] distance in km
    deliveryTimeRange: [0, 75], // [min, max] delivery time in hours
    
    // Legacy single-select (for backward compatibility)
    carrier: '',
    region: '',
    status: '',
    priority: ''
  },
  
  // UI state
  filterSidebarOpen: false,
  
  // Widget-specific filters
  widgetFilters: {},
  
  // Actions
  setDeliveryDate: (date) => set({ deliveryDate: date }),
  
    setGlobalFilter: (key, value) => set((state) => ({
    globalFilters: {
      ...state.globalFilters,
      [key]: value
    }
  })),

  setGlobalArrayFilter: (key, values) => set((state) => ({
    globalFilters: {
      ...state.globalFilters,
      [key]: values
    }
  })),

  setGlobalRangeFilter: (key, range) => set((state) => ({
    globalFilters: {
      ...state.globalFilters,
      [key]: range
    }
  })),

  clearGlobalFilters: () => set({
    globalFilters: {
      // Multi-select filters
      carriers: [],
      regions: [],
      statuses: [],
      priorities: [],
      
      // Range filters
      dateRange: [],
      costRange: [0, 1100],
      weightRange: [0, 55],
      packageRange: [0, 105],
      distanceRange: [0, 5500],
      deliveryTimeRange: [0, 75],
      
      // Legacy single-select
      carrier: '',
      region: '',
      status: '',
      priority: ''
    }
  }),
  
  setFilterSidebarOpen: (open) => set({ filterSidebarOpen: open }),
  
  setWidgetFilter: (widgetId, filterType, value) => set((state) => ({
    widgetFilters: {
      ...state.widgetFilters,
      [widgetId]: {
        ...state.widgetFilters[widgetId],
        [filterType]: value
      }
    }
  })),
  
    getFilteredData: (widgetId, rawData) => {
    const state = get();
    const globalFilters = state.globalFilters;
    const widgetFilters = state.widgetFilters[widgetId] || {};

    let filteredData = rawData.filter(item => {
      // Apply legacy single-select filters (for backward compatibility)
      if (globalFilters.carrier && item.carrier !== globalFilters.carrier) return false;
      if (globalFilters.region && item.region !== globalFilters.region) return false;
      if (globalFilters.status && item.status !== globalFilters.status) return false;
      if (globalFilters.priority && item.priority !== globalFilters.priority) return false;

      // Apply multi-select filters
      if (globalFilters.carriers.length > 0 && !globalFilters.carriers.includes(item.carrier)) return false;
      if (globalFilters.regions.length > 0 && !globalFilters.regions.includes(item.region)) return false;
      if (globalFilters.statuses.length > 0 && !globalFilters.statuses.includes(item.status)) return false;
      if (globalFilters.priorities.length > 0 && !globalFilters.priorities.includes(item.priority)) return false;

      // Apply date range filter
      if (globalFilters.dateRange.length === 2) {
        const itemDate = new Date(item.deliveryDate);
        const startDate = new Date(globalFilters.dateRange[0]);
        const endDate = new Date(globalFilters.dateRange[1]);
        if (itemDate < startDate || itemDate > endDate) return false;
      } else if (state.deliveryDate) {
        // Fallback to single date filtering
        const selectedMonth = state.deliveryDate.substring(0, 7); // YYYY-MM
        const itemMonth = item.deliveryDate.substring(0, 7); // YYYY-MM
        if (selectedMonth !== itemMonth) return false;
      }

      // Apply range filters
      if (item.cost < globalFilters.costRange[0] || item.cost > globalFilters.costRange[1]) return false;
      if (item.weight < globalFilters.weightRange[0] || item.weight > globalFilters.weightRange[1]) return false;
      if (item.packageCount < globalFilters.packageRange[0] || item.packageCount > globalFilters.packageRange[1]) return false;
      if (item.distance < globalFilters.distanceRange[0] || item.distance > globalFilters.distanceRange[1]) return false;
      if (item.deliveryTime < globalFilters.deliveryTimeRange[0] || item.deliveryTime > globalFilters.deliveryTimeRange[1]) return false;

      return true;
    });

    // Apply widget-specific filters
    if (widgetFilters.timeGrouping) {
      console.log(`Applying ${widgetFilters.timeGrouping} filter to widget ${widgetId}`);
      
      // Priority-based filters
      if (widgetFilters.timeGrouping === 'high') {
        filteredData = filteredData.filter(item => item.priority === 'High');
      } else if (widgetFilters.timeGrouping === 'medium_high') {
        filteredData = filteredData.filter(item => ['High', 'Medium'].includes(item.priority));
      } else if (widgetFilters.timeGrouping === 'all') {
        // Keep all data (no additional filtering)
        filteredData = filteredData;
      
      // Status-based filters
      } else if (widgetFilters.timeGrouping === 'active') {
        filteredData = filteredData.filter(item => ['In Transit', 'Delivered'].includes(item.status));
      } else if (widgetFilters.timeGrouping === 'issues') {
        filteredData = filteredData.filter(item => ['Delayed', 'Exception'].includes(item.status));
      
      // Critical/urgent filters
      } else if (widgetFilters.timeGrouping === 'critical') {
        filteredData = filteredData.filter(item => item.priority === 'High' && ['Delayed', 'Exception'].includes(item.status));
      } else if (widgetFilters.timeGrouping === 'urgent') {
        filteredData = filteredData.filter(item => item.priority === 'High' || item.status === 'Exception');
      
      // Carrier-based filters
      } else if (widgetFilters.timeGrouping === 'top3') {
        const carrierCounts = {};
        filteredData.forEach(item => {
          carrierCounts[item.carrier] = (carrierCounts[item.carrier] || 0) + 1;
        });
        const top3Carriers = Object.entries(carrierCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([carrier]) => carrier);
        filteredData = filteredData.filter(item => top3Carriers.includes(item.carrier));
      } else if (widgetFilters.timeGrouping === 'performance') {
        // Filter to carriers with >80% on-time delivery
        const carrierPerformance = {};
        filteredData.forEach(item => {
          if (!carrierPerformance[item.carrier]) {
            carrierPerformance[item.carrier] = { total: 0, onTime: 0 };
          }
          carrierPerformance[item.carrier].total++;
          if (item.status === 'Delivered' && item.deliveryTime <= 48) {
            carrierPerformance[item.carrier].onTime++;
          }
        });
        const goodCarriers = Object.entries(carrierPerformance)
          .filter(([carrier, stats]) => (stats.onTime / stats.total) > 0.8)
          .map(([carrier]) => carrier);
        filteredData = filteredData.filter(item => goodCarriers.includes(item.carrier));
      
      // Time-based filters for live stats
      } else if (widgetFilters.timeGrouping === 'realtime') {
        // Show only last 15 minutes worth of data (simulate real-time)
        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        filteredData = filteredData.filter(item => new Date(item.timestamp) > fifteenMinutesAgo);
      } else if (widgetFilters.timeGrouping === 'hour') {
        // Show only last hour
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        filteredData = filteredData.filter(item => new Date(item.timestamp) > oneHourAgo);
      } else if (widgetFilters.timeGrouping === 'today') {
        // Show only today's data
        const today = new Date().toISOString().split('T')[0];
        filteredData = filteredData.filter(item => item.deliveryDate === today);
      
      // Route/distance-based filters
      } else if (widgetFilters.timeGrouping === 'route') {
        // Group by distance ranges (short/medium/long routes)
        filteredData = filteredData.filter(item => item.distance > 1000); // Long routes only
      } else if (widgetFilters.timeGrouping === 'hours') {
        // Filter by delivery time < 24 hours
        filteredData = filteredData.filter(item => item.deliveryTime <= 24);
      } else if (widgetFilters.timeGrouping === 'days') {
        // Filter by delivery time > 24 hours
        filteredData = filteredData.filter(item => item.deliveryTime > 24);
      
      // Weight-based filters
      } else if (widgetFilters.timeGrouping === 'weight') {
        // Filter heavy packages (>25kg)
        filteredData = filteredData.filter(item => item.weight > 25);
      } else if (widgetFilters.timeGrouping === 'package') {
        // Filter large package counts (>50 packages)
        filteredData = filteredData.filter(item => item.packageCount > 50);
      
      // Regional filters (simulate by region)
      } else if (widgetFilters.timeGrouping === 'region') {
        // Keep all regions (default)
        filteredData = filteredData;
      } else if (widgetFilters.timeGrouping === 'country') {
        // Filter to North America and Europe only
        filteredData = filteredData.filter(item => ['North America', 'Europe'].includes(item.region));
      } else if (widgetFilters.timeGrouping === 'city') {
        // Filter to major metropolitan areas (simulate with high volume)
        const cityCarriers = ['FedEx', 'UPS']; // Simulate city carriers
        filteredData = filteredData.filter(item => cityCarriers.includes(item.carrier));
      
      // Capacity/projection filters
      } else if (widgetFilters.timeGrouping === 'current') {
        // Keep current data (no filter)
        filteredData = filteredData;
      } else if (widgetFilters.timeGrouping === 'projected') {
        // Simulate projected data by multiplying values
        filteredData = filteredData.map(item => ({
          ...item,
          packageCount: Math.floor(item.packageCount * 1.2), // 20% growth projection
          cost: item.cost * 1.15 // 15% cost increase
        }));
      } else if (widgetFilters.timeGrouping === 'historical') {
        // Filter to older data only
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredData = filteredData.filter(item => new Date(item.deliveryDate) < oneWeekAgo);
      }
    }

    return filteredData;
  }
}));

// Simplified time grouping (removed for now to avoid dayjs issues)
// Will add back once basic filtering works

export default useDashboardStore;
