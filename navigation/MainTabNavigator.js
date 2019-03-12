import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/AppComponents/TabBarIcon';
import TestScreen from '../screens/TestScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DogProfileScreen from '../screens/DogProfileScreen';
import AddDogScreen from '../screens/AddDogScreen';
import OtherProfileScreen from '../screens/OtherProfileScreen';
import OtherDogProfileScreen from '../screens/OtherDogProfileScreen';
import SearchScreen from '../screens/SearchScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  DogProfile: DogProfileScreen,
  AddDogProfile: AddDogScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-contact${focused ? '' : '-outline'}`
          : 'md-contact'
      }
    />
  ),
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
  OtherProfile: OtherProfileScreen,
  OtherDogProfile: OtherDogProfileScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-search${focused ? '' : '-outline'}`
          : 'md-search'
      }
    />
  ),
};

const TestStack = createStackNavigator({
  Test: TestScreen,
  OtherProfile: OtherProfileScreen,
  OtherDogProfile: OtherDogProfileScreen,
});

TestStack.navigationOptions = {
  tabBarLabel: 'Test',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

export default createAppContainer(createBottomTabNavigator({
  HomeStack,TestStack,SearchStack,ProfileStack,
}));
