import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import LoadingScreen from './LoadingScreen'; 

import Registration from './Registration/Registration'; 
import SignInScreen from './Registration/SignInScreen';
import SignUpScreen from './Registration/SignUpScreen';

import Dashboard from './Navigation/Dashboard';
import Library from './Navigation/Library';
import Profile from './Navigation/Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      colors: {
        background: '#222831', // Match this with your app background
      },
    }}>
      <Stack.Navigator 
        initialRouteName="LoadingScreen"
        screenOptions={{ headerShown: false }} // Hides the header for all screens
      >
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Library" component={Library} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
