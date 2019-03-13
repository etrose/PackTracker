import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';

import Logo from '../components/AppComponents/Logo';
import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';

import firebase from "firebase";
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
        if (name.length <= 0 || breed.length <= 0 || birth.length <= 0) {
            alert("Please fill out all fields.");
            return;
        }
        const user_id = await AsyncStorage.getItem("user:id");
        const fbRootRefFS = firebase.firestore();
        fbRootRefFS.collection('dogs').add({
            name,
            breed,
            birth,
        }).then((dogRef) => {
            fbRootRefFS.doc("users/" + user_id + "/dogs/" + name).set({
                dog: dogRef,
            });
            this.props.navigation.navigate('Profile', {needToRefreshDogs: true});
        }).catch(error => {
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
                            onChangeText={text => this.setState({ name: text })}
                            onSubmitEditing={() => this.breed.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholder="Dog's Breed"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ breed: text })}
                            ref={(input) => this.breed = input}
                            onSubmitEditing={() => this.birth.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={Colors.text}
                            placeholder="Dog's Birthdate"
                            onChangeText={text => this.setState({ birth: text })}
                            ref={(input) => this.birth = input}
                        /></View>

                    <TouchableOpacity style={AuthPages.button} onPress={this.registerDog}>
                        <Text style={AuthPages.buttonText}>Add Dog</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
