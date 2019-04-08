import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Platform, RefreshControl, ScrollView } from 'react-native';
import firebase from "firebase";
import Logo from '../components/AppComponents/Logo';
import { Icon } from 'expo';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_username: 'to Pack Tracker',
            featuredTitle: 'Featured Title',
            featuredBody: 'Featured Body',
            featuredLikes: 0,
            featuredCommentCount: 0,
            refreshing: true,
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

        this.doLoad();
    }

    async doLoad() {
        this.getFeaturedPost();
        //this.getPosts();
    }

    async getFeaturedPost() {
        this.setState({
            refreshing: false,
            featuredTitle: 'Featured Title',
            featuredBody: 'Featured Body',
        });
        // firebase.firestore().doc('posts/featured').get()
        //     .then((post) => {

        //     }).catch((error)=> {
        //         alert(error);
        //     });
    }

    async getPosts() {
        // firebase.firestore().collection('posts').orderBy('likes', 'desc').limit(3)
        //     .get().then((posts)=> {
        //         posts.forEach((post)=> {
        //             console.log(post.data().title);
        //         });
        //     }).catch((error)=> {
        //         alert(error);
        // });
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
        <ScrollView style={styles.body}
            refreshControl={
            <RefreshControl colors={[Colors.tintColor]}
            tintColor={Colors.tintColor}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}/>}>
        <View style={{padding: 10, width: '100%', height: '100%' ,alignItems: 'center'}}>

        <View style={styles.postHolder}>
            <Logo noMargin={true}/>
            <View>
            <View style={{padding: 10}}>
            <Text style={styles.listText}>{this.state.featuredTitle}</Text>
            <Text style={styles.listTextSmall}>{this.state.featuredBody}</Text>
            </View>
            </View>
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
        width: '100%',
        borderRadius: 15,
        elevation: 8,
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
