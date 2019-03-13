import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        const {navigation} = this.props;
        return (
        <View style={styles.container}>
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
