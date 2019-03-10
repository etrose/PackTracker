import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const {navigation} = this.props;
        return (
        <View style={styles.container}>
            <Text>{"Welcome " + AsyncStorage.getItem("user:id")}</Text>
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
