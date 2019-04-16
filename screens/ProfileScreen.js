import React from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import MyButton from '../components/AppComponents/MyButton';

import firebase from "firebase";
import 'firebase/firestore';
import CityPickModal from '../components/AppComponents/CityPickModal';
import NewDogModal from '../components/AppComponents/NewDogModal';


export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      username: "...",
      curr_id: '',
      email: "...",
      city: "Set City", //Add Dialog if Not set so that user can click the text and set it
      dogs: [{
        doggoName: "No Dogs",
        doggoPic: require('../assets/images/sad-dog.jpg'),
        addButton: true,
    }],
    numDogs: 0,
    dogsLoading: true,
    });
  }
  static navigationOptions = {
    header: null,
  };


  async componentDidMount() {
    const username = await AsyncStorage.getItem("user:username");
    const email = await AsyncStorage.getItem("user:email");
    const curr_id = await AsyncStorage.getItem("user:id");
    this.setState({
      username: username,
      email: email,
      curr_id,
    });
    
    this.getDogs();
    this.getCity();
  }

  async componentDidUpdate() {
    const {navigation} = this.props;
      const newDog = navigation.getParam('needToRefreshDogs', false);
      if(newDog) {
          navigation.setParams({needToRefreshDogs: false});
          this.getDogs();
      }
  }

  async getDogs() {
    var that = this;
    const tempDogs = [];
    firebase.firestore().collection('dogs/').where('owner_id', '==', this.state.curr_id)
      .get().then((dogs)=> {
        if(dogs.size == 0) {
          that.setState({dogs: [{
            doggoName: "No Dogs",
            doggoPic: require('../assets/images/sad-dog.jpg'),
            addButton: true,
        }], numDogs: 0, dogsLoading: false});
          return;
        }
        dogs.forEach((dog)=> {
        const data = dog.data();

          tempDogs.push({
            doggoName: data.name,
            doggoBreed: data.breed,
            doggoBirth: data.birth,
            doggoPic: {uri: data.pic},
            doggoId: dog.id
          });
          that.setState({
            dogs: tempDogs,
            numDogs: tempDogs.length,
            dogsLoading: false,
          });
        //});
        
        });
      }).catch(error => {
        const { code, message } = error;
        alert(message);
      });
  }


  async getCity() {
    firebase.firestore().doc('users/'+this.state.curr_id).get()
      .then((doc)=> {
        if(doc.data().city != null) {
          this.setState({city: doc.data().city + ", " + doc.data().state});
        }
      }).catch(error => {
          const { code, message } = error;
          alert(message);
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

  async doCityPick() {
    this.cityPicker.setState({isModalVisible: true});
  }

  async setCity() {
    const myCity = this.cityPicker.state.picked_city;
    const myState = this.cityPicker.state.picked_state;
    this.setState({city: myCity + ", " + myState});
    firebase.firestore().doc('users/'+this.state.curr_id).update({
      city: myCity,
      state: myState,
    }).catch(error => {
      const { code, message } = error;
      alert(message);
    });
  }

  render() {
    return (
        <View style={styles.body}>

            <View style={styles.topContainer}>
            <Text style={styles.name}>{this.state.username}</Text>
            {/* TODO: Add icon and touchable opacity where user can confirm email */}
            <Text style={styles.info}>{this.state.email}</Text>
            <TouchableOpacity onPress={() => this.doCityPick()}>
            <Text style={styles.description}>{this.state.city}</Text>
            </TouchableOpacity>

            <CityPickModal
              ref={component => this.cityPicker = component}
              label="Set your city"
              onSuccess={()=>this.setCity()}
            />
            <NewDogModal
              ref={component => this.newDog = component}
              label="Dog Profile"
              id={this.state.curr_id}
              user={this.state.username}
              onSuccess={()=>this.getDogs()}
            />
            <View style={styles.row}>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Friends')}>
              <Text style={styles.linkText}>My Friends</Text>
            </TouchableOpacity>
            <View style={{width: 5, backgroundColor: 'black'}}></View>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Groups')}>
              <Text style={styles.linkText}>My Groups</Text>
            </TouchableOpacity>
            </View>
            </View>

            <View style={styles.smallContainer}>
            <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', width: '100%'}}>
              <View/>
              <Text style={styles.tintText}>Dogs - {this.state.numDogs}</Text>
              <TouchableOpacity onPress={()=>this.getDogs()}>
              <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-refresh' : 'md-refresh'} color='#ddd' size={30}/>
              </TouchableOpacity>
              </View>
              {!this.state.dogsLoading ? 
              <FlatList 
              style={styles.flatList}
              horizontal={true}
              data={this.state.dogs}
              renderItem={({ item }) => (
              <TouchableOpacity 
               onPress={() => item.doggoName != "No Dogs" ? this.props.navigation.navigate('DogProfile', 
                  {
                      dogName: item.doggoName,
                      dogBreed: item.doggoBreed,
                      dogBirth: item.doggoBirth,
                      dogPic: item.doggoPic,
                      dogCity: this.state.city,
                      dogId: item.doggoId,
                      onDeleteDog: () => {this.getDogs()}
                  }): null}
              style={styles.dogItemHolder}>
                <Image 
                style={styles.dogPic}
                source={item.doggoPic}   
                />
                <Text style={{color: Colors.text}}>{item.doggoName}</Text>
              </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          />: <View style={{height: 100}}><ActivityIndicator size='large'/></View>}

          <MyButton text="Add Dog" 
          onPress={()=>this.newDog.setState({isModalVisible: true})}
          />
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={this.logout}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Logout</Text>
            </TouchableOpacity>
          
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        //marginTop: 23,
        backgroundColor: '#ddd',
        flex: 1,
    },  
    row: {
      flexDirection: 'row', 
      justifyContent: 'space-evenly', 
      alignItems: 'center', 
      width: '100%',
      borderBottomColor: '#000',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    dogItemHolder: {
        marginHorizontal: 10,
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
        padding: 10,
    },
    tintText: {
      color: Colors.tintColor,
      fontWeight: 'bold',
      fontSize: 20,
      padding: 10,
    },
    topContainer: {
      alignItems: 'center',
      width: "100%",
      textAlign: "center",
      backgroundColor: '#fff',
      marginBottom: 30,
      elevation: 10,
    },
  smallContainer: {
    alignItems: 'center',
    padding: 10,
    width: "90%",
    textAlign: "center",
    backgroundColor: '#fff',
    marginBottom: 30,
    borderRadius: 20,
    elevation: 8,
  },
  flatList: {
    padding: 5,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
    paddingTop: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal:16,
    paddingVertical:4,
    borderRadius: 30,
    backgroundColor: '#ff6d66',
    elevation: 8,
  },
});