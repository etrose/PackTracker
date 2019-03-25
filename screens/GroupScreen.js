import React from 'react';
import { StyleSheet, View, Text, Platform, ScrollView, AsyncStorage } from 'react-native';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';
import Groups from '../FirebaseCalls/Groups';
import firebase from "firebase";

export default class GroupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_id: '',
            curr_username: '',
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
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        const groupName = await navigation.getParam('name', 'Group');
        const groupPosition = await navigation.getParam('position', '');
        if(groupPosition == null) {
            //check firebase if there is /users/groups/groupName/position != null
            this.setState({isMember: false});
        }else {
            this.setState({isMember: false});
        }
        // this.ref.once('value')
        //     .then((snapshot)=> {
        //         console.log(snapshot.key);
        //         console.log(snapshot.val().memberCount);
        //         console.log(snapshot.val().city);
        //     });

        this.setState({
            groupName: navigation.getParam('name', 'Group'),
            groupPosition: navigation.getParam('position', 'member'),
            curr_id,
            curr_username,
            });

        this.getInfo();
    }

    getInfo() {
        const ref = firebase.database().ref('groups/'+this.state.groupName+'/memberCount');
        const that = this;
        ref.once('value')
            .then((result) => {
                that.setState({
                    memberCount: result.val(),
                });
                console.log(result);
                console.log(result.key);
            }).catch(error => {
            const { code, message } = error;
            alert(message);
            });
            //CHECK IF USER IS A MEMBER
    }

    async joinOrLeave() {
        var g = new Groups(this.state.curr_id, this.state.curr_username);
        const groupName = this.state.groupName;
        if(this.state.isMember) {
          var b = await g.removeMember(groupName);
          this.setState({isMember: false, memberCount: this.state.memberCount--});
        }else {
            var b = await g.addMember(groupName, "member");
            this.setState({isMember: true, memberCount: this.state.memberCount++});
        }
    }

    render() {
        return (
        <View style={styles.container}>
        <View>
            <View style={styles.topBar}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
                <Text style={styles.topText}>{this.state.groupName}</Text>
                </View>
                <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-create' : 'md-create'} color={Colors.tintColor} size={25}/>
            </View>
            <View style={styles.topBar}>
                <Text style={{fontSize: 15, color: Colors.text, paddingLeft: 30}}>{this.state.memberCount} members</Text>
                <MyButton onPress={()=> this.joinOrLeave()} backgroundColor={Colors.tintColor} text={this.state.isMember ? "Leave Group" : "Join Group"}/>
            </View>
        </View><View style={styles.line}/>
        <ScrollView style={styles.contentHolder}>

        </ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    contentHolder: {
        flex: 1,
        backgroundColor: '#ddd',
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
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 10,
    },
    text: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 10,
    },
    topText: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 24,
        paddingHorizontal: 15,
    },
});
