import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    TouchableOpacity,
    FlatList,
    ScrollView,
    RefreshControl,
    Platform
} from 'react-native';
import firebase from "firebase";
import Friends from '../FirebaseCalls/Friends';
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
        //Get credentials from Local storage which will be used later in this class
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        this.setState({ curr_id, curr_username });
        this.getMessages();
    }

    getMessages() {

        const that = this;

        //Get list of message for this user from firestore db and push each message to the message flatlist
        //Orders by newest
        const ref = firebase.firestore().collection("users/" + this.state.curr_id + "/messages").orderBy('timestamp', 'desc');
        ref.get().then((messages) => {
            var messageList = [];
            messages.forEach((message) => {
                var data = message.data();
                var timestamp = new Date(JSON.parse(data.timestamp));
                var time = Math.floor(Math.abs((new Date()) - timestamp) / 1000);
                var ext = "second";

                //Use timestamp to calculate time since message into plain english
                if (time > 60) {
                    time = Math.floor(time / 60);
                    ext = "minute";
                }
                if (ext === "minute" && time > 60) {
                    time = Math.floor(time / 60);
                    ext = "hour";
                }
                if (ext === "hour" && time > 24) {
                    time = Math.floor(time / 24);
                    ext = "days";
                }

                messageList.push({
                    id: message.id,
                    message: data.message,
                    from: data.username,
                    fromId: data.id,
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

    async deleteMessage(id, index) {
        //use firebase call class to delete message (See FirebaseCalls/Friends.js)
        new Friends(this.state.curr_id, this.state.curr_username).deleteMessage(id);

        //This nifty line will remove the object with the given index in the messageList state
        //in turn updating the Flatlist that you see
        this.setState({
            messageList: this.state.messageList.filter((_, i) => i !== index)
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>

                    <Text style={styles.topText}>Inbox</Text>

                    <Icon.Ionicons onPress={() => this.props.navigation.navigate('Search')} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25} />
                </View>
                <ScrollView
                    style={styles.body}
                    refreshControl={
                        <RefreshControl colors={[Colors.tintColor]}
                            tintColor={Colors.tintColor}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh} />
                    }
                ><View style={{ padding: 10, }}>

                        {this.state.messageList.length == 0 ? null :
                        <View style={styles.sectionHolder}>
                            <View style={styles.separatedRow}>
                                <Text style={styles.text}>Messages</Text>
                                <View style={{ alignItems: 'center', padding: 10 }}>
                                </View>
                            </View>
                            <View style={styles.line} />

                            <FlatList
                                style={styles.flatList}
                                data={this.state.messageList}
                                renderItem={({ item, index }) => (
                                    <View style={styles.listItem}>

                                        <View style={styles.separatedRow}>
                                            <Text style={styles.listTextSmall}>{item.timestamp}</Text>
                                            <Icon.Ionicons onPress={() => this.deleteMessage(item.id, index)} name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} color={Colors.text} size={20} />
                                        </View>

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', { username: item.from, uid: item.fromId })}>
                                            <Text style={styles.listText}>{item.from}:</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.listTextSmall}>{item.message}</Text>

                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            /></View>}


                    </View></ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        backgroundColor: '#fff',
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
        paddingHorizontal: 10,
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
    separatedRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});
