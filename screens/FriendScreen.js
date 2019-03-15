import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, FlatList, Platform } from 'react-native';

import Friends from '../FirebaseCalls/Friends';
import firebase from "firebase";

import { Icon } from 'expo';
import Colors from '../constants/Colors';

export default class FriendScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_id: '',
            curr_username: '',
            incomingRequests: [],
            sentRequests: [],
            friendRequests: [],
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        const ref = firebase.database().ref('users/'+curr_id+'/friends');
        const that = this;
        ref.once('value')
            .then(function(snapshot){
                that.getFriendRequests(snapshot);
            });
        ref.on('child_added', function(snapshot) {
            that.addRequest(snapshot);
        });
        ref.on('child_removed', function(snapshot) {
            that.removeRequest(snapshot);
        });
        ref.on('child_changed', function(snapshot) {
            that.removeRequest(snapshot);
        });
        this.setState({curr_id, curr_username});
    }

    async componentWillUnmount(){
        const ref = firebase.database().ref('users/'+this.state.curr_id+'/friends');
        ref.off('child_added');
        ref.off('child_removed');
        ref.off('child_changed');
    }

    getFriendRequests(requests){
        var tempIncoming = [];
        var tempSent = [];
        var tempFriends = [];
        requests.forEach(function(child) {
            var id = child.key;
            var username = child.val().username;
            
            //if sent is null, user is already friend
            if(child.val().sent != null) {

            //Check if request was sent or received then add to correct list
            if(!child.val().sent) {
                tempIncoming.push({
                    username,
                    id
                });
            }else {
                tempSent.push({
                    username,
                    id
                });
            }
        }else {
            tempFriends.push({
                username,
                id
            });
        }
        });
        this.setState({
            incomingRequests: tempIncoming, 
            sentRequests: tempSent,
            friendsList: tempFriends
        });
    }
    addRequest(request){
        if(request.val().sent != null) {
        //id of requesting user
        var id = request.key;
        var username = request.val().username;
        this.state.incomingRequests.forEach((req) => {
            alert(req.username);
        });
        var temp = [];
        //first check if the request is sent or received
        if(!request.val().sent) {
            temp.push({username,id});
            this.setState({incomingRequests:temp});
        }else {
            this.state.sentRequests.forEach((i)=>temp.push(i));
            temp.push({username,id});
            this.setState({sentRequests: temp});
        }
    }
    }
    removeRequest(request){
        //id of requesting user
        var id = request.key;
        var username = request.val().username;

        // if(request.val().sent == null) {
        //     var temp = this.state.friendRequests;
        //     temp.push({
        //         username,
        //         id
        //     });
        //     this.setState({friendsList:temp});
        // }else {
            var temp = [];

            this.state.incomingRequests.forEach((i)=> {
                if(i.id != id){
                    temp.push(i);
                }
            });
            this.setState({incomingRequests:temp});
        
            temp = [];
            this.state.sentRequests.forEach((i)=> {
                if(i.username != username) {temp.push(i);}
            });
            this.setState({sentRequests: temp});
        //}
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={[{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor}, styles.text]}>Friends</Text>
            <Text style={styles.text}>Friend Requests</Text>
            <View style={styles.line}/>
            <FlatList 
            //style={styles.flatList}
            data={this.state.incomingRequests}
            renderItem={({ item }) => (
                <View style={styles.requestItem}>
                <TouchableOpacity>
                <Text style={styles.requestText}>{item.username}</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>new Friends(this.state.curr_id,this.state.curr_username).acceptRequest(item.username, item.id)}>
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-checkmark' : 'md-checkmark'} color="green" size={30}/>
                </TouchableOpacity>
                <View style={{width: 30,}}></View>
                <TouchableOpacity onPress={()=>new Friends(this.state.curr_id,this.state.curr_username).deleteFriend(item.id)}>
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                </TouchableOpacity>
                </View>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            <Text style={styles.text}>Sent Requests</Text>
            <View style={styles.line}/>
            <FlatList 
            //style={styles.flatList}
            data={this.state.sentRequests}
            renderItem={({ item }) => (
                <View style={styles.requestItem}>
                <TouchableOpacity>
                    <Text style={styles.requestText}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>new Friends(this.state.curr_id,this.state.curr_username).deleteFriend(item.id)}>
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            <Text style={styles.text}>Friends</Text>
            <View style={styles.line}/>
            <FlatList 
            //style={styles.flatList}
            data={this.state.friendsList}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', 
                {
                    username: item.username,
                    //email: item.email,
                    uid: item.id,
                })}>
                <View style={styles.requestItem}>
                    
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-contact' : 'md-contact'} color="blue" size={30}/>
                    <Text style={[styles.requestText, {paddingLeft: 10,}]}>{item.username}</Text>
                
                </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        marginTop: 23,
    },
    text: {
        paddingHorizontal: 10,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#000',
        width: '100%',
    },
    requestItem: {
        padding: 10,
        flexDirection: 'row',
        flex: 1,
        borderBottomColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    requestText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
