/**
 * Route Optimizer App - React Native
 * Direct Google Maps Integration with MEGA DATABASE
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './src/screens/MapScreen';
import { COLORS } from './src/utils/constants';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.dark,
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen 
            name="Map" 
            component={MapScreen}
            options={{
              title: 'Route Optimizer',
              tabBarLabel: 'Map',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default App;
