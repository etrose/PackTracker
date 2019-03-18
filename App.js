import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Workaround from './Workaround';

import { Constants } from 'expo';

import ApiKeys from './constants/ApiKeys';

import * as firebase from 'firebase';
import 'firebase/firestore';

import MainTabNavigator from './navigation/MainTabNavigator';
import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
    };
    //initialize Firebase, if not already initialized
    if (!firebase.apps.length) {firebase.initializeApp(ApiKeys.FirebaseConfig); }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({
      isAuthenticationReady: true,
      isAuthenticated: !!user,
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen && !this.state.isAuthenticationReady) {
      return (
        <View style={styles.container}>
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
        <ActivityIndicator size='large'/>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* <View style={styles.statusBar}/> */}
          {/* {Platform.OS === 'ios' && <StatusBar barStyle="default" />} */}
          {this.state.isAuthenticated ? <MainTabNavigator/> : <AppNavigator/>}
        </View>
      );
    }
  }

  // _loadResourcesAsync = async () => {
  //   return Promise.all([
  //     Asset.loadAsync([
  //       require('./assets/images/robot-dev.png'),
  //       require('./assets/images/robot-prod.png'),
  //     ]),
  //   ]);
  // };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: "#ffae00",
    height: Constants.statusBarHeight,
  }
});
