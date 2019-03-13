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

import firebase from "firebase";



class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      allUsers: [],
      found: [],
    };
    this.ref = firebase.firestore().collection("users");
  }
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    const tempUsers = [];
    firebase.firestore().collection("users").get().then((results) => {
      //this.setState({allUsers: results,})
      results.forEach((user) => {
        tempUsers.push({
          username: user.data().username,
          email: user.data().email,
          //city
        });
      });
      this.setState({
        allUsers: tempUsers,
      });
    });
  }

  doSearch = () => {
    //console.log(this.state.allUsers);
    const users = this.state.allUsers;
    const tempFound = [];
    users.forEach((user) => {
      const thisUsername = user.username.toLowerCase();
      const searchInput = this.state.searchInput;
      console.log(thisUsername);
      if(~thisUsername.indexOf(searchInput.toLowerCase())) {
        //alert(thisUsername);
        tempFound.push({
          username: thisUsername,
          email: user.email,
          //city: user.city,
        });
      }
    });
    this.setState({
      found: tempFound,
    });
  }

  searchChange = (text) => {
    this.setState({
      searchInput: text,
    });
    if(text.length > 3) {
      this.doSearch();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
        <SearchBar
          containerStyle={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center'}}
          inputContainerStyle={{ backgroundColor: Colors.background, margin: 0,}}
          onChangeText={text =>this.searchChange(text)}
          value={this.state.searchInput}
          placeholder="Type Here..."
          lightTheme
          round
        />
        {/* <TouchableOpacity style={styles.searchButton} title="GO" onPress={()=>alert(this.state.searchInput)}>
        <Text>Go</Text>
        </TouchableOpacity> */}
        </View>
        <FlatList 
          style={styles.flatList}
          data={this.state.found}
          renderItem={({ item }) => (
            <View><TouchableOpacity
              onPress={() => this.props.navigation.navigate('OtherProfile', 
              {
                username: item.username,
                email: item.email,
              })}
              >
              <Text>{item.username}</Text>
            </TouchableOpacity></View>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
        {/* <TouchableOpacity onPress={this.doSearch}><Text>Search!</Text></TouchableOpacity> */}
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
