import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Button,
} from 'react-native';

import Colors from '../constants/Colors';

import { SearchBar } from 'react-native-elements';

import * as firebase from "firebase";



class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
    };
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
        <SearchBar
          containerStyle={{ flex: 1, backgroundColor: Colors.tintColor, alignItems: 'center'}}
          inputContainerStyle={{ backgroundColor: Colors.background, margin: 0,}}
          onChangeText={text =>this.setState({searchInput:text})}
          value={this.state.searchInput}
          placeholder="Type Here..."
          lightTheme
          round
        />
        <Button style={styles.searchButton} title="GO" onPress={()=>alert(this.state.searchInput)}/>
        </View>
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
    minWidth: "100%",
    maxWidth: "100%",
  },
  searchButton: {
    width: "10%",
  },
});
