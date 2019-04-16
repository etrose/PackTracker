import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Buttons } from '../constants/Layout';
import Logo from '../components/AppComponents/Logo';
import { Icon } from 'expo';

//This page basically just has 3 buttons that navigate to other pages...
export default class SocialScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        return (
            <View style={styles.container}>
                <Logo simple header="Social Menu" />
                <TouchableOpacity style={Buttons.button} onPress={() => this.props.navigation.navigate('Friends')}>
                    <Text style={Buttons.buttonText}>My Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Buttons.button} onPress={(() => this.props.navigation.navigate('Groups'))}>
                    <Text style={Buttons.buttonText}>My Groups</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Buttons.button} onPress={(() => this.props.navigation.navigate('Search'))}>
                    <Text style={Buttons.buttonText}>Search for Users</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});