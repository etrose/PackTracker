import React from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
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
        <View style={styles.container}>
            <Text>Login</Text>
            <Button title="Login" onPress={()=> this.attemptLogin()}/>
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
