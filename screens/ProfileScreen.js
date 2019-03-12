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
      dogs: [{
        doggoName: "No Dogs",
        doggoPic: require('../assets/images/sad-dog.jpg'),
        addButton: true,
    }],
    numDogs: 0,
    });
  }
  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    const username = await AsyncStorage.getItem("user:username");
    const email = await AsyncStorage.getItem("user:email");
    this.setState({
      username: username,
      email: email,
      //city
    });
    
    this.getDogs();
  }

  async componentDidUpdate() {
    const {navigation} = this.props;
      const newDog = navigation.getParam('needToRefreshDogs', false);
      if(newDog) {
          navigation.setParams({needToRefreshDogs: false});
          this.getDogs();
      }
  }

  getDogs = async () => {

    const user_id = await AsyncStorage.getItem("user:id");
    const docRef = await firebase
        .firestore().collection("users/" + user_id + "/dogs");
        //.firestore().collection("users/bztcTsA1UHgDfQoC0VTte0jq5xf1/dogs");
    
    const tempDogs = [];
    var that = this;
    await docRef.get().then(function(results){
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
          });
        }).catch(error => {
          const { code, message } = error;
          alert(message);
        });
      });
    });
  }

  logout = () => {
    AsyncStorage.removeItem("user:id");
    AsyncStorage.removeItem("user:username");
    AsyncStorage.removeItem("user:email");
    
    this.signOutUser();
  }

  signOutUser = async () => {
    try {
        firebase.firestore().disableNetwork();
        await firebase.auth().signOut();
    } catch (e) {
        alert(e)
    }
  }

  addDog = () => {
      this.props.navigation.navigate('AddDogProfile');
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
              <Text style={styles.linkText}>Dogs - {this.state.numDogs}</Text>
              <FlatList 
          style={styles.flatList}
          horizontal={true}
          data={this.state.dogs}
          renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => this.props.navigation.navigate('DogProfile', 
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
          />
          <TouchableOpacity onPress={this.addDog}>
            <Text>Add Dog</Text>
          </TouchableOpacity>
            </View>

            <View style={styles.flatListContainer}>
              <Text style={styles.linkText}>Groups - 0</Text>
            </View>
            <View style={styles.flatListContainer}>
              <Text style={styles.linkText}>Friends - 0</Text>
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