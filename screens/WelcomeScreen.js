import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Welcome</Text>
            <Button title="Login" onPress={() => this.props.navigation.navigate('Login')}/>
            <Button title="Sign Up" onPress={() => this.props.navigation.navigate('Register')}/>
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
