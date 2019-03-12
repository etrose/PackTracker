import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';

import * as firebase from "firebase";

class InboxScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
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
        const ref = firebase.database().ref('users/'+curr_id+'/requests');
        const that = this;
        ref.once('value')
            .then(function(snapshot) {
                var tempIncoming = [];
                var tempSent = [];
                snapshot.forEach(function(child) {
                    var id = child.key;
                    var username = child.val().username;

                    //Check if request was sent or received then add to correct list
                    if(!child.val().sent) {
                        tempIncoming.push({
                            username,
                            id,
                        });
                    }else {
                        tempSent.push({
                            username,
                        });
                    }
                });
                that.setState({incomingRequests: tempIncoming, sentRequests: tempSent});
            });
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={{fontSize: 25}}>Inbox</Text>
            <Text>Friend Requests</Text>
            <View style={styles.line}/>
            <FlatList 
            //style={styles.flatList}
            data={this.state.incomingRequests}
            renderItem={({ item }) => (
                <View><TouchableOpacity>
                <Text>{item.username}</Text>
                </TouchableOpacity></View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            <Text>Sent Requests</Text>
            <View style={styles.line}/>
            <FlatList 
            //style={styles.flatList}
            data={this.state.sentRequests}
            renderItem={({ item }) => (
                <View><TouchableOpacity>
                <Text>{item.username}</Text>
                </TouchableOpacity></View>
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
        padding: 10,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#000',
        width: '100%',
    },
    requestItem: {
        
    },
});
