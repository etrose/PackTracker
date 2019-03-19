import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class GroupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            groupName: this.props.name,
            groupPosition: this.props.position,
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const {navigation} = this.props;
        this.setState({
            groupName: navigation.getParam('name', 'Group'),
            groupPosition: navigation.getParam('position', 'member'),
            });
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>{this.state.groupName}</Text>
            <Text>{this.state.groupPosition}</Text>
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
