import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_username: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_username = await AsyncStorage.getItem("user:username");
        const curr_id = await AsyncStorage.getItem("user:id");
        this.setState({
            curr_username,
            curr_id,
        });
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Welcome {this.state.curr_username}!</Text>
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
