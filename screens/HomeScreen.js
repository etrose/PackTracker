import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';

class HomeScreen extends React.Component {
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
            <StatusBar
                backgroundColor='rgb(255,153,0)'
                barStyle="light-content"
            />
            <Text>Home</Text>
        </View>
        )
    }
}
export default HomeScreen;

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
