import React from 'react';
import { StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    AsyncStorage, 
    FlatList, 
    ScrollView, 
    RefreshControl,
    Platform } from 'react-native';

import Friends from '../FirebaseCalls/Friends';
import firebase from "firebase";

import { Icon } from 'expo';
import Colors from '../constants/Colors';

export default class FriendList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            curr_id: '',
            curr_username: '',
            incomingRequests: [],
            sentRequests: [],
            friendsList: [],
            refreshing: true,
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        this.setState({curr_id, curr_username});
        this.getFriendRequests();
    }

    getFriendRequests(){
        const ref = firebase.database().ref('users/'+this.state.curr_id+'/friends');
        const that = this;
        ref.once('value')
            .then(function(requests){
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
                that.setState({
                    incomingRequests: tempIncoming, 
                    sentRequests: tempSent,
                    friendsList: tempFriends,
                    refreshing: false
                });
            });
    }

    onRefresh = () => {
        this.getFriendRequests();
    }

    async onAccept (username, id, index) {
        this.setState({refreshing: true});

        new Friends(this.state.curr_id,this.state.curr_username).acceptRequest(username, id);
        
        this.setState({
            refreshing: false,
            friendsList: this.state.friendsList.concat({username, id}),
            incomingRequests: this.state.incomingRequests.filter((_, i) => i !== index)
        });
    }

    async onRemove(sent, id, index) {

        new Friends(this.state.curr_id,this.state.curr_username).deleteFriend(id);

        if(sent) {
            this.setState(function(prevState){
                return { 
                    sentRequests : prevState.sentRequests.filter(function(val, i) {
                return i !== index;
                })};
              });
        }else {
            this.setState({
                incomingRequests: this.state.incomingRequests.filter((_, i) => i !== index)
            });
        }
        this.setState({refreshing: false});
    }

    async onRemoveFromFriends(id, index) {
        new Friends(this.state.curr_id,this.state.curr_username).deleteFriend(id);
        
        this.setState(function(prevState){
            return { 
                friendsList : prevState.friendsList.filter(function(val, i) {
            return i !== index;
            })};
            });
        
        this.setState({refreshing: false});
    }

    async handleUserPress (username, id) {
        this.props.navigation.navigate('OtherProfile', 
                    {
                        username,
                        //email: item.email,
                        uid: id,
                    });
    }

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.topBar}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
            <Text style={[{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor}, styles.topText]}>Friends</Text>
            </View>
            <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25}/>
            </View>
            <ScrollView 
                style={styles.body}
                refreshControl={
                    <RefreshControl
                    colors={[Colors.tintColor]}
                    tintColor={Colors.tintColor}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}/>
                }
            ><View style={{padding: 10,}}>
                <View style={styles.sectionHolder}>
                <Text style={styles.text}>Friend Requests</Text>
                <View style={styles.line}/>
                <FlatList 
                style={styles.flatList}
                data={this.state.incomingRequests}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.requestItem} onPress={() => this.handleUserPress(item.username, item.id)}>
                    <Text style={styles.requestText}>{item.username}</Text>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.onAccept(item.username, item.id, index)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-checkmark' : 'md-checkmark'} color="green" size={30}/>
                    </TouchableOpacity>
                    <View style={{width: 30,}}></View>
                    <TouchableOpacity onPress={()=>this.onRemove(false, item.id, index)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                    </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                /></View>

                <View style={styles.sectionHolder}>
                <Text style={styles.text}>Friends</Text>
                <View style={styles.line}/>
                <FlatList 
                style={styles.flatList}
                data={this.state.friendsList}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => this.handleUserPress(item.username, item.id)}>
                    <View style={styles.requestItem}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <View style={{flexDirection: 'row'}}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-contact' : 'md-contact'} color={Colors.colorSecondary} size={30}/>
                        <Text style={[styles.requestText, {paddingLeft: 10,}]}>{item.username}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>this.onRemoveFromFriends(item.id, index)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                /></View>

                <View style={styles.sectionHolder}>
                <Text style={styles.text}>Sent Requests</Text>
                <View style={styles.line}/>
                <FlatList 
                style={styles.flatList}
                data={this.state.sentRequests}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.requestItem} onPress={() => this.handleUserPress(item.username, item.id)}>
                    <Text style={styles.requestText}>{item.username}</Text>  
                    <TouchableOpacity onPress={()=>this.onRemove(true, item.id, index)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                    </TouchableOpacity>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                /></View>
        </View></ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        //marginTop: 23,
    },
    topBar: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
    },
    sectionHolder: {
        marginVertical: 10,
        elevation: 8,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor:'#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    flatList: {
        flexGrow: 0, 
    },
    body: {
        backgroundColor: '#dddddd',
        height: '100%',
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
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#000',
        width: '100%',
    },
    requestItem: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#fff',
        borderBottomColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    requestText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
