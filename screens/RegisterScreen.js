import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';

import Logo from '../components/AppComponents/Logo';
import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';

import * as firebase from "firebase";
import 'firebase/firestore';

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirm_password: "",
        };
    }

    registerUser = () => {

        const { username, email, password, confirm_password } = this.state;

        if (username.length <= 0 || email.length <= 0 || password.length <= 0 || confirm_password.length <= 0) {
            alert("Please fill out the required fields.");
            return;
        }

        if (password == confirm_password) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    //Enable network once logged in successfully
                    firebase.firestore().enableNetwork();
                    const fbRootRefFS = firebase.firestore();
                    const id = user.user.uid;
                    const userRef = fbRootRefFS.collection('users').doc(id);
                    userRef.set({
                        username,
                        email,
                        id,
                    });
                    AsyncStorage.setItem("user:id", id);
                    AsyncStorage.setItem("user:email", email);
                    AsyncStorage.setItem("user:username", username);
                }).catch((error) => {
                    const { code, message } = error;
                    alert(message);
                });
        } else {
            alert("Passwords Don't match");
        }
    }

    render() {
        return (
            <View style={AuthPages.container}>
                <Logo header="Sign up" simple={true} />
                <View style={AuthPages.container}>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Username"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ username: text })}
                            onSubmitEditing={() => this.email.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ email: text })}
                            ref={(input) => this.email = input}
                            onSubmitEditing={() => this.password.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={Colors.text}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                            ref={(input) => this.password = input}
                            onSubmitEditing={() => this.confirm_password.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={Colors.text}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ confirm_password: text })}
                            ref={(input) => this.confirm_password = input}
                        /></View>

                    <TouchableOpacity style={AuthPages.button} onPress={this.registerUser}>
                        <Text style={AuthPages.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={AuthPages.signUpCont}>
                    <Text style={AuthPages.signUpText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={AuthPages.signUpButton}>Sign In</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}