# 🚀 Logistics Dashboard

A comprehensive, interactive logistics dashboard built with React, featuring advanced filtering, smart date input, and real-time data visualization.

## ✨ Features

### 📊 **Interactive Widgets**
- **Carrier Performance Analysis** - Track performance metrics across all carriers
- **Regional Distribution** - Geographic distribution with interactive charts
- **Status Overview** - Real-time shipment status tracking
- **Shipment Volume Trends** - Time-series analysis with multiple groupings
- **Cost Analysis** - Financial insights with interactive filtering
- **Weight Distribution** - Package analytics with scatter plots
- **Priority Breakdown** - Priority-based shipment analysis
- **Delivery Time Analytics** - Performance metrics and SLA tracking

### 🎯 **Smart Filtering System**
- **Natural Language Date Input** - Type "Q1 2023", "Last Quarter", "YTD"
- **Global Filters** - Apply filters across all widgets simultaneously
- **Interactive Charts** - Click on data points to apply instant filters
- **Widget-Specific Drill-downs** - Individual widget filtering capabilities
- **Intelligent Filter Disabling** - Context-aware filter recommendations

### 🎨 **Modern UI/UX**
- **Masonry Layout** - Responsive, space-efficient widget arrangement
- **Real-time Updates** - Live data synchronization
- **Active Filter Display** - Visual representation of applied filters
- **Mobile Responsive** - Optimized for all screen sizes

## 🛠️ **Technology Stack**

- **Frontend**: React 18
- **UI Library**: Ant Design 5
- **State Management**: Zustand
- **Charts**: Recharts
- **Date Handling**: Day.js
- **Build Tool**: Create React App
- **Deployment**: Netlify

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

## 📱 **Live Demo**

Visit the live demo: [Logistics Dashboard](https://your-netlify-url.netlify.app)

## 🎯 **Smart Date Input Examples**

The dashboard features an intelligent date picker that understands natural language:

- `"2024"` → Full year 2024
- `"Q1 2023"` → January-March 2023
- `"Last Quarter"` → Previous quarter from today
- `"This Month"` → Current month
- `"YTD"` → Year to date
- `"Mar 2023"` → March 2023
- `"Last 30 Days"` → Rolling 30-day period

## 🔧 **Development**

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── widgets/         # Dashboard widgets
│   ├── MasonryWidget.js # Widget wrapper
│   └── SmartDateInput.js # Natural language date picker
├── store/               # Zustand state management
├── data/                # Mock data and utilities
├── utils/               # Helper functions
└── App.js              # Main application component
```

### Key Components
- **App.js** - Main dashboard layout and state management
- **MasonryWidget** - Reusable widget wrapper with drill-down controls
- **SmartDateInput** - Natural language date parsing component
- **ComprehensiveFilterSidebar** - Global filter management
- **ActiveFiltersDisplay** - Visual filter state representation

## 📦 **Deployment**

This project is configured for Netlify deployment with:
- Optimized build settings
- SPA routing support
- Security headers
- Asset caching
- Build environment configuration

## 📄 **License**

MIT License - Feel free to use this project for learning and development!

---

Built with ❤️ for modern logistics operations
