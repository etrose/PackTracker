import React from 'react';
import { TextInput, View, Text, TouchableOpacity, AsyncStorage, StyleSheet, Image, Platform, KeyboardAvoidingView } from 'react-native';

import Colors from '../constants/Colors';
import { AuthPages } from '../constants/Layout';
import { Permissions, ImagePicker, Icon } from 'expo';

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
    static navigationOptions = {
        header: null,
      };

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
            console.log(result);
            if(!result.cancelled) {
                this.setState({pic: result.uri});
            }
        }else {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [3,3],
            });
            console.log(result);
            if(!result.cancelled) {
                this.setState({pic: result.uri});
            }
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
            <KeyboardAvoidingView style={styles.container} enabled>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10}}>
                <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
                <View></View>
                </View>
                <TouchableOpacity>
                <Image style={styles.avatar} source={this.state.pic == '' ? require('../assets/images/smiling-dog.jpg') : {uri: this.state.pic}}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={()=>this.pickImage(false)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-images' : 'md-images'} color={Colors.tintColor} size={30}/>
                        <Text>From Gallery..</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pickImage(true)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-camera' : 'md-camera'} color={Colors.tintColor} size={30}/>
                        <Text>Take Photo..</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.authContainer}>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            maxLength={24}
                            placeholder="Dog's Name"
                            placeholderTextColor={Colors.text}
                            onChangeText={text => this.setState({ name: text })}
                            onSubmitEditing={() => this.breed.focus()}
                        /></View>

                    <View style={AuthPages.inputContainer}>
                        <TextInput style={AuthPages.inputBox}
                            underlineColorAndroid="transparent"
                            maxLength={44}
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
                            placeholder="BirthDate (MM/DD/YYYY)"
                            onChangeText={text => this.setState({ birth: text })}
                            ref={(input) => this.birth = input}
                        /></View>
                    <TouchableOpacity style={AuthPages.button} onPress={this.registerDog}>
                        <Text style={AuthPages.buttonText}>Add Dog</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
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
