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
            cityState: '',
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

        this.setState({
            groupName: navigation.getParam('name', 'Group'),
            groupPosition: navigation.getParam('position', ''),
            curr_id,
            curr_username,
            });

        this.getInfo();
    }

    getInfo() {
        const ref = firebase.database().ref('groups/'+this.state.groupName);
        const that = this;
        ref.once('value')
            .then((group) => {
                var data = group.val();

                that.setState({
                    cityState: data.city + ", " + data.state,
                    memberCount: data.memberCount,
                });

            }).then(()=> {
                firebase.database().ref('groups/'+that.state.groupName+'/members')
                    .once('value')
                    .then((members)=> {
                        members.forEach((member)=> {
                            console.log(member.val().id + " " + that.state.curr_id);
                            if(member.val().id == that.state.curr_id) {
                                that.setState({isMember: true, position: member.val().position});
                            }
                        });
                    });
            }).catch(error => {
            const { code, message } = error;
            alert(message);
            });
    }

    async joinOrLeave() {
        var g = new Groups(this.state.curr_id, this.state.curr_username);
        const groupName = this.state.groupName;
        var c = this.state.memberCount;
        if(this.state.isMember) {
          var b = await g.removeMember(groupName);
        c--;
          this.setState({isMember: false, memberCount: c});
        }else {
            var b = await g.addMember(groupName, "member");
            c++;
            this.setState({isMember: true, memberCount: c});
        }
    }

    render() {
        return (
        <View style={styles.container}>
        <View>
            <View style={styles.topBar}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
                <View>
                <Text style={styles.topText}>{this.state.groupName}</Text>
                <Text style={styles.text}>{this.state.cityState}</Text>
                </View>
                </View>
                {this.state.isMember ? <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-create' : 'md-create'} color={Colors.tintColor} size={25}/> : null}
            </View>
            <View style={styles.topBar}>
                <Text style={styles.text}>{this.state.memberCount} members</Text>
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
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 10,
    },
    text: {
        color: Colors.text,
        fontSize: 15,
        paddingHorizontal: 20,
    },
    topText: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 24,
        paddingHorizontal: 20,
    },
});
