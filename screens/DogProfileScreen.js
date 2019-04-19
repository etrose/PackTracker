import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { Icon, ImagePicker, Permissions } from 'expo';
import firebase from "firebase";
import Colors from '../constants/Colors';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      pic: require('../assets/images/smiling-dog.jpg'),
      dogId: '',
      name:'...',
      breed:'...',
      birth:'...',
      city: "Not Set",
      picOptionsVisible: false,
      settingsVisible: false,
      onDeleteDog: ''
    });
  }
  static navigationOptions = {
    header: null,
  };

  _togglePicOptions = () => {
    this.askPermissions();
    this.setState({ 
      picOptionsVisible: !this.state.picOptionsVisible,
      settingsVisible: false
     });
  }

  _toggleSettings = () => {
    this.setState({ 
      settingsVisible: !this.state.settingsVisible,
      picOptionsVisible: false
     });
  }


  async componentDidMount() {
    const {navigation} = this.props;

    //Get credentials from Navigation Props which will be used later in this class
    this.setState({
    pic: navigation.getParam('dogPic', require('../assets/images/smiling-dog-edit.png')),
    name: navigation.getParam('dogName', 'oof'),
    breed: navigation.getParam('dogBreed', 'oof'),
    birth: navigation.getParam('dogBirth', 'oof'),
    city: navigation.getParam('dogCity', 'Not Set'),
    dogId: navigation.getParam('dogId', 'oof'),
    onDeleteDog: navigation.getParam('onDeleteDog', 'oof')
    });
  }

  async askPermissions() {
    const { Permissions } = Expo;

      const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

      if(status != 'granted') {
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        
      }
}

  async pickImage(isCamera) {
    if(isCamera) {
      let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [3,3],
          quality: .1,
      });
      if(!result.cancelled) {
        this._togglePicOptions();
        this.setState({pic: result.uri});
      }
    }else {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [3,3],
            quality: .1,
        });
        
        if(!result.cancelled) {
          this._togglePicOptions();
          this.setState({pic: {uri: result.uri}});
        }
    }
}

async uploadImage(uri, name) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  //CHange this.props.user to something that holds the username
  var ref = firebase.storage().ref().child('dogs/'+this.props.user+'/'+name);
  return ref.put(blob);
}

askDeleteDog = () => {
  Alert.alert("Warning!",
        "Are you sure you want to delete this dog profile?",
        [
        {text: 'Cancel'},
        {text: 'Delete', onPress: () => this.deleteDogProfile()},
        ],
        {cancelable: false}
    )
}

async deleteDogProfile() {
  firebase.firestore().doc('dogs/'+this.state.dogId).update({
    owner_username: '',
    owner_id: '',
  }).then(()=> {
    this.props.navigation.goBack();
    this.state.onDeleteDog();
  }).catch(error => {
    const { code, message } = error;
    alert(message);
  });
}

  render() {
    return (
      <View style={styles.container}>
      {Platform.OS === 'ios' ?<View style={{width: '100%', height: 20}}/>:null}
      <View style={styles.topBar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 5 }}>
            <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} />
          </TouchableOpacity>
      <TouchableOpacity style={{paddingLeft: 15, }} onPress={()=> this._toggleSettings()}>
      
      <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-more' : 'md-more'} size={30}/>
      
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
          {this.state.picOptionsVisible ?
          <View style={{flexDirection: 'row', width: '80%', alignSelf: 'center', justifyContent: 'space-evenly', backgroundColor: '#fff', borderRadius: 15, position: 'absolute', elevation: 20}}>
              <TouchableOpacity onPress={()=>this.pickImage(false)}>
                  <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-images' : 'md-images'} color={Colors.tintColor} size={30}/>
                  <Text>From Gallery..</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.pickImage(true)}>
                  <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-camera' : 'md-camera'} color={Colors.tintColor} size={30}/>
                  <Text>Take Photo..</Text>
              </TouchableOpacity>
          </View>
          : null}
          {this.state.settingsVisible ?
          <View style={{padding: 5, width: '60%', alignSelf: 'flex-end', justifyContent: 'space-evenly', backgroundColor: '#fff', borderRadius: 15, position: 'absolute', elevation: 20}}>
            <TouchableOpacity style={{padding: 5, width: '100%', flexDirection: 'row', alignItems: 'center'}} onPress={()=>this.askDeleteDog()}>
                <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-trash' : 'md-trash'} color='#ff0000' size={30}/>
                <Text>Delete Dog Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._toggleSettings} style={{width: '100%'}}>
            <Icon.Ionicons style={{paddingTop: 15, alignSelf: 'center'}} name={Platform.OS === 'ios'? 'ios-arrow-up' : 'md-arrow-dropup'} color={Colors.text} size={20}/>
          </TouchableOpacity>
        </View>
        : null}
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
    height: Platform.OS === 'ios' ? 120 : 80,
    elevation: 10
  },
  avatarHolder: {
    marginTop: 20,
    elevation: 10,
    alignSelf: 'center',
    position: 'absolute',
    borderColor: "transparent",
    width: 170,
    height: 170,
    borderRadius: 85,
    //backgroundColor: Colors.tintColor
    backgroundColor: '#fff',
  },
  avatar: {
    width: 170,
    height: 170,
    //borderColor: Colors.tintColor,
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 85,
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
    marginTop: Platform.OS === 'ios' ? 5 : 20,
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