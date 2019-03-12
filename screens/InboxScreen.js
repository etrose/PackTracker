import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

class InboxScreen extends React.Component {
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
            <Text style={{fontSize: 25}}>Inbox</Text>
            <Text>Friend Requests</Text>
            
        </View>
        )
    }
}
export default InboxScreen;

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        marginTop: 23,
        padding: 10,
    },
});
