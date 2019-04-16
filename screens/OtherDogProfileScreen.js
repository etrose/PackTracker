import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      pic: require('../assets/images/sad-dog.jpg'),
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
      <View style={styles.container}>
      <View style={styles.topBar}>
      <Icon.Ionicons onPress={()=> this.props.navigation.goBack()} name={Platform.OS === 'ios'? 'ios-arrow-back' : 'md-arrow-back'} size={25}/>
      <TouchableOpacity style={{paddingLeft: 15, }} onPress={()=> this._toggleSettings()}>
      
      {/* <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-more' : 'md-more'} size={30}/> */}
      
      </TouchableOpacity>
      </View>
        <View style={styles.header}>
        </View>
        <TouchableOpacity style={styles.avatarHolder} 
        //onPress={this._togglePicOptions}
        >
            <Image style={styles.avatar} source={this.state.pic}/>
        </TouchableOpacity>
        <ScrollView style={styles.body}>
          <View style={styles.bodyContent}>
          
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.info}>{this.state.breed}</Text>
            <Text style={styles.description}>BirthDate: {this.state.birth}</Text>
            <Text style={styles.description}>City: {this.state.city}</Text>
            
          </View>
          </ScrollView>
        </View>
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
    topBar: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //backgroundColor: Colors.tintColor,
      backgroundColor: '#fff',
      elevation: 10
  },
  smallContainer: {
    alignItems: 'center',
    padding: 10,
    width: "100%",
    textAlign: "center",
    backgroundColor: '#fff',
    marginBottom: 30,
    borderRadius: 20,
    elevation: 8,
  },
    container: {
      flex: 1,
        //marginTop: 23,
    }, 
    linkText: {
        fontSize: 16,
        color: Colors.colorSecondary,
        fontWeight: 'bold',
    },
  header: {
    //backgroundColor: Colors.tintColor,
    backgroundColor: '#fff',
    height: 80,
    elevation: 10
  },
  avatarHolder: {
    marginTop: 20,
    elevation: 10,
    alignSelf: 'center',
    position: 'absolute',
    borderColor: "transparent",
    width: 150,
    height: 150,
    borderRadius: 75,
    //backgroundColor: Colors.tintColor
    backgroundColor: '#fff',
  },
  avatar: {
    width: 150,
    height: 150,
    //borderColor: Colors.tintColor,
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 75,
    //marginBottom: 15,
    alignSelf: 'center',
    position: 'absolute',
    //marginTop: 30,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    backgroundColor: '#ddd'
  },
  bodyContent: {
    marginTop: 20,
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