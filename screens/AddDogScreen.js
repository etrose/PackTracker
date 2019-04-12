import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage, StyleSheet, Image } from 'react-native';

import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';
import { Permissions, ImagePicker } from 'expo';

import firebase from "firebase";
import 'firebase/firestore';

export default class AddDogScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            breed: "",
            birth: "",
            pic: '',
        };
    }

    async askPermissions() {
        const { Permissions } = Expo;
        const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        }
    }

    async pickImage(isCamera) {
        if(isCamera) {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [3,3],
            });
        }else {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [3,3],
            });
        }

        console.log(result);
        if(!result.cancelled) {
            this.setState({pic: result.uri});
        }
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
            <View style={styles.container}>
                <TouchableOpacity onPress={()=>this.pickImage(true)}>
                <Image style={styles.avatar} source={this.state.pic == '' ? require('../assets/images/smiling-dog.jpg') : {uri: this.state.pic}}/>
                </TouchableOpacity>
                <View style={styles.authContainer}>

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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
      }, 
      authContainer: {
        alignItems: 'center',
      }, 
    avatar: {
        width: 150,
        height: 150,
        borderColor: "transparent",
        borderRadius: 75,
        marginBottom: 15,
        marginTop: 30
      },
});
