import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Platform,
} from 'react-native';

import { Icon } from 'expo';

import Colors from '../constants/Colors';

import { SearchBar } from 'react-native-elements';

import firebase from "firebase";



class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: '',
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
    const currentUser = await AsyncStorage.getItem("user:username");
    const tempUsers = [];
    firebase.firestore().collection("users").get().then((results) => {
      //this.setState({allUsers: results,})
      results.forEach((user) => {
        tempUsers.push({
          username: user.data().username,
          email: user.data().email,
          id: user.data().id,
          //city
        });
      });
      
      this.setState({
        allUsers: tempUsers,
        currentUser: currentUser,
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
          
      if(~thisUsername.indexOf(searchInput.toLowerCase())) {
        if(user.username != this.state.currentUser) {
        tempFound.push({
          username: user.username,
          email: user.email,
          uid: user.id,
          //city: user.city,
        });
        }
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
    if(text.length > 1) {
      this.doSearch();
    }else {
        this.setState({found: []});
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
          placeholder="Search for user..."
          lightTheme
          round
        />
        {/* <TouchableOpacity style={styles.searchButton} title="GO" onPress={()=>alert(this.state.searchInput)}>
        <Text>Go</Text>
        </TouchableOpacity> */}
        </View>
        <View style={styles.body}>
        <View style={{padding: 10,}}>
        <Text style={styles.labelText}>Search Results</Text>
        <View style={styles.line}/>
        <FlatList 
          style={styles.flatList}
          data={this.state.found}
          renderItem={({ item }) => (
            <TouchableOpacity style={{flexDirection: 'row',}}
              onPress={() => this.props.navigation.navigate('OtherProfile', 
              {
                username: item.username,
                //email: item.email,
                uid: item.uid,
              })}>
            <View style={styles.searchItem}>
              <View style={{flexDirection: 'row'}}>
              <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-contact' : 'md-contact'} color="orange" size={30}/>
              <Text style={{fontSize: 20, fontWeight: 'bold', paddingLeft: 10}}>{item.username}</Text>
              </View>
            </View></TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          />
          </View>
          </View>
        {/* <TouchableOpacity onPress={this.doSearch}><Text>Search!</Text></TouchableOpacity> */}
        </View>
    );
  }
}
export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 23,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  labelText: {
    backgroundColor:'#fff',
    paddingHorizontal: 10,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    minWidth: "100%",
    maxWidth: "100%",
  },
  body: {
    backgroundColor: '#dddddd',
    height: '100%',
    width: '100%',
  },
  searchItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flatList: {
    flexGrow: 0, 
    marginBottom: 10,
    width: '100%',
  },
  flatListContainer: {
    width: '100%',
  },
});
