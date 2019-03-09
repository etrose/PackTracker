import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  ScrollView
} from 'react-native';

import Colors from '../constants/Colors';

import * as firebase from "firebase";
import 'firebase/firestore';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      username: "...",
      email: "...",
      city: "City: Not Set", //Add Dialog if Not set so that user can click the text and set it
      dogs: [],
      groups: [],
      friends: [],
    });
    this.ref = firebase.firestore().collection("users/" + this.props.id + "/dogs");
  }
  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    //const id = await AsyncStorage.getItem("user:id");

    this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
      const doggos = [];
      querySnapshot.forEach((doc) => {
        doggos.push({
          doggoName: doc.data().name
        });
      });

      this.setState({
        dogs: doggos,
      });
    });
    const username = await AsyncStorage.getItem("user:username");
    const email = await AsyncStorage.getItem("user:email");
    this.setState({
      username: username,
      email: email,
      //city
      loading: false,
    })
  }


  logout = () => {
    AsyncStorage.removeItem("user:id");
    AsyncStorage.removeItem("user:username");
    AsyncStorage.removeItem("user:email");
    
    //Actions.reset("auth");

    // firebase.auth().signOut()
    // .then(function() {
    //   Actions.reset("auth");
    // })
    // .catch(error => {
    //   const { code, message } = error;
    //   alert(message);
    // });
    this.signOutUser();
  }

  signOutUser = async () => {
    try {
        firebase.firestore().disableNetwork();
        await firebase.auth().signOut();
        //Actions.reset("auth");
    } catch (e) {
        alert(e)
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={require('../assets/images/pt_logo_1.png')} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{this.state.username}</Text>
            <Text style={styles.info}>{this.state.email}</Text>
            <Text style={styles.description}>{this.state.city}</Text>

            <View style={styles.flatListContainer}>
              <Text>Dogs</Text>
              <FlatList style={styles.flatList}
                data={this.state.dogs}
                renderItem={({ item }) => (
                  <Text>{item.doggoName}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={styles.flatListContainer}>
              <Text>Groups</Text>
              <FlatList style={styles.flatList}
                data={this.state.groups}
                renderItem={({ item }) => (
                  <Text>{item.groupName}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={styles.flatListContainer}>
              <Text>Friends</Text>
              <FlatList style={styles.flatList}
                data={this.state.friends}
                renderItem={({ item }) => (
                  <Text>{item.friendName}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={this.logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flatListContainer: {
    padding: 10,
    height: 100,
    width: "80%",
    textAlign: "center",
  },
  flatList: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,.1)",
    height: 100,
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
    width: 250,
    borderRadius: 30,
    backgroundColor: Colors.colorPrimary,
  },
});