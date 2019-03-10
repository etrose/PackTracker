import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native';

import * as firebase from "firebase";



class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "testuser@test.com",
      password: "testuser",
      text: "hello world!",
      dogs: ["ree","reeburt","jeebis"],
      id: "",
    };
  }
  static navigationOptions = {
    header: null,
  };


  // async componentDidMount() {
  //   const id = await AsyncStorage.getItem("user:id");
  //   alert(this.id);
  //   let ref = firebase.firestore().collection("users/" + id + "/dogs");
  // }

  async componentWillMount() {
    // const docRef = await firebase.firestore().collection("users/bztcTsA1UHgDfQoC0VTte0jq5xf1/dogs");
    // //.doc("Syj3SooZSWzLxDsN75HG");
    // const tempDogs = [];
    // var that = this;
    // await docRef.get().then(function(results){
    //   results.forEach((doc) => {
        
    //     var docRef = doc.data().dog;

    //     docRef.get().then(function(documentSnapshot) {
    //       //set data to the data of the dog's document reference
    //       const data = documentSnapshot.data();
          
    //       tempDogs.push({
    //         doggoName: doc.data().name,
    //         doggoBreed: data.breed,
    //         doggoBirth: data.birth,
    //         //doggoPic: doc.data().pic,
    //       });
    //       that.setState({
    //         dogs: tempDogs,
    //       });
    //       console.log(tempDogs);
    //     }).catch(error => {
    //       const { code, message } = error;
    //       alert(message);
    //     });
    //   });
    // });
  }

  renderItem = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          style={styles.flatList}
          horizontal={true}
          data={this.state.dogs}
          renderItem={({ item }) => (
            <View>
            <Text>{item.doggoName}</Text>
            <Text>{item.doggoBreed}</Text>
            <Text>{item.doggoBirth}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    );
  }
}
export default TestScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 23,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  flatList: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,.1)",
    height: 100,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
