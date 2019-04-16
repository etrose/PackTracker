
import { createAppContainer, createSwitchNavigator, createStackNavigator, SwitchNavigator, createDrawerNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const AuthStack = createStackNavigator({ Welcome: WelcomeScreen, Register: RegisterScreen, Login: LoginScreen, ForgotPassword: ForgotPasswordScreen });

export default createAppContainer(createSwitchNavigator(
  {
    Auth: AuthStack,
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
));