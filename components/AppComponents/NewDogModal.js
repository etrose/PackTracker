import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Image, DatePickerAndroid, DatePickerIOS, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Permissions, ImagePicker, Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import firebase from "firebase";
import Groups from '../../FirebaseCalls/Groups';

export default class NewDogModal extends React.Component {

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });

    async askPermissions() {
      const { Permissions } = Expo;
      const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
          result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      }
  }

  registerDog = async () => {
    const { name, breed, selectedDate, pic } = this.state;
    if (name.length <= 0 || selectedDate.length <= 0 || selectedDate == '-Select date-') {
        alert("Please fill out all fields.");
        return;
    }
    if (pic == '') {
      alert("please pick picture for your dog's profile");
      return;
    }
    const dogsRef = firebase.firestore().collection('dogs');
    dogsRef.add({
        name,
        breed,
        birth: selectedDate,
        owner_id: this.state.currId,
        owner_username: this.state.currUser
    }).then((dogRef)=> {
      firebase.storage().ref().child('dogs/'+dogRef.id).put('uri: this.state.pic').then((picRef)=> {
        dogRef.update({
          pic: picRef
        });
      });
      this._toggleModal(); 
      this.props.onSuccess();
    }).catch(error => {
        const { code, message } = error;
        alert(message);
      });
}

  async pickImage(isCamera) {
      if(isCamera) {
          let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [3,3],
              quality: .1,
          });
          console.log(result);
          if(!result.cancelled) {
              this.setState({pic: result.uri});
          }
      }else {
          let result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [3,3],
              quality: .1,
          });
          console.log(result);
          if(!result.cancelled) {
              this.setState({pic: result.uri});
          }
      }
  }

  async datePick() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        maxDate: new Date(),
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({selectedDate: month+1 + '/' + day + '/' + year});
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

    render() {
      return (
        <View style={ styles.container }>
          <Modal style={{ margin: 0, alignItems: 'center', justifyContent: 'center', height: 500, }}
            isVisible={this.state.isModalVisible}
            onBackdropPress={this._toggleModal}>
            <View style={styles.backgroundView}>
            <View style={styles.modal}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.label}</Text>
              <TouchableOpacity onPress={this._toggleModal}>
                <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={30}/>
              </TouchableOpacity>
              </View>

              <View style={{alignItems: 'center'}}>
              
              <TouchableOpacity>
                <Image style={styles.avatar} source={this.state.pic == '' ? require('../../assets/images/smiling-dog.jpg') : {uri: this.state.pic}}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={()=>this.pickImage(false)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-images' : 'md-images'} color={Colors.tintColor} size={30}/>
                        <Text>From Gallery..</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pickImage(true)}>
                        <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-camera' : 'md-camera'} color={Colors.tintColor} size={30}/>
                        <Text>Take Photo..</Text>
                    </TouchableOpacity>
                </View>

              <View style={[AuthPages.inputContainer, {marginTop: 5}]}>
                <TextInput style={[AuthPages.inputBox, {width: 250}]}
                    maxLength={32}
                    underlineColorAndroid="transparent"
                    placeholder="Dog's Name"
                    placeholderTextColor={Colors.text}
                    onChangeText={text => this.setState({ name: text })}
                    ref={(input) => this.name = input}
                /></View>
                
                <Picker
                  selectedValue={this.state.breed}
                  style={{width: 250}}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({breed: itemValue})}>
                  {this.state.breedChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={item}/>) 
                  })}
                </Picker>
                {Platform === 'ios' ? 
                <DatePickerIOS
                  date={this.state.selectedDate}
                  onDateChange={(date)=>this.setState({selectedDate: date})}
                />
                :
                <TouchableOpacity onPress={()=>this.datePick()}>
                  <Text style={{padding: 10}}>Date: {this.state.selectedDate.toString()}</Text>
                </TouchableOpacity>
                }
                </View>

                <TouchableOpacity style={[AuthPages.button, {width: 250}]} onPress={()=>this.registerDog()}>
                  <Text style={AuthPages.buttonText}>Add Dog Profile</Text>
                </TouchableOpacity>
            </View>
            </View>
          </Modal>
        </View>
      );
    }
    constructor(props) {
      super(props);
      this.state = ({
        isModalVisible: false,
        name: '',
        breed: 'Other',
        selectedDate: '-Select date-',
        pic: '',
        currId: this.props.id,
        currUser: this.props.user,
        breedChoices: [
          '-Breed-',
          'other',
          'mixed',
          'affenpinscher',
          'Afghan hound',
          'Airedale terrier',
          'Akita',
          'Alaskan Malamute',
          'American Staffordshire terrier',
          'American water spaniel',
          'Australian cattle dog',
          'Australian shepherd',
          'Australian terrier',
          'basenji',
          'basset hound',
          'beagle',
          'bearded collie',
          'Bedlington terrier',
          'Bernese mountain dog',
          'bichon frise',
          'black and tan coonhound',
          'bloodhound',
          'border collie',
          'border terrier',
          'borzoi',
          'Boston terrier',
          'bouvier des Flandres',
          'boxer',
          'briard',
          'Brussels griffon',
          'bull terrier',
          'bulldog',
          'bullmastiff',
          'cairn terrier',
          'Canaan dog',
          'Chesapeake Bay retriever',
          'Chihuahua',
          'Chinese crested',
          'Chinese shar-pei',
          'chow chow',
          'Clumber spaniel',
          'cocker spaniel',
          'collie',
          'curly-coated retriever',
          'dachshund',
          'Dalmatian',
          'Doberman pinscher',
          'English cocker spaniel',
          'English setter',
          'English springer spaniel',
          'English toy spaniel',
          'Eskimo dog',
          'Finnish spitz',
          'flat-coated retriever',
          'fox terrier',
          'foxhound',
          'French bulldog',
          'German shepherd',
          'German shorthaired pointer',
          'German wirehaired pointer',
          'golden retriever',
          'Gordon setter',
          'Great Dane',
          'greyhound',
          'Irish setter',
          'Irish water spaniel',
          'Irish wolfhound',
          'Jack Russell terrier',
          'Japanese spaniel',
          'keeshond',
          'Kerry blue terrier',
          'komondor',
          'kuvasz',
          'Labrador retriever',
          'Lakeland terrier',
          'Lhasa apso',
          'Maltese',
          'Manchester terrier',
          'mastiff',
          'Mexican hairless',
          'Newfoundland',
          'Norwegian elkhound',
          'Norwich terrier',
          'otterhound',
          'papillon',
          'Pekingese',
          'pointer',
          'Pomeranian',
          'poodle',
          'pug',
          'puli',
          'Rhodesian ridgeback',
          'Rottweiler',
          'Saint Bernard',
          'saluki',
          'Samoyed',
          'schipperke',
          'schnauzer',
          'Scottish deerhound',
          'Scottish terrier',
          'Sealyham terrier',
          'Shetland sheepdog',
          'shih tzu',
          'Siberian husky',
          'silky terrier',
          'Skye terrier',
          'Staffordshire bull terrier',
          'soft-coated wheaten terrier',
          'Sussex spaniel',
          'spitz',
          'Tibetan terrier',
          'vizsla',
          'Weimaraner',
          'Welsh terrier',
          'West Highland white terrier',
          'whippet',
          'Yorkshire terrier'],
      });
    }
  }
  const styles = StyleSheet.create({
      container: {
        flex: 1,
        margin: 0,
        alignItems: 'center',
      },
      avatar: {
        width: 150,
        height: 150,
        borderColor: "transparent",
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 10
      },
      backgroundView: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 23,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      modal: {
        backgroundColor: '#fff', 
        padding: 20, 
        
        width: "80%", 
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      linkText: {
        fontSize: 16,
        color: Colors.colorSecondary,
        fontWeight: 'bold',
      },
  });
