import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/AppComponents/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';

import SocialScreen from '../screens/SocialScreen';
import FriendList from '../screens/FriendList';
import GroupList from '../screens/GroupList';
import GroupScreen from '../screens/GroupScreen';

import ProfileScreen from '../screens/ProfileScreen';
import DogProfileScreen from '../screens/DogProfileScreen';
import AddDogScreen from '../screens/AddDogScreen';

import SearchScreen from '../screens/SearchScreen';
import OtherProfileScreen from '../screens/OtherProfileScreen';
import OtherDogProfileScreen from '../screens/OtherDogProfileScreen';

import InboxScreen from '../screens/InboxScreen';

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
  Friends: FriendList,
  Groups: GroupList,
  GroupScreen: GroupScreen,
  OtherProfile: OtherProfileScreen,
  OtherDogProfile: OtherDogProfileScreen,
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

const InboxStack = createStackNavigator({
  Inbox: InboxScreen,
});

InboxStack.navigationOptions = {
  tabBarLabel: 'Inbox',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-mail${focused ? '' : '-outline'}`
          : 'md-mail'
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

const SocialStack = createStackNavigator({
  Social: SocialScreen,
  Friends: FriendList,
  Groups: GroupList,
  GroupScreen: GroupScreen,
  OtherProfile: OtherProfileScreen,
  OtherDogProfile: OtherDogProfileScreen,
});

SocialStack.navigationOptions = {
  tabBarLabel: 'My Pack',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-contacts${focused ? '' : '-outline'}`
          : 'md-contacts'
      }
    />
  ),
};

export default createAppContainer(createBottomTabNavigator({
  HomeStack,SocialStack,SearchStack,InboxStack,ProfileStack,
}));

// export default createAppContainer(createDrawerNavigator({
//   HomeStack,SocialStack,SearchStack,InboxStack,ProfileStack,
// }));