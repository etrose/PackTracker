import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    FlatList,
    ScrollView,
    RefreshControl,
    Platform
} from 'react-native';
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
            groupsList: [],
            refreshing: true,
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        //Get user info from local storage
        const curr_id = await AsyncStorage.getItem("user:id");
        const curr_username = await AsyncStorage.getItem("user:username");
        this.setState({ curr_id, curr_username });
        
        this.getGroups();
    }

    getGroups() {
        //Get all the user's groups
        const ref = firebase.database().ref('users/' + this.state.curr_id + '/groups');
        const that = this;
        ref.once('value')
            .then((groups) => {
                var groupsList = [];
                groups.forEach((group) => {
                    groupsList.push({
                        name: group.key,
                        position: group.val().position
                    });
                });
                that.setState({
                    groupsList,
                    refreshing: false
                });
            }).catch(error => {
                const { code, message } = error;
                alert(message);
            });
    }

    onRefresh = () => {
        this.getGroups();
    }

    onNewGroup = (groupName) => {
        //add group to groups
        this.setState({
            groupsList: this.state.groupsList.concat({ name: groupName, position: "Founder" })
        });

    }


    render() {
        return (
            <View style={styles.container}>
            {Platform.OS === 'ios' ?<View style={{width: '100%', height: 20}}/>:null}
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{padding: 5}}>
                        <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} />
                        </TouchableOpacity>
                        <Text style={[{ fontSize: 25, fontWeight: 'bold', color: Colors.tintColor }, styles.topText]}>Groups</Text>
                    </View>
                    <Icon.Ionicons onPress={() => this.props.navigation.navigate('Search')} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25} />
                </View>
                <ScrollView
                    style={styles.body}
                    refreshControl={
                        <RefreshControl
                            colors={[Colors.tintColor]}
                            tintColor={Colors.tintColor}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh} />
                    }
                ><View style={{ padding: 10, }}>
                        <View style={styles.sectionHolder}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={styles.text}>My Groups</Text>
                                <View style={{ alignItems: 'center', padding: 10 }}>
                                    <NewGroupModal label="New Group" id={this.state.curr_id} username={this.state.curr_username} onCreated={this.onNewGroup} />
                                </View>
                            </View>
                            <View style={styles.line} />

                            <FlatList
                                style={styles.flatList}
                                data={this.state.groupsList}
                                renderItem={({ item, index }) => (
                                    <View style={styles.listItem}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => this.props.navigation.navigate('GroupScreen',
                                                {
                                                    name: item.name,
                                                    position: item.position,
                                                })}>
                                            <View>
                                                <Text style={styles.listText}>{item.name}</Text>
                                                <Text style={styles.listTextSmall}>{item.position}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            /></View>

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
        backgroundColor: '#eee',
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
        fontSize: 12,
    },
});
