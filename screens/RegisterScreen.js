import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage, Alert, Platform } from 'react-native';
import {Icon} from 'expo';
import Logo from '../components/AppComponents/Logo';
import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';

import firebase from "firebase";
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
    static navigationOptions = {
        header: null,
      };

    registerUser = () => {

        const { username, email, password, confirm_password } = this.state;
        
        var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
        if (pattern.test(username)) {
            Alert.alert("Username invalid", "Username cannot contain symbols");
            return;
        }
    
        if (username.length > 15 || username.indexOf(' ') != -1) {
            Alert.alert("Username invalid", "Username must be less than 16 characters and contain no spaces.");
            return;
        }

        if (username.length <= 0 || email.length <= 0 || password.length <= 0 || confirm_password.length <= 0) {
            Alert.alert("Empty Field(s)", "Please fill out the required fields.");
            return;
        }

        if (password == confirm_password) {
            //Check database for username availability
            firebase.database().ref('usernames/'+username).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    Alert.alert("Username Taken", "Sorry, this username has already been taken");
                    return;
                }else {
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
                    firebase.database().ref('users/'+id).set({
                        username
                    });
                    firebase.database().ref('usernames/'+username.toLowerCase()).set({
                        id
                    });
                    
                    AsyncStorage.setItem("user:id", id);
                    AsyncStorage.setItem("user:email", email);
                    AsyncStorage.setItem("user:username", username);
                }).catch((error) => {
                    const { code, message } = error;
                    alert(message);
                });
                }
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10}}>
            <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
            <View></View>
            </View>
                <Logo header="Sign up" simple={true} />
                <View style={AuthPages.container}>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Username"
                            autoCapitalize = "none"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ username: text })}
                            onSubmitEditing={() => this.email.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Email"
                            autoCapitalize = "none"
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
                            autoCapitalize = "none"
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
                            autoCapitalize = "none"
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