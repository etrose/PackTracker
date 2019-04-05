import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Platform } from 'react-native';
import firebase from "firebase";
import { Icon } from 'expo';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr_username: 'to Pack Tracker',
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
            <Text>Welcome {this.state.curr_username}!</Text>
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
    }
});
