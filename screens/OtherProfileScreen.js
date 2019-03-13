import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import Colors from '../constants/Colors';

import Friends from '../FirebaseCalls/Friends';
import firebase from "firebase";
import 'firebase/firestore';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      username: "...",
      email: "...",
      user_id: "",
      curr_id: '',
      curr_username: '',
      city: "City: Not Set", //Add Dialog if Not set so that user can click the text and set it
      dogs: [{
        doggoName: "No Dogs",
        doggoPic: require('../assets/images/sad-dog.jpg'),
        addButton: true,
    }],
    numDogs: 0,
    dogsLoading: true,
    friendStatus: "Add Friend"
    });
  }
  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    const {navigation} = this.props;
    const curr_id = await AsyncStorage.getItem("user:id");
    const curr_username = await AsyncStorage.getItem("user:username");

    await this.setState({
      username: navigation.getParam('username','....'),
      email: navigation.getParam('email','....'),
      user_id: navigation.getParam("uid","oof"),
      //city
      curr_id,
      curr_username
    });
    //alert(this.state.user_id);
    this.getDogs();
    const that = this;
    
    const ref = firebase.database().ref('users/'+this.state.curr_id+'/friends/'+this.state.user_id);
    
    ref.once('value').then(function(snapshot){
      that.checkFriendStatus(snapshot);
    });

    ref.on('value', function(snapshot) {
      that.checkFriendStatus(snapshot);
  });
  }

  async componentWillUnmount() {
    const ref = firebase.database().ref('users/'+this.state.curr_id+'/friends/'+this.state.user_id);
    ref.off('value');
  }

  getDogs = async () => {

    const user_id = this.state.user_id;
    const docRef = await firebase
        .firestore().collection("users/" + user_id + "/dogs");
        //.firestore().collection("users/bztcTsA1UHgDfQoC0VTte0jq5xf1/dogs");
    
    const tempDogs = [];
    var that = this;
    await docRef.get().then(function(results){
      if(results.size == 0) {
        that.setState({dogsLoading: false});
        return;
      }

      results.forEach((doc) => {
        var docRef = doc.data().dog;

        docRef.get().then(function(documentSnapshot) {
          //set data to the data of the dog's document reference
          const data = documentSnapshot.data();
          tempDogs.push({
            doggoName: data.name,
            doggoBreed: data.breed,
            doggoBirth: data.birth,
            doggoPic: require('../assets/images/smiling-dog.jpg'),

            //This is for the touchable opacity to know whether it should
            //navigate to a dog profile or create new dog onPress.
            addButton: false,
          });
          that.setState({
            dogs: tempDogs,
            numDogs: tempDogs.length,
            dogsLoading: false
          });
        }).catch(error => {
          const { code, message } = error;
          alert(message);
        });
      });
    });
  }

  async onSocialPress () {
    var friendHandler = new Friends(this.state.curr_id, this.state.curr_username);
    //alert("social button pressed");
    switch(this.state.friendStatus) {
      case "Add Friend":
        friendHandler.addFriend(this.state.username, this.state.user_id);
        this.setState({friendStatus: "Cancel Request"});//todo: make constant strings for friendstatus 
      break;

      case "Cancel Request":
        friendHandler.deleteFriend(this.state.user_id);
        this.setState({friendStatus: "Add Friend"});
      break;

      case "Accept Friend Request":
        friendHandler.acceptRequest(this.state.username, this.state.user_id);
        this.setState({friendStatus: "Send Message"});
      break;

      case "Send Message":
        alert("*open messaging");
      break;
    }
  }

  async checkFriendStatus(snapshot) {
    const value = snapshot.val();
    //if value isn't null, the user is in friends list already
    if(value != null) {
      //If sent isn't null, the friend is still in the request process
      if(value.sent != null) {
        const status = snapshot.val().sent ? "Cancel Request" : "Accept Friend Request";
        this.setState({friendStatus: status});
      }else {
        this.setState({friendStatus: "Send Message"});
      }
    }else {
      this.setState({friendStatus: "Add Friend"});
    }
  }

  render() {
    return (
      // <ScrollView style={styles.container}>
      //   <View style={styles.header}></View>
      //   <Image style={styles.avatar} source={require('../assets/images/pt_logo_1.png')} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{this.state.username}</Text>
            <TouchableOpacity onPress={async ()=>this.onSocialPress()}>
                <Text>{this.state.friendStatus}</Text>
            </TouchableOpacity>
            <Text style={styles.info}>{this.state.email}</Text>
            <Text style={styles.description}>{this.state.city}</Text>

            <View style={styles.flatListContainer}>
              <Text style={styles.linkText}>Dogs - {this.state.numDogs}</Text>
              {!this.state.dogsLoading ? 
              <FlatList 
                style={styles.flatList}
                horizontal={true}
                data={this.state.dogs}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                  onPress={() => this.props.navigation.navigate('OtherDogProfile', 
                  {
                      dogName: item.doggoName,
                      dogBreed: item.doggoBreed,
                      dogBirth: item.doggoBirth,
                      dogPic: item.doggoPic,
                  })}
                  style={styles.dogItemHolder}>
                      <Image 
                      style={styles.dogPic}
                      source={item.doggoPic}   
                      />
                      <Text>{item.doggoName}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                />: <ActivityIndicator size='large'/>}
            </View>

            <View style={styles.flatListContainer}>
              <Text style={styles.linkText}>Groups - 0</Text>
            </View>
            <View style={styles.flatListContainer}>
              <Text style={styles.linkText}>Friends - 0</Text>
            </View>
          </View>
        </View>
      //</ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 23,
    },  
    dogItemHolder: {
        marginRight: 15,
        alignItems: 'center',
    },
    dogPic: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },
    linkText: {
        fontSize: 16,
        color: Colors.colorSecondary,
        fontWeight: 'bold',
    },
  flatListContainer: {
    alignItems: 'center',
    padding: 10,
    width: "80%",
    textAlign: "center",
  },
  flatList: {
    padding: 5,
  },
  header: {
    backgroundColor: Colors.tintColor,
    height: 80,
  },
  avatar: {
    width: 150,
    height: 150,
    borderColor: "transparent",
    marginBottom: 15,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 20
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: Colors.colorSecondary,
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150,
    borderRadius: 30,
    backgroundColor: 'rgba(240,0,0,.4)',
  },
});