import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthPages } from '../constants/Layout';
import * as firebase from "firebase";

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: "testuser@test.com",
            password: "testuser",
        };
    }

    attemptLogin = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((user) => {
            this.props.navigation.navigate('Home', {
                user_id: user.user.uid,
            });
          })
          .catch((error) => {
            const { code, message } = error;
              Alert.alert(message);
          });
    };

    render() {
        return (
        // <View style={styles.container}>
        //     <Text>Login</Text>
        //     <Button title="Login" onPress={()=> this.attemptLogin()}/>
        // </View>
        <View style={AuthPages.container}>

        <View style={AuthPages.container}>
        <View style={AuthPages.inputContainer}>
        <TextInput style={AuthPages.inputBox} 
          //underlineColorAndroid={colors.UNDERLINE}
          placeholder="Email"
          keyboardType="email-address"
          //placeholderTextColor={colors.TEXT}
          //onChangeText={text => this.setState({ email: text })}
          onSubmitEditing={()=> this.password.focus()}
          /></View>
  
          <View style={AuthPages.inputContainer}>
          <TextInput style={AuthPages.inputBox} 
          //underlineColorAndroid={colors.UNDERLINE}
          //placeholderTextColor={colors.TEXT}
          placeholder="Password"
          //onChangeText={text => this.setState({ password: text })}
          secureTextEntry={true}
          //ref={(input) => this.password = input}
          /></View>
  
          <TouchableOpacity style={AuthPages.button} onPress={this.attemptLogin}>
            <Text style={AuthPages.buttonText}>Login</Text>
          </TouchableOpacity>
          </View>
  
        <View style={AuthPages.signUpCont}>
          <Text style={AuthPages.signUpText}>Don't have an account yet? </Text>
          <TouchableOpacity ><Text style={AuthPages.signUpButton}>Sign Up</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={AuthPages.button} onPress={this.attemptLogin}>
            <Text style={AuthPages.buttonText}>Dev Login</Text>
        </TouchableOpacity>
        </View>
        )
    }
}
