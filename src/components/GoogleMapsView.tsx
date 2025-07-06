import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { GOOGLE_MAPS_CONFIG, SHOP_LOCATION, COLORS } from '../utils/constants';
import CustomerMarker from './CustomerMarker';

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

interface GoogleMapsViewProps {
  customers: Customer[];
  optimizedRoute?: Array<{ latitude: number; longitude: number }>;
  onMarkerPress?: (customer: Customer) => void;
  onMapPress?: () => void;
  showUserLocation?: boolean;
}

const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  customers = [],
  optimizedRoute = [],
  onMarkerPress,
  onMapPress,
  showUserLocation = true,
}) => {
  const handleMarkerPress = (customer: Customer) => {
    if (onMarkerPress) {
      onMarkerPress(customer);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...GOOGLE_MAPS_CONFIG.center,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
        onPress={onMapPress}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* Shop marker - starting point */}
        <Marker
          coordinate={SHOP_LOCATION}
          title={SHOP_LOCATION.title}
          description={SHOP_LOCATION.address}
          pinColor={COLORS.warning}
          identifier="shop"
        />

        {/* Customer markers */}
        {customers.map((customer, index) => (
          <CustomerMarker
            key={customer.id}
            customer={customer}
            index={index + 1}
            onPress={() => handleMarkerPress(customer)}
          />
        ))}

        {/* Optimized route polyline */}
        {optimizedRoute.length > 0 && (
          <Polyline
            coordinates={optimizedRoute}
            strokeColor={COLORS.primary}
            strokeWidth={4}
            strokePattern={[1]}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default GoogleMapsView;