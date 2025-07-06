import { DAY_MAPPING } from '../utils/constants';

interface CustomerData {
  name: string;
  address: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  trip_days: string;
  delivery_code: string;
  avg_volume?: number;
  maintenance_revenue?: number;
  rental_items?: any[];
  route_data?: {
    stop_sequence?: number;
  };
  data_sources?: {
    has_master_data: boolean;
    has_route_data: boolean;
  };
}

interface MegaDatabase {
  [customerNumber: string]: CustomerData;
}

class DatabaseManager {
  private megaDatabase: MegaDatabase | null = null;
  private loading: boolean = false;

  async initialize(): Promise<void> {
    await this.loadMegaDatabase();
  }

  async loadMegaDatabase(): Promise<MegaDatabase> {
    if (this.megaDatabase) {
      return this.megaDatabase;
    }

    if (this.loading) {
      // Wait for current loading to complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loading && this.megaDatabase) {
            resolve(this.megaDatabase);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    this.loading = true;

    try {
      // Load MEGA DATABASE from bundled asset
      const megaDatabaseData = require('../data/MEGA_DATABASE.json');
      this.megaDatabase = megaDatabaseData;
      
      console.log(`📊 MEGA DATABASE loaded: ${Object.keys(this.megaDatabase).length} customers`);
      
      return this.megaDatabase;
    } catch (error) {
      console.error('❌ Error loading MEGA DATABASE:', error);
      throw new Error('Failed to load MEGA DATABASE');
    } finally {
      this.loading = false;
    }
  }

  async getCustomer(customerNumber: string): Promise<CustomerData | null> {
    const database = await this.loadMegaDatabase();
    return database[customerNumber] || null;
  }

  async getCustomersByDay(day: string): Promise<Record<string, CustomerData>> {
    const database = await this.loadMegaDatabase();
    const result: Record<string, CustomerData> = {};

    const dayChar = DAY_MAPPING[day as keyof typeof DAY_MAPPING];
    if (!dayChar) {
      console.warn(`Unknown day: ${day}`);
      return result;
    }

    for (const [customerNum, customerData] of Object.entries(database)) {
      const tripDays = customerData.trip_days;
      if (tripDays && tripDays.includes(dayChar)) {
        // Only include customers with valid coordinates
        if (customerData.coordinates?.latitude && customerData.coordinates?.longitude) {
          result[customerNum] = customerData;
        }
      }
    }

    console.log(`📅 Found ${Object.keys(result).length} customers for ${day}`);
    return result;
  }

  async searchCustomers(query: string): Promise<Record<string, CustomerData>> {
    const database = await this.loadMegaDatabase();
    const result: Record<string, CustomerData> = {};
    const lowerQuery = query.toLowerCase();

    for (const [customerNum, customerData] of Object.entries(database)) {
      if (
        customerNum.toLowerCase().includes(lowerQuery) ||
        customerData.name.toLowerCase().includes(lowerQuery) ||
        customerData.address.toLowerCase().includes(lowerQuery) ||
        customerData.city.toLowerCase().includes(lowerQuery)
      ) {
        result[customerNum] = customerData;
      }
    }

    return result;
  }

  async getDatabaseStats(): Promise<{
    totalCustomers: number;
    withCoordinates: number;
    withRentalItems: number;
    byDay: Record<string, number>;
    coordinatesCoverage: number;
    rentalDataCoverage: number;
  }> {
    const database = await this.loadMegaDatabase();
    const stats = {
      totalCustomers: Object.keys(database).length,
      withCoordinates: 0,
      withRentalItems: 0,
      byDay: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      },
      coordinatesCoverage: 0,
      rentalDataCoverage: 0,
    };

    const reverseDayMapping: Record<string, string> = {
      'M': 'Monday',
      'T': 'Tuesday',
      'W': 'Wednesday',
      'H': 'Thursday',
      'F': 'Friday',
      'S': 'Saturday',
    };

    for (const customerData of Object.values(database)) {
      // Count coordinates
      if (customerData.coordinates?.latitude && customerData.coordinates?.longitude) {
        stats.withCoordinates++;
      }

      // Count rental items
      if (customerData.rental_items && customerData.rental_items.length > 0) {
        stats.withRentalItems++;
      }

      // Count by day
      const tripDays = customerData.trip_days;
      if (tripDays) {
        for (let i = 0; i < tripDays.length; i++) {
          const char = tripDays[i];
          const dayName = reverseDayMapping[char];
          if (dayName) {
            stats.byDay[dayName as keyof typeof stats.byDay]++;
          }
        }
      }
    }

    stats.coordinatesCoverage = (stats.withCoordinates / stats.totalCustomers) * 100;
    stats.rentalDataCoverage = (stats.withRentalItems / stats.totalCustomers) * 100;

    return stats;
  }

  isLoaded(): boolean {
    return this.megaDatabase !== null;
  }

  getLoadedDatabase(): MegaDatabase | null {
    return this.megaDatabase;
  }
}

// Export singleton instance
export default new DatabaseManager();