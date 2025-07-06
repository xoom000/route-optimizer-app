import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import GoogleMapsView from '../components/GoogleMapsView';
import DatabaseManager from '../services/DatabaseManager';
import { COLORS } from '../utils/constants';

interface Customer {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  customerNum: string;
  amount?: number;
}

const MapScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Wednesday'); // Default to Wednesday

  useEffect(() => {
    loadCustomersForDay();
  }, [selectedDay]);

  const loadCustomersForDay = async () => {
    try {
      setLoading(true);
      await DatabaseManager.initialize();
      
      const customersData = await DatabaseManager.getCustomersByDay(selectedDay);
      
      // Transform database format to component format
      const transformedCustomers: Customer[] = Object.entries(customersData).map(
        ([customerNum, data]) => ({
          id: customerNum,
          customerNum,
          name: data.name,
          address: data.address,
          coordinates: data.coordinates,
          amount: data.avg_volume,
        })
      );

      setCustomers(transformedCustomers);
      console.log(`📍 Loaded ${transformedCustomers.length} customers for ${selectedDay}`);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Error', 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (customer: Customer) => {
    Alert.alert(
      customer.name,
      `Customer #${customer.customerNum}\n${customer.address}\nVolume: ${customer.amount || 'N/A'}`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading MEGA DATABASE...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleMapsView
        customers={customers}
        onMarkerPress={handleMarkerPress}
        showUserLocation={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.dark,
  },
});

export default MapScreen;