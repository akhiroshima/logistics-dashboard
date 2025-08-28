import dayjs from 'dayjs';

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const statuses = ['In Transit', 'Delivered', 'Pending', 'Delayed', 'Exception'];
const priorities = ['High', 'Medium', 'Low'];

const generateMockData = (count = 50) => {
  console.log('Generating simplified mock data...');
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Simple date generation without complex dayjs operations
    const randomDays = Math.floor(Math.random() * 30) - 15; // -15 to +15 days from today
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + randomDays);
    
    data.push({
      id: i + 1,
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      deliveryDate: deliveryDate.toISOString().split('T')[0], // Simple YYYY-MM-DD format
      packageCount: Math.floor(Math.random() * 100) + 1,
      weight: Math.floor(Math.random() * 50) + 1,
      cost: Math.floor(Math.random() * 1000) + 50,
      distance: Math.floor(Math.random() * 5000) + 100,
      deliveryTime: Math.floor(Math.random() * 72) + 1, // hours
      timestamp: new Date().toISOString(),
      createdDate: deliveryDate.toISOString().split('T')[0]
    });
  }
  
  console.log(`Generated ${data.length} simplified mock records`);
  return data;
};

export const mockLogisticsData = generateMockData();

export const getCarrierPerformanceData = (filteredData = mockLogisticsData, grouping = 'all') => {
  const carrierStats = {};

  filteredData.forEach(item => {
    if (!carrierStats[item.carrier]) {
      carrierStats[item.carrier] = {
        carrier: item.carrier,
        totalPackages: 0,
        deliveredOnTime: 0,
        totalCost: 0,
        avgDeliveryTime: 0,
        totalDeliveryTime: 0,
        deliveryCount: 0
      };
    }

    carrierStats[item.carrier].totalPackages += item.packageCount;
    carrierStats[item.carrier].totalCost += item.cost;
    carrierStats[item.carrier].totalDeliveryTime += item.deliveryTime;
    carrierStats[item.carrier].deliveryCount += 1;

    if (item.status === 'Delivered' && item.deliveryTime <= 48) {
      carrierStats[item.carrier].deliveredOnTime += item.packageCount;
    }
  });

  let result = Object.values(carrierStats).map(stat => ({
    ...stat,
    onTimeRate: stat.totalPackages > 0 ? (stat.deliveredOnTime / stat.totalPackages * 100).toFixed(1) : '0.0',
    avgCost: stat.totalPackages > 0 ? (stat.totalCost / stat.totalPackages).toFixed(2) : '0.00',
    avgDeliveryTime: stat.deliveryCount > 0 ? (stat.totalDeliveryTime / stat.deliveryCount).toFixed(1) : '0.0'
  }));

  // Apply grouping filters
  if (grouping === 'top3') {
    result = result.sort((a, b) => b.totalPackages - a.totalPackages).slice(0, 3);
  } else if (grouping === 'performance') {
    result = result.filter(carrier => parseFloat(carrier.onTimeRate) > 80);
  }

  return result;
};

export const getRegionalData = (filteredData = mockLogisticsData, grouping = 'region') => {
  const regionalStats = {};

  filteredData.forEach(item => {
    let groupKey = item.region;
    
    // Adjust grouping based on drill-down selection
    if (grouping === 'country') {
      // Simulate country-level grouping
      const countryMap = {
        'North America': ['USA', 'Canada', 'Mexico'],
        'Europe': ['Germany', 'France', 'UK'],
        'Asia Pacific': ['Japan', 'Australia', 'Singapore'],
        'Latin America': ['Brazil', 'Argentina', 'Chile']
      };
      const countries = countryMap[item.region] || [item.region];
      groupKey = countries[Math.floor(Math.random() * countries.length)];
    } else if (grouping === 'city') {
      // Simulate city-level grouping
      const cityMap = {
        'North America': ['New York', 'Los Angeles', 'Chicago'],
        'Europe': ['London', 'Paris', 'Berlin'],
        'Asia Pacific': ['Tokyo', 'Sydney', 'Singapore'],
        'Latin America': ['São Paulo', 'Buenos Aires', 'Santiago']
      };
      const cities = cityMap[item.region] || [item.region];
      groupKey = cities[Math.floor(Math.random() * cities.length)];
    }

    if (!regionalStats[groupKey]) {
      regionalStats[groupKey] = {
        region: groupKey,
        totalShipments: 0,
        totalWeight: 0,
        totalDistance: 0,
        totalCost: 0
      };
    }

    regionalStats[groupKey].totalShipments += 1;
    regionalStats[groupKey].totalWeight += item.weight;
    regionalStats[groupKey].totalDistance += item.distance;
    regionalStats[groupKey].totalCost += item.cost;
  });
  
  return Object.values(regionalStats);
};

export const getTimeSeriesData = (filteredData = mockLogisticsData, grouping = 'day') => {
  const timeData = {};

  filteredData.forEach(item => {
    let dateKey = item.deliveryDate;
    
    // Group by different time periods
    if (grouping === 'week') {
      const date = new Date(item.deliveryDate);
      const week = Math.ceil(date.getDate() / 7);
      dateKey = `${item.deliveryDate.substring(0, 7)}-W${week}`;
    } else if (grouping === 'month') {
      dateKey = item.deliveryDate.substring(0, 7); // YYYY-MM
    } else if (grouping === 'year') {
      dateKey = item.deliveryDate.substring(0, 4); // YYYY
    }
    
    if (!timeData[dateKey]) {
      timeData[dateKey] = {
        date: dateKey,
        shipments: 0,
        packages: 0,
        cost: 0
      };
    }

    timeData[dateKey].shipments += 1;
    timeData[dateKey].packages += item.packageCount;
    timeData[dateKey].cost += item.cost;
  });

  return Object.values(timeData).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getStatusDistribution = (filteredData = mockLogisticsData) => {
  const statusStats = {};
  
  filteredData.forEach(item => {
    if (!statusStats[item.status]) {
      statusStats[item.status] = 0;
    }
    statusStats[item.status] += item.packageCount;
  });
  
  const totalPackages = filteredData.reduce((sum, item) => sum + item.packageCount, 0);
  
  return Object.entries(statusStats).map(([status, count]) => ({
    status,
    count,
    percentage: totalPackages > 0 ? (count / totalPackages * 100).toFixed(1) : '0.0'
  }));
};
