import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppLoading } from 'expo';
import Workaround from './Workaround';

import { Constants } from 'expo';

import ApiKeys from './constants/ApiKeys';

import Logo from './components/AppComponents/Logo';
import Colors from './constants/Colors';

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
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
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
          <View style={{ alignSelf: 'center' }}>
            <Logo header="Checking Authentication.." />
            <ActivityIndicator color={Colors.tintColor} size='large' />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {this.state.isAuthenticated ? <MainTabNavigator /> : <AppNavigator />}
        </View>
      );
    }
  }

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
