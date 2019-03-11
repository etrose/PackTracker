import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

import Colors from '../constants/Colors';

import { SearchBar } from 'react-native-elements';

import * as firebase from "firebase";



class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      snapShot: '',
    };
    this.ref = firebase.firestore().collection("users");
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    // this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
    //   this.setState({
    //     snapShot: querySnapshot,
    //   });
    //   console.log(this.state.snapShot);
    // });
  }

  doSearch = () => {
    alert("Searching" + this.state.searchInput);
    firebase.firestore().collection("users").where("username", "==", this.state.searchInput).get().then((results) => {
      results.forEach((doc) => {
        console.log(doc.data());
        alert(doc.data().email);
      });
    });
    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
        <SearchBar
          containerStyle={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center'}}
          inputContainerStyle={{ backgroundColor: Colors.background, margin: 0,}}
          onChangeText={text =>this.setState({searchInput:text})}
          value={this.state.searchInput}
          placeholder="Type Here..."
          lightTheme
          round
        />
        {/* <TouchableOpacity style={styles.searchButton} title="GO" onPress={()=>alert(this.state.searchInput)}>
        <Text>Go</Text>
        </TouchableOpacity> */}
        </View>
        <TouchableOpacity onPress={this.doSearch}><Text>Search!</Text></TouchableOpacity>
      </View>
    );
  }
}
export default TestScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 23,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    minWidth: "100%",
    maxWidth: "100%",
  },
  searchButton: {
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: Colors.colorSecondary,
  },
});
