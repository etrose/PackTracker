import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, FlatList, Platform } from 'react-native';

import firebase from "firebase";

import { Icon } from 'expo';
import Colors from '../constants/Colors';

class InboxScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_id: '',
            curr_username: '',
            incomingRequests: [],
            sentRequests: [],
            //conversations: [],
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        const ref = firebase.database().ref('users/'+curr_id+'/requests');
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
        this.setState({curr_id, curr_username});
    }

    getFriendRequests(requests){
        var tempIncoming = [];
        var tempSent = [];
        requests.forEach(function(child) {
            var id = child.key;
            var username = child.val().username;

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
        });
        this.setState({incomingRequests: tempIncoming, sentRequests: tempSent});
    }
    addRequest(request){
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
    removeRequest(request){
        //id of requesting user
        var id = request.key;
        var username = request.val().username;
        var temp = [];

        //first check if the request is sent or received
        if(!request.val().sent) {
            this.state.incomingRequests.forEach((i)=> {
                if(i.id != id){
                    temp.push(i);
                }
            });
            this.setState({incomingRequests:temp});
        }else {
            this.state.sentRequests.forEach((i)=> {
                if(i.username != username) {temp.push(i);}
            });
            this.setState({sentRequests: temp});
        }
    }

    async acceptRequest(otherUsername, otherUserId){
        currUserId = this.state.curr_id;
        currUserName = this.state.curr_username;
        firebase.database().ref('users/'+otherUserId+'/friends/'+currUserId).set({
            username: currUserName
        }).then(()=> {
            firebase.database().ref('users/'+currUserId+'/friends/'+otherUserId).set({
                username: otherUsername
            }).then(()=> {
                this.cancelRequest(currUserId, otherUserId);
            });
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async cancelRequest(currUserId, otherUserId) {
        firebase.database().ref('users/'+otherUserId+'/requests/'+currUserId).remove().then(()=> {
            firebase.database().ref('users/'+currUserId+'/requests/'+otherUserId).remove();
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={[{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor}, styles.text]}>inbox</Text>
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
                <TouchableOpacity onPress={()=>this.acceptRequest(item.username, item.id)}>
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-checkmark' : 'md-checkmark'} color="green" size={30}/>
                </TouchableOpacity>
                <View style={{width: 30,}}></View>
                <TouchableOpacity onPress={()=>this.cancelRequest(this.state.curr_id, item.id)}>
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
                <TouchableOpacity onPress={()=>this.cancelRequest(this.state.curr_id, item.id)}>
                    <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
        )
    }
}
export default InboxScreen;

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
        justifyContent: 'space-between',
        borderBottomColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    requestText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
