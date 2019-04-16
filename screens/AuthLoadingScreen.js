import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Logo from '../components/AppComponents/Logo';
import Colors from '../constants/Colors';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to the appropriate screen
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Main' : 'Auth');
  };

  render() {
    return (
      <View style={{alignSelf: 'center'}}>
      <StatusBar
            hidden={false}
            translucent
            backgroundColor='rgb(255,153,0)'
            barStyle="light-content"
          />
        <Logo header="Checking Authentication.."/>
        <ActivityIndicator color={Colors.tintColor} size='large'/>
      </View>
    );
  }
}