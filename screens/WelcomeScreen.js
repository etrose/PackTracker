import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Buttons } from '../constants/Layout';
import Logo from '../components/AppComponents/Logo';

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        return (
        <View style={styles.container}>
            <Logo header="Welcome to Pack Tracker!"/>
            <TouchableOpacity style={Buttons.button} onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={Buttons.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Buttons.button} onPress={(() => this.props.navigation.navigate('Register'))}>
                <Text style={Buttons.buttonText}>Create an account</Text>
            </TouchableOpacity>
        </View>
        )
    }
}
export default WelcomeScreen;

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
