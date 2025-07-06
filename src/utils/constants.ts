// Constants for Route Optimizer App

export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'AIzaSyAHmmIfe14_ampOufEVnH3mQzTtoHV7Yfo', // From CLAUDE.md
  center: {
    latitude: 40.5865,   // Redding, CA
    longitude: -122.3917
  },
  zoom: 12,
  libraries: ['geometry', 'places', 'visualization']
};

export const SHOP_LOCATION = {
  latitude: 40.5865,
  longitude: -122.3917,
  title: 'Cintas Shop - Route 33',
  address: '2502 Churn Creek Rd, Redding, CA'
};

export const DAY_MAPPING = {
  'Monday': 'M',
  'Tuesday': 'T',
  'Wednesday': 'W',
  'Thursday': 'H', // Thursday uses 'H' not 'R'
  'Friday': 'F',
  'Saturday': 'S'
};

export const COLORS = {
  primary: '#007AFF',
  secondary: '#667eea',
  success: '#48bb78',
  danger: '#f56565',
  warning: '#ed8936',
  info: '#4299e1',
  light: '#f7fafc',
  dark: '#2d3748',
  white: '#ffffff',
  black: '#000000'
};

export const ROUTE_STATS_DEFAULTS = {
  totalDistance: 0,
  totalDuration: 0,
  totalStops: 0,
  efficiency: 0
};