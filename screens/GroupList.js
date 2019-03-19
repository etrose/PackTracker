import React from 'react';
import { StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    AsyncStorage, 
    ActivityIndicator,
    FlatList, 
    ScrollView, 
    RefreshControl,
    Platform } from 'react-native';

import Friends from '../FirebaseCalls/Friends';
import firebase from "firebase";

import { Icon } from 'expo';
import Colors from '../constants/Colors';
import NewGroupModal from '../components/AppComponents/NewGroupModal';

export default class GroupList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            curr_id: '',
            curr_username: '',
            // incomingRequests: [],
            // sentRequests: [],
            // friendsList: [],
            groupsList: [],
            refreshing: false,
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        this.setState({curr_id, curr_username});
        //this.getFriendRequests();
    }

    // getFriendRequests(){
    //     const ref = firebase.database().ref('users/'+this.state.curr_id+'/friends');
    //     const that = this;
    //     ref.once('value')
    //         .then(function(requests){
    //             var tempIncoming = [];
    //             var tempSent = [];
    //             var tempFriends = [];
    //             requests.forEach(function(child) {
    //                 var id = child.key;
    //                 var username = child.val().username;
                    
    //                 //if sent is null, user is already friend
    //                 if(child.val().sent != null) {

    //                 //Check if request was sent or received then add to correct list
    //                 if(!child.val().sent) {
    //                     tempIncoming.push({
    //                         username,
    //                         id
    //                     });
    //                 }else {
    //                     tempSent.push({
    //                         username,
    //                         id
    //                     });
    //                 }
    //             }else {
    //                 tempFriends.push({
    //                     username,
    //                     id
    //                 });
    //             }
    //             });
    //             that.setState({
    //                 incomingRequests: tempIncoming, 
    //                 sentRequests: tempSent,
    //                 friendsList: tempFriends,
    //                 refreshing: false
    //             });
    //         });
    // }

    onRefresh = () => {
        //this.getFriendRequests();
    }

    // async onAccept (username, id, index) {
    //     this.setState({refreshing: true});

    //     new Friends(this.state.curr_id,this.state.curr_username).acceptRequest(username, id);
        
    //     this.setState({
    //         refreshing: false,
    //         friendsList: this.state.friendsList.concat({username, id}),
    //         incomingRequests: this.state.incomingRequests.filter((_, i) => i !== index)
    //     });
    // }

    // async onRemove(sent, id, index) {

    //     new Friends(this.state.curr_id,this.state.curr_username).deleteFriend(id);

    //     if(sent) {
    //         this.setState(function(prevState){
    //             return { 
    //                 sentRequests : prevState.sentRequests.filter(function(val, i) {
    //             return i !== index;
    //             })};
    //           });
    //     }else {
    //         this.setState({
    //             incomingRequests: this.state.incomingRequests.filter((_, i) => i !== index)
    //         });
    //     }
    //     this.setState({refreshing: false});
    // }


    onNewGroup = (groupId) => {
        //get group info from firebase and add it to groupList
    }


    render() {
        return (
        <View style={styles.container}>
            <View style={styles.topBar}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
            <Text style={[{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor}, styles.text]}>Groups</Text>
            </View>
            <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25}/>
            </View>
            <View style={styles.line}/>
            <ScrollView 
                style={styles.body}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}/>
                }
            ><View style={{padding: 10,}}>
                <NewGroupModal label="New Group" id={this.state.curr_id} username={this.state.curr_username} onCreated={this.onNewGroup}/>
                <Text style={styles.text}>My Groups</Text>
                <View style={styles.line}/>
                <FlatList 
                style={styles.flatList}
                data={this.state.incomingRequests}
                renderItem={({ item, index }) => (
                    <View style={styles.requestItem}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', 
                    {
                        username: item.username,
                        //email: item.email,
                        uid: item.id,
                    })}>
                    <Text style={styles.requestText}>{item.username}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.onAccept(item.username, item.id, index)}
                    >
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-checkmark' : 'md-checkmark'} color="green" size={30}/>
                    </TouchableOpacity>
                    <View style={{width: 30,}}></View>
                    <TouchableOpacity onPress={()=>this.onRemove(false, item.id, index)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="red" size={30}/>
                    </TouchableOpacity>
                    </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
                {/* <Text style={styles.text}>Nearby Groups</Text>
                <View style={styles.line}/>
                <FlatList 
                style={styles.flatList}
                data={this.state.friendsList}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', 
                    {
                        username: item.username,
                        //email: item.email,
                        uid: item.id,
                    })}>
                    <View style={styles.requestItem}>
                        
                        <View style={{flexDirection: 'row'}}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-contact' : 'md-contact'} color="blue" size={30}/>
                        <Text style={[styles.requestText, {paddingLeft: 10,}]}>{item.username}</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                /> */}

        </View></ScrollView>
        <View style={{backgroundColor:'#dddddd', alignItems: 'center', padding: 10}}>
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flatList: {
        flexGrow: 0, 
        marginBottom: 10,
    },
    body: {
        backgroundColor: '#dddddd',
        height: '100%',
    },
    text: {
        backgroundColor:'#fff',
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
