import React from 'react';
import { StyleSheet, View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';
import NewPostModal from '../components/AppComponents/NewPostModal';
import FullPostModal from '../components/AppComponents/FullPostModal';
import Groups from '../FirebaseCalls/Groups';
import firebase from "firebase";
import 'firebase/firestore';

export default class GroupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curr_id: '',
            curr_username: '',
            groupName: this.props.name,
            groupPosition: this.props.position,
            memberCount: 1,
            cityState: 'General',
            isMember: false,
            refreshing: true,
            likes: 0,
            posts: [],
            lastVisible: '',
            new_modal: false,
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        //Get credentials from Local storage which will be used later in this class
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
        const that = this;

        //Reference the group in the firebase db, 
        const ref = firebase.database().ref('groups/' + this.state.groupName);

        //get the snapshot of the group in the db
        ref.once('value')
            .then((group) => {
                var data = group.val();

                //Set state values to the data from the db call
                that.setState({
                    cityState: data.city + ", " + data.state,
                    memberCount: data.memberCount,
                });

            }).then(() => {
                //Go through member list and see if user is a member, if so, find out what their position is
                firebase.database().ref('groups/' + that.state.groupName + '/members')
                    .once('value')
                    .then((members) => {
                        members.forEach((member) => {
                            if (member.val().id == that.state.curr_id) {
                                that.setState({ isMember: true, position: member.val().position });
                            }
                        });
                    });
            }).catch(error => {
                const { code, message } = error;
                alert(message);
            });
        this.getPosts();
    }

    async getPosts() {
        var that = this;
        var temp = [...this.state.posts];
        var ref;

        //If posts are already loaded, lastvisible will be the last post that was loaded
        if (this.state.lastVisible == '') {
            ref = firebase.firestore().collection('posts').where('group', '==', this.state.groupName).orderBy('timestamp', 'desc').limit(4)
        } else {
            //query will start after the last loaded post and add the posts on to the end of the list
            ref = firebase.firestore().collection('posts').where('group', '==', this.state.groupName).orderBy('timestamp', 'desc').startAfter(this.state.lastVisible).limit(4)
        }
        ref.get().then((snapshot) => {
            if (snapshot.size == 0) {
                console.log(this.state.posts.length);
                if (this.state.posts.length != 0) {
                    alert("No more posts here, try again later.");
                }
                that.setState({ refreshing: false });
            } else {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    var mytimestamp = new Date(JSON.parse(data.timestamp));
                    var time = Math.floor(Math.abs((new Date()) - mytimestamp) / 1000);
                    var ext = "second";

                    //---Do some quick maths---
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
                    //If this doc exists, the current user has liked the post
                    firebase.firestore().doc('posts/' + doc.id + '/likers/' + this.state.curr_username)
                        .get().then((likerDoc) => {
                            temp.push({
                                username: data.op_username,
                                title: data.title,
                                body: data.body,
                                likes: data.likes,
                                commentCount: data.commentCount,
                                liked: likerDoc.exists,
                                timestamp: time + " " + ext + "(s) ago",
                                post_id: doc.id
                            });
                            //Sort based on likes
                            temp.sort((a, b) => (a.likes > b.likes) ? -1 : 1);
                            that.setState({ posts: temp, refreshing: false, lastVisible: doc });
                        });
                });
            }
        }).catch((error) => {
            console.log(error);
            alert(error);
        });
    }

    onRefresh = () => {
        //This calls getPosts after setting the states, that way getPosts won't use old states!
        this.setState({ refreshing: true, posts: [], lastVisible: '' }, this.getPosts);
    }

    async joinOrLeave() {
        var g = new Groups(this.state.curr_id, this.state.curr_username);
        const groupName = this.state.groupName;
        var c = this.state.memberCount;
        if (this.state.isMember) {
            var b = await g.removeMember(groupName);
            c--;
            this.setState({ isMember: false, memberCount: c });
        } else {
            var b = await g.addMember(groupName, "member");
            c++;
            this.setState({ isMember: true, memberCount: c });
        }
    }

    async doPost() {
        this.newPost.setState({ isModalVisible: true });
    }

    async doComments(username, title, body, likes, timestamp, post_id) {
        this.fullPost.setState({
            isModalVisible: true,
            op_username: username,
            title,
            body,
            likes,
            timestamp,
            called: true,
            post_id
        });
    }

    async doLike(index, current) {
        let posts = [...this.state.posts];
        let item = { ...posts[index] };
        item.liked = !current;
        current ? item.likes-- : item.likes++;
        posts[index] = item;
        this.setState({ posts });
        const g = new Groups(this.state.curr_id, this.state.curr_username);
        g.like(item.post_id, this.state.curr_username);
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.topBar}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon.Ionicons onPress={() => this.props.navigation.goBack()} name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} />
                            <View>
                                <Text style={styles.topText}>{this.state.groupName}</Text>
                                <Text style={[styles.text, { paddingHorizontal: 20 }]}>{this.state.cityState}</Text>
                            </View>
                        </View>
                        {this.state.isMember ? <Icon.Ionicons onPress={() => this.doPost()} name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'} color={Colors.tintColor} size={25} /> : null}
                    </View>
                    <View style={styles.topBar}>
                        <Text style={styles.text}>{this.state.memberCount} members</Text>
                        <MyButton onPress={() => this.joinOrLeave()} backgroundColor={Colors.tintColor} text={this.state.isMember ? "Leave Group" : "Join Group"} />
                    </View>
                </View><View style={styles.line} />
                <NewPostModal
                    ref={component => this.newPost = component}
                    id={this.state.curr_id}
                    group={this.state.groupName}
                    username={this.state.curr_username}
                    onSuccess={() => this.onRefresh()}
                />
                <FullPostModal
                    ref={component => this.fullPost = component}
                    title="Post"
                    curr_id={this.state.curr_id}
                    curr_user={this.state.curr_username}
                />

                <ScrollView
                    style={styles.body}
                    refreshControl={
                        <RefreshControl
                            colors={[Colors.tintColor]}
                            tintColor={Colors.tintColor}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh} />
                    }
                >
                    <View style={{ padding: 10, width: '100%', height: '100%', alignItems: 'center' }}>

                        <FlatList
                            style={styles.flatList}
                            data={this.state.posts}
                            renderItem={({ item, index }) => (
                                <View style={styles.sectionHolder}>
                                    <View style={styles.listItem}>

                                        <View style={styles.separatedRow}>
                                            <Text style={[styles.listTextSmall, { fontWeight: 'bold' }]}>{item.username}</Text>
                                            <Text style={styles.listTextSmall}>{item.timestamp}</Text>

                                        </View>

                                        <TouchableOpacity onPress={() => this.doComments(item.username, item.title, item.body, item.likes, item.timestamp, item.post_id)}>
                                            <Text style={styles.listText}>{item.title}</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.listTextSmall}>{item.body}</Text>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: 5 }}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon.Ionicons color={Colors.lightText} style={{ paddingRight: 5 }}
                                                    onPress={() => this.doComments(item.username, item.title, item.body, item.likes, item.timestamp, item.post_id)}
                                                    name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'} color={Colors.lightText} size={25} />
                                                <Text style={styles.text}>{item.commentCount}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon.Ionicons style={{ paddingRight: 5 }}
                                                    onPress={() => this.doLike(index, item.liked)}
                                                    name={Platform.OS === 'ios' ? 'ios-paw' : 'md-paw'} color={item.liked ? Colors.tintColor : Colors.lightText} size={25} />

                                                <Text style={styles.text}>{item.likes}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <MyButton disabled={this.state.refreshing} onPress={() => this.getPosts()} backgroundColor={Colors.tintColor} text="Load More" />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        elevation: 8,
        width: '100%',
        flex: 1,
    },
    body: {
        backgroundColor: '#dddddd',
        height: '100%',
    },
    sectionHolder: {
        elevation: 4,
        marginBottom: 10,
        width: '100%',
        paddingTop: 10,

        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
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
        color: Colors.lightText,
        fontSize: 15,
    },
    topText: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 24,
        paddingHorizontal: 20,
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
    },
    separatedRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listTextSmall: {
        color: Colors.text,
        fontSize: 12,
    },
    postContainer: {
        height: '100%',
    },
});
