import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  Platform
} from 'react-native';

import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';
import MessageModal from '../components/AppComponents/MessageModal';
import Friends from '../FirebaseCalls/Friends';
import firebase from "firebase";
import 'firebase/firestore';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      username: "...",
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
    const { navigation } = this.props;
    const curr_id = await AsyncStorage.getItem("user:id");
    const curr_username = await AsyncStorage.getItem("user:username");

    await this.setState({
      username: navigation.getParam('username', '....'),
      email: navigation.getParam('email', '....'),
      user_id: navigation.getParam("uid", "oof"),
      curr_id,
      curr_username
    });

    this.getCity();
    this.getDogs();
    const that = this;

    const ref = firebase.database().ref('users/' + this.state.curr_id + '/friends/' + this.state.user_id);

    ref.once('value').then(function (snapshot) {
      that.checkFriendStatus(snapshot);
    });

    //Add a listener to the track if the friend status changes
    ref.on('value', function (snapshot) {
      that.checkFriendStatus(snapshot);
    });
  }

  async componentWillUnmount() {
    const ref = firebase.database().ref('users/' + this.state.curr_id + '/friends/' + this.state.user_id);
    ref.off('value');
  }

  async getDogs() {
    var that = this;
    const tempDogs = [];
    firebase.firestore().collection('dogs/').where('owner_id', '==', this.state.user_id)
      .get().then((dogs) => {
        if (dogs.size == 0) {
          that.setState({ dogsLoading: false });
          return;
        }
        dogs.forEach((dog) => {
          const data = dog.data();
          tempDogs.push({
            doggoName: data.name,
            doggoBreed: data.breed,
            doggoBirth: data.birth,
            doggoPic: { uri: data.pic }
          });
          that.setState({
            dogs: tempDogs,
            numDogs: tempDogs.length,
            dogsLoading: false,
          });

        });
      }).catch(error => {
        const { code, message } = error;
        alert(message);
      });
  }

  async getCity() {
    firebase.firestore().doc('users/' + this.state.user_id).get()
      .then((doc) => {
        if (doc.data().city != null) {
          this.setState({ city: doc.data().city + ", " + doc.data().state });
        }
      }).catch(error => {
        const { code, message } = error;
        alert(message);
      });
  }

  async onSocialPress() {
    //Create Friends (Firebase call class)
    var friendHandler = new Friends(this.state.curr_id, this.state.curr_username);
    
    //Based on the friendStatus the button will either
    switch (this.state.friendStatus) {
      //Add friend if users are not friends and there is no request
      case "Add Friend":
        friendHandler.addFriend(this.state.username, this.state.user_id);
        this.setState({ friendStatus: "Cancel Request" });//todo: make constant strings for friendstatus 
        break;
      //Cancel Request if the user has sent the other a request
      case "Cancel Request":
        friendHandler.deleteFriend(this.state.user_id);
        this.setState({ friendStatus: "Add Friend" });
        break;
      //Accept the request if the other user has sent this user a request
      case "Accept Friend Request":
        friendHandler.acceptRequest(this.state.username, this.state.user_id);
        this.setState({ friendStatus: "Send Message" });
        break;
      //Send message if the users are friends
      case "Send Message":
        this.doMessage();
        break;
    }
  }

  //make the message modal visible
  async doMessage() {
    this.message.setState({ isModalVisible: true });
  }

  async checkFriendStatus(snapshot) {
    const value = snapshot.val();
    //if value isn't null, the user is in friends list already
    if (value != null) {
      //If sent isn't null, the friend is still in the request process
      if (value.sent != null) {
        const status = snapshot.val().sent ? "Cancel Request" : "Accept Friend Request";
        this.setState({ friendStatus: status });
      } else {
        this.setState({ friendStatus: "Send Message" });
      }
    } else {
      this.setState({ friendStatus: "Add Friend" });
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <View style={styles.topContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10 }}>
            <Icon.Ionicons onPress={() => this.props.navigation.goBack()} name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} />
            <View></View>
          </View>
          <Text style={styles.name}>{this.state.username}</Text>
          <Text style={styles.description}>{this.state.city}</Text>
          <View style={{ marginVertical: 10 }}>
            <MyButton text={this.state.friendStatus} onPress={async () => this.onSocialPress()} />
          </View>
          <MessageModal
            ref={component => this.message = component}
            toUser={this.state.username}
            toId={this.state.user_id}
            id={this.state.curr_id}
            username={this.state.curr_username}
          />
        </View>
        <View style={styles.smallContainer}>
          <Text style={styles.linkText}>Dogs - {this.state.numDogs}</Text>
          {!this.state.dogsLoading ?
            <FlatList
              style={styles.flatList}
              horizontal={true}
              data={this.state.dogs}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => item.doggoName != "No Dogs" ? this.props.navigation.navigate('OtherDogProfile',
                    {
                      dogName: item.doggoName,
                      dogBreed: item.doggoBreed,
                      dogBirth: item.doggoBirth,
                      dogPic: item.doggoPic,
                      dogCity: this.state.city
                    }) : null}
                  style={styles.dogItemHolder}>
                  <Image
                    style={styles.dogPic}
                    source={item.doggoPic}
                  />
                  <Text>{item.doggoName}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            /> : <View style={{ height: 100 }}><ActivityIndicator size='large' /></View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dogItemHolder: {
    marginRight: 15,
    alignItems: 'center',
  },
  topContainer: {
    alignItems: 'center',
    width: "100%",
    textAlign: "center",
    backgroundColor: '#fff',
    marginBottom: 30,
    elevation: 10,
    borderBottomColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  smallContainer: {
    alignItems: 'center',
    padding: 10,
    width: "90%",
    textAlign: "center",
    backgroundColor: '#fff',
    marginBottom: 30,
    borderRadius: 20,
    elevation: 8,
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
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ddd',
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