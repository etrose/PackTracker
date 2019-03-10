import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';

import Logo from '../components/AppComponents/Logo';
import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';

import * as firebase from "firebase";
import 'firebase/firestore';

export default class AddDogScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            breed: "",
            birth: "",
        };
    }

    registerDog = async () => {
        const { name, breed, birth } = this.state;
        const user_id = await AsyncStorage.getItem("user:id");

        alert(user_id);
    }

    registerUser = () => {

        const { username, email, password, confirm_password } = this.state;

        if (name.length <= 0 || breed.length <= 0 || birth.length <= 0) {
            alert("Please fill out all fields.");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    //Enable network once logged in successfully
                    firebase.firestore().enableNetwork();
                    const fbRootRefFS = firebase.firestore();
                    const userID = user.user.uid;
                    const userRef = fbRootRefFS.collection('users').doc(userID);
                    userRef.set({
                        username,
                        email,
                    });
                    AsyncStorage.setItem("user:id", userID);
                    AsyncStorage.setItem("user:email", email);
                    AsyncStorage.setItem("user:username", username);
                }).catch((error) => {
                    const { code, message } = error;
                    alert(message);
                });
    }

    render() {
        return (
            <View style={AuthPages.container}>
                <Logo header="Add Dog" simple={true} />
                <View style={AuthPages.container}>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Dog's Name"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ username: text })}
                            onSubmitEditing={() => this.email.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Dog's Breed"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ email: text })}
                            ref={(input) => this.email = input}
                            onSubmitEditing={() => this.password.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={Colors.text}
                            placeholder="Dog's Birthdate"
                            onChangeText={text => this.setState({ password: text })}
                            ref={(input) => this.password = input}
                            onSubmitEditing={() => this.confirm_password.focus()}
                        /></View>

                    <TouchableOpacity style={AuthPages.button} onPress={this.registerDog}>
                        <Text style={AuthPages.buttonText}>Add Dog</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
