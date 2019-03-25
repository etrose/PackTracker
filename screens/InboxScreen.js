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
import firebase from "firebase";

import { Icon } from 'expo';
import Colors from '../constants/Colors';

export default class InboxScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            curr_id: '',
            curr_username: '',
            messageList: [],
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
        this.getMessages();
    }

    getMessages() {
        // const ref = firebase.database().ref('users/'+this.state.curr_id+'/messages');
        const that = this;
        // ref.once('value')
        //     .then((messages) => {
        //         var messageList = [];
        //         messages.forEach((message)=> {
        //             const data = message.val();
        //             //const timestamp = message.key;
        //             //const date = new Date(JSON.parse(timestamp));
                    
        //             //const utc1 = Date.UTC
        //             // const currentTime = new Date();
        //             // var diff = Math.abs(currentTime.getTime() - timestamp.getTime());
        //             // var diffMinutes = Math.ceil(diff / (1000 * 60));
                    
        //             messageList.push({
        //                 from: data.username,
        //                 id: data.id,
        //                 message: data.message,
        //                 //timestamp: date
        //             });
        //         });
        //         that.setState({
        //             messageList,
        //             refreshing: false
        //         });
        //     }).catch(error => {
        //     const { code, emessage } = error;
        //     alert(emessage);
        //     });
        const ref = firebase.firestore().collection("users/" + this.state.curr_id + "/messages");
        ref.get().then((messages)=> {
            var messageList = [];
            messages.forEach((message)=> {
                var data = message.data();
                var timestamp = new Date(JSON.parse(data.timestamp));
                var time = Math.floor(Math.abs((new Date()) - timestamp) / 1000);
                var ext = "second";

                if(time > 60) {
                    time = Math.floor(time/60);
                    ext = "minute";
                }
                if(ext === "minute" && time > 60) {
                    time = Math.floor(time/60);
                    ext = "hour";
                }
                if(ext === "hour" && time > 24) {
                    time = Math.floor(time/24);
                    ext = "days";
                }

                console.log(timestamp.getTime());
                messageList.push({
                    message: data.message,
                    from: data.username,
                    timestamp: time + " " + ext + "(s) ago"
                });
            });
            that.setState({
                messageList,
                refreshing: false
            });
        }).catch(error => {
            const { code, emessage } = error;
            alert(emessage);
        });
    }
    
    onRefresh = () => {
        this.getMessages();
    }


    render() {
        return (
        <View style={styles.container}>
            <View style={styles.topBar}>
            
            <Text style={[{fontSize: 25, fontWeight: 'bold', color: Colors.tintColor}, styles.topText]}>Inbox</Text>
            
            <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25}/>
            </View>
            <ScrollView 
                style={styles.body}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}/>
                }
            ><View style={{padding: 10,}}>
                <View style={styles.sectionHolder}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={styles.text}>Messages</Text>
                <View style={{ alignItems: 'center', padding: 10}}>
                </View>
                </View>
                <View style={styles.line}/>

                <FlatList 
                style={styles.flatList}
                data={this.state.messageList}
                renderItem={({ item, index }) => (
                    <View style={styles.listItem}>
                    <View>
                    <Text style={styles.listTextSmall}>{item.timestamp}</Text>

                    <Text style={styles.listText}>{item.from}:</Text>
                    
                    <Text style={styles.listTextSmall}>{item.message}</Text>
                    </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                /></View>

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
        {/* <View style={{backgroundColor:'#dddddd', alignItems: 'center', padding: 10}}>
        </View> */}
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    topBar: {
        padding: 10,
        margin: 0,
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
    },
    
    sectionHolder: {
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
    listItem: {
        padding: 10,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#fff',
        borderBottomColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listTextSmall: {
        color: Colors.text,
        fontSize: 12,
    },
});
