import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Platform, RefreshControl, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import firebase from "firebase";
import Groups from '../FirebaseCalls/Groups';
import Logo from '../components/AppComponents/Logo';
import FullPostModal from '../components/AppComponents/FullPostModal';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_username: 'to Pack Tracker',
            curr_id: '',
            featuredTitle: 'Featured Title',
            featuredBody: 'Featured Body',
            featuredLikes: 0,
            featuredCommentCount: 0,
            featuredLiked: false,
            featuredLoading: true,
            featuredVisible: true,
            posts: [],
            refreshing: true,
            lastVisible: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const curr_username = await AsyncStorage.getItem("user:username");
        const curr_id = await AsyncStorage.getItem("user:id");
        this.setState({
            curr_username,
            curr_id,
        });

        //this.doLoad();
    }

    async doLoad() {
        if(this.state.featuredVisible) {
            this.getFeaturedPost();
        }
        this.getPosts();
    }

    onRefresh = () => {
        this.setState({refreshing: true, posts: [], lastVisible: ''});
        this.doLoad();
    }

    async getFeaturedPost() {
        this.setState({
            refreshing: false,
            featuredTitle: 'Featured Title',
            featuredBody: 'Featured Body',
        });
        firebase.firestore().doc('posts/featured').get()
            .then((post) => {
                var data = post.data();
                firebase.firestore().doc('posts/'+post.id+'/likers/'+this.state.curr_username)
                    .get().then((likerDoc)=>{
                        this.setState({
                            featuredTitle: data.title,
                            featuredBody: data.body,
                            featuredLikes: data.likes,
                            featuredLiked: likerDoc.exists,
                            featuredCommentCount: data.commentCount,
                            featuredLoading: false,
                        })
                    });
            }).catch((error)=> {
                alert(error);
            });
    }

    async getPosts() {
        var that = this;
        var temp = [...this.state.posts];
        var ref = '';
        if(this.state.lastVisible != '') {
            ref = firebase.firestore().collection('posts').where('featured', '==', false).orderBy('likes', 'desc').orderBy('timestamp', 'desc').startAfter(this.state.lastVisible).limit(3)
        }else {
            ref = firebase.firestore().collection('posts').where('featured', '==', false).orderBy('likes', 'desc').orderBy('timestamp', 'desc').limit(3);
        }
        ref.get().then((snapshot)=> {
                if(snapshot.size == 0) {
                    that.setState({refreshing: false});
                }else {
                
                snapshot.forEach((doc)=> {
                    var data = doc.data();
                    var mytimestamp = new Date(JSON.parse(data.timestamp));
                    var time = Math.floor(Math.abs((new Date()) - mytimestamp) / 1000);
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
                    firebase.firestore().doc('posts/'+doc.id+'/likers/'+this.state.curr_username)
                        .get().then((likerDoc)=>{
                            temp.push({
                                username: data.op_username,
                                title: data.title,
                                body: data.body,
                                likes: data.likes,
                                commentCount: data.commentCount,
                                liked: likerDoc.exists,
                                timestamp: time + " " + ext + "(s) ago",
                                post_id: doc.id,
                                group: data.group
                            });
                            //temp.sort((a,b)=> (a.likes > b.likes) ? -1 : 1);
                            that.setState({posts: temp, lastVisible: doc, refreshing: false});
                        });
                });
                }
            }).catch((error)=> {
                alert(error);
        });
    }

    async doFeaturedLike() {
        this.setState({
            featuredLikes: this.state.featuredLiked ? this.state.featuredLikes-1: this.state.featuredLikes+1,
            featuredLiked: !this.state.featuredLiked
        });
        const g = new Groups(this.state.curr_id, this.state.curr_username);
        g.like("featured", this.state.curr_username);
    }

    async doLike(index, current) {
        let posts = [...this.state.posts];
        let item = {...posts[index]};
        item.liked = !current;
        current ? item.likes-- : item.likes++;
        posts[index] = item;
        this.setState({posts});
        const g = new Groups(this.state.curr_id, this.state.curr_username);
        g.like(item.post_id, this.state.curr_username);
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

    render() {
        return (
        <View style={styles.container}>
        <View style={styles.topBar}>
            <View>
            <Text style={styles.topText}>Home</Text>
            <Text style={styles.topSubText}>Welcome, {this.state.curr_username}!</Text>
            </View>
            <Icon.Ionicons onPress={()=> this.props.navigation.navigate('Search')} name={Platform.OS === 'ios'? 'ios-search' : 'md-search'} color={Colors.tintColor} size={25}/>
        </View>
        <FullPostModal
            ref={component => this.fullPost = component}
            title="Post"
            curr_id={this.state.curr_id}
            curr_user={this.state.curr_username}
        />
        <ScrollView style={styles.body}
            refreshControl={
            <RefreshControl colors={[Colors.tintColor]}
            tintColor={Colors.tintColor}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}/>}>
        <View style={{paddingTop: 10, width: '100%', height: '100%' ,alignItems: 'center'}}>

        {this.state.featuredVisible ? 
        <View style={styles.postHolder}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.listText}>Featured Post</Text>
            <Icon.Ionicons onPress={() => this.setState({featuredVisible: false})} name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={20}/>
            </View>
            <Logo noMargin={true}/>
            <View>
            {this.state.featuredLoading ? <ActivityIndicator size="large" color={Colors.tintColor}/> : 
            <View 
            //style={{padding: 10}}
            >
            <Text style={styles.listText}>{this.state.featuredTitle}</Text>
            <Text style={styles.listTextSmall}>{this.state.featuredBody}</Text>
            <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-evenly',paddingTop: 5}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon.Ionicons color={Colors.lightText} style={{paddingRight: 5}}
                    onPress={()=> this.doComments("PackTracker", this.state.featuredTitle, this.state.featuredBody, this.state.featuredLikes, 0, "featured")} 
                    name={Platform.OS === 'ios'? 'ios-chatboxes' : 'md-chatboxes'} color={Colors.lightText} size={25}/>
                    <Text style={styles.text}>{this.state.featuredCommentCount}</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon.Ionicons style={{paddingRight: 5}} 
                    onPress={()=> this.doFeaturedLike()}
                    name={Platform.OS === 'ios'? 'ios-paw' : 'md-paw'} color={this.state.featuredLiked ? Colors.tintColor : Colors.lightText} size={25}/>
                    
                    <Text style={styles.text}>{this.state.featuredLikes}</Text>
                    </View>
                    </View>
            </View>
            }
            </View>
        </View>
        : null}
        <View style={{ width: '100%' ,alignItems: 'center'}}>
            <FlatList 
            style={styles.flatList}
            data={this.state.posts}
            renderItem={({ item, index }) => (
                <View style={styles.postHolder}>
                <View style={styles.listItem}>
                
                <TouchableOpacity onPress={() => this.props.navigation.navigate('GroupScreen', 
                {
                    name: item.group,
                    position: ''
                })}>
                <Text style={[styles.listTextSmall, {fontWeight: 'bold', paddingBottom: 5}]}>{item.group}</Text>
                </TouchableOpacity>

                <View style={styles.separatedRow}>
                <Text style={styles.op_username}>{item.username}</Text>
                <Text style={styles.listTextSmall}>{item.timestamp}</Text>
                </View>

                <TouchableOpacity onPress={()=>this.doComments(item.username, item.title, item.body, item.likes, item.timestamp, item.post_id)}>
                    <Text style={styles.listText}>{item.title}</Text>
                </TouchableOpacity>

                <Text style={styles.listTextSmall}>{item.body}</Text>
                
                <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-evenly',paddingTop: 5}}>
                
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons color={Colors.lightText} style={{paddingRight: 5}}
                onPress={()=> this.doComments(item.username, item.title, item.body, item.likes, item.timestamp, item.post_id)} 
                name={Platform.OS === 'ios'? 'ios-chatboxes' : 'md-chatboxes'} color={Colors.lightText} size={25}/>
                <Text style={styles.text}>{item.commentCount}</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons style={{paddingRight: 5}} 
                onPress={()=> this.doLike(index, item.liked)}
                name={Platform.OS === 'ios'? 'ios-paw' : 'md-paw'} color={item.liked ? Colors.tintColor : Colors.lightText} size={25}/>
                
                <Text style={styles.text}>{item.likes}</Text>
                </View>
                </View>
                </View>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
        <View style={{marginVertical: 10}}>
        <MyButton disabled={this.state.refreshing} onPress={()=> this.getPosts()} backgroundColor={Colors.tintColor} text="Load More"/>
        </View>
        </View>
        </ScrollView>    
        </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1
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
    separatedRow: { 
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    topText: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 24,
    },
    topSubText: {
        fontSize: 14, 
        fontWeight: 'bold', 
        color: Colors.lightText,
    },
    body: {
        backgroundColor: '#dddddd',
        height: '100%',
    },
    postHolder: {
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 8,
        marginBottom: 10,
        marginHorizontal: '2.5%',
        padding: 10,
        width: '95%',
    },
    flatList: {
        width: '100%',
        flex: 1,
    },
    listItem: {
        flex: 1,
    },
    listText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listTextSmall: {
        color: Colors.text,
        fontSize: 12,
    },
    op_username: {
        color: Colors.tintColor,
        fontWeight: 'bold',
        fontSize: 12
    },
});
