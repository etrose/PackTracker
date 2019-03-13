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

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      pic:require('../assets/images/sad-dog.jpg'),
      name:'...',
      breed:'...',
      birth:'...',
      city: "Not Set",
    });
  }
  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    const {navigation} = this.props;

    this.setState({
    pic: navigation.getParam('dogPic', require('../assets/images/sad-dog.jpg')),
    name: navigation.getParam('dogName', 'oof'),
    breed: navigation.getParam('dogBreed', 'oof'),
    birth: navigation.getParam('dogBirth', 'oof'),
    //city: data.city,
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={this.state.pic} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.info}>{this.state.breed}</Text>
            <Text style={styles.description}>BirthDate: {this.state.birth}</Text>
            <Text style={styles.description}>City: {this.state.city}</Text>
            {/*Add Owner Link*/}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    dogItemHolder: {
        marginHorizontal: 10,
        borderRadius: 25,
        width: 100,
        height: 100,
        backgroundColor: Colors.colorSecondary,
    },
    dogPic: {

    },
    container: {
        marginTop: 23,
    }, 
    linkText: {
        fontSize: 16,
        color: Colors.colorSecondary,
        fontWeight: 'bold',
    },
  flatListContainer: {
    padding: 10,
    height: 110,
    width: "80%",
    textAlign: "center",
  },
  flatList: {
    padding: 5,
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
    borderRadius: 75,
    marginBottom: 15,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 30
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 70,
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