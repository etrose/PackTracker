import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class ForgotPasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Forgot Password</Text>
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
