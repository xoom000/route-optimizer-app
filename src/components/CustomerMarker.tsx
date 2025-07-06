import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
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

interface CustomerMarkerProps {
  customer: Customer;
  index: number;
  onPress?: () => void;
}

const CustomerMarker: React.FC<CustomerMarkerProps> = ({
  customer,
  index,
  onPress,
}) => {
  return (
    <Marker
      coordinate={{
        latitude: customer.coordinates.latitude,
        longitude: customer.coordinates.longitude,
      }}
      onPress={onPress}
      title={customer.name}
      description={`#${customer.customerNum} - ${customer.address}`}
    >
      <View style={styles.markerContainer}>
        <View style={styles.markerNumber}>
          <Text style={styles.numberText}>{index}</Text>
        </View>
        <View style={styles.markerPin} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  numberText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  markerPin: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -2,
  },
});

export default CustomerMarker;