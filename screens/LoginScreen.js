import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { AuthPages } from '../constants/Layout';
import Colors from '../constants/Colors';
import Logo from '../components/AppComponents/Logo';
import firebase from "firebase";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  attemptLogin = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        //Save userid and email locally
        AsyncStorage.setItem("user:id", user.user.uid);
        AsyncStorage.setItem("user:email", this.state.email);
        //Enable network once logged in successfully
        firebase.firestore().enableNetwork();
        firebase.firestore().collection("users").doc(user.user.uid).get()
          .then(function (doc) {
            if (doc.exists) {
              AsyncStorage.setItem("user:username", doc.data().username);
            }
          }).catch(error => {
            const { code, message } = error;
            alert(message);
          });

      })
      .catch((error) => {
        const { code, message } = error;
        Alert.alert(message);
      });
  };

  //For faster testing only
  devLogin = () => {
    firebase.auth().signInWithEmailAndPassword("testuser@test.com", "testuser")
      .then((user) => {
        //Save userid and email locally
        AsyncStorage.setItem("user:id", user.user.uid);
        AsyncStorage.setItem("user:email", "testuser@test.com");
        //Enable network once logged in successfully
        firebase.firestore().enableNetwork();
        firebase.firestore().collection("users").doc(user.user.uid).get()
          .then(function (doc) {
            if (doc.exists) {
              AsyncStorage.setItem("user:username", doc.data().username);
            }
          }).catch(error => {
            const { code, message } = error;
            alert(message);
          });
      })
      .catch((error) => {
        const { code, message } = error;
        Alert.alert(message);
      });
  };

  render() {
    return (
      <View style={AuthPages.container}>
        <Logo header="Login" simple={true} />
        <View style={AuthPages.container}>
          <View style={AuthPages.inputContainer}>
            <TextInput style={AuthPages.inputBox}
              underlineColorAndroid="transparent"
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor={Colors.text}
              onChangeText={text => this.setState({ email: text })}
              onSubmitEditing={() => this.password.focus()}
            /></View>

          <View style={AuthPages.inputContainer}>
            <TextInput style={AuthPages.inputBox}
              underlineColorAndroid="transparent"
              placeholderTextColor={Colors.text}
              placeholder="Password"
              onChangeText={text => this.setState({ password: text })}
              secureTextEntry={true}
              ref={(input) => this.password = input}
            /></View>

          <TouchableOpacity style={AuthPages.button} onPress={this.attemptLogin}>
            <Text style={AuthPages.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={AuthPages.signUpCont}>
          <Text style={AuthPages.signUpText}>Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}><Text style={AuthPages.signUpButton}>Sign Up</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={[AuthPages.button, { marginBottom: 50 }]} onPress={this.devLogin}>
          <Text style={AuthPages.buttonText}>Dev Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
