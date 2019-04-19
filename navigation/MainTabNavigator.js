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

import SearchScreen from '../screens/SearchScreen';
import OtherProfileScreen from '../screens/OtherProfileScreen';
import OtherDogProfileScreen from '../screens/OtherDogProfileScreen';
import Colors from '../constants/Colors';

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
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
  }
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  DogProfile: DogProfileScreen,
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
          ? `ios-contact`
          : 'md-contact'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
  }
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
          ? `ios-mail`
          : 'md-mail'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
  }
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
  OtherProfile: OtherProfileScreen,
  OtherDogProfile: OtherDogProfileScreen,
  GroupScreen: GroupScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-search`
          : 'md-search'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
  }
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
          ? `ios-contacts`
          : 'md-contacts'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
  }
};

export default createAppContainer(createBottomTabNavigator({
  HomeStack, SocialStack, SearchStack, InboxStack, ProfileStack
}));


// export default createAppContainer(createDrawerNavigator({
//   HomeStack,SocialStack,SearchStack,InboxStack,ProfileStack,
// }));