import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const {navigation} = this.props;
        return (
        <View style={styles.container}>
            <Text>{"Welcome " + navigation.getParam('user_id', 'no-id')}</Text>
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
