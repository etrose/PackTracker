import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';

export default class GroupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            groupName: this.props.name,
            groupPosition: this.props.position,
            memberCount: 1,
            isMember: false,
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

        //this.getGroupInfo();
    }

    render() {
        return (
        <View style={styles.container}>
        <View>
            <View style={styles.topBar}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor, paddingLeft: 5}}>{this.state.groupName}</Text>
                </View>
                <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-create' : 'md-create'} color={Colors.tintColor} size={25}/>
            </View>
            <View style={styles.topBar}>
                <Text style={{fontSize: 15, color: Colors.text, paddingLeft: 30}}>{this.state.memberCount} members</Text>
                <MyButton backgroundColor={Colors.tintColor} text={this.state.isMember ? "Leave Group" : "Join Group"}/>
            </View>
        </View><View style={styles.line}/>
        <Text>{this.state.groupName}</Text>
        <Text>{this.state.groupPosition}</Text>
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#000',
        width: '100%',
    },
    topBar: {
        elevation: 4,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor:'#fff',
        padding: 10,
        marginTop: 5,
    },
});
