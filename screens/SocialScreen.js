import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Buttons } from '../constants/Layout';
import Logo from '../components/AppComponents/Logo';

export default class SocialScreen extends React.Component {
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
            <TouchableOpacity style={Buttons.button} onPress={() => this.props.navigation.navigate('Friends')}>
                <Text style={Buttons.buttonText}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Buttons.button} onPress={(() => this.props.navigation.navigate('Register'))}>
                <Text style={Buttons.buttonText}>Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Buttons.button} onPress={(() => this.props.navigation.navigate('Search'))}>
                <Text style={Buttons.buttonText}>Search for Users</Text>
            </TouchableOpacity>
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