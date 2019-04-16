import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet, Platform, Image, DatePickerAndroid, DatePickerIOS, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Permissions, ImagePicker, Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import firebase from "firebase";

export default class NewDogModal extends React.Component {

  //Toggle the modal's visibility
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  //Ask for Permissions to use CAMERA and CAMERA_ROLL needed for iOS and Android
  _togglePicOptions = () => {
    this.askPermissions();
    this.setState({ picOptionsVisible: !this.state.picOptionsVisible });
  }

  async askPermissions() {
    const { Permissions } = Expo;

    const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

    if (status != 'granted') {
      const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

    }
  }

  registerDog = async () => {
    const { name, breed, selectedDate, pic } = this.state;
    //Check that all fields are filled in
    if (name.length <= 0 || selectedDate.length <= 0 || selectedDate == '-Select date-') {
      alert("Please fill out all fields.");
      return;
    }
    //and there is a picture selected
    if (pic == '') {
      alert("please pick picture for your dog's profile");
      return;
    }
    //This will signal the user that the app is working on the profile in the background
    this.setState({ isCreatingDogProfile: true });
    //Make a reference to dogs db collection
    const dogsRef = firebase.firestore().collection('dogs');
    //Call upload image function, then do stuff
    this.uploadImage(this.state.pic, name)
      .then(() => {
        //get the downloadURL of the uploaded image
        firebase.storage().ref().child('dogs/' + this.props.user + '/' + name).getDownloadURL()
          .then((url) => {
            //add a dog document to the dogs collection with all the information that has been filled out
            //as well as the url to the image
            dogsRef.add({
              name,
              breed,
              birth: selectedDate,
              owner_id: this.props.id,
              owner_username: this.props.user,
              pic: url
            }).then(() => {
              //Let the user know it is done and toggle the modal, also onSuccess will call the dogs list to update
              alert(name + "'s profile created!");
              this.setState({ isCreatingDogProfile: false });
              this._toggleModal();
              this.props.onSuccess();
            });
          }).catch((error) => {
            alert(error);
            this.setState({ isCreatingDogProfile: false });
          });
      });
  }

  async pickImage(isCamera) {
    //Use the ImagePicker Library to interact with the hardware of both android and ios
    //quality ranges from 0-1, I did .1 to conserve storage server space and bandwidth cause im a cheapo
    //plus, the images actually don't look half bad
    if (isCamera) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3],
        quality: .1,
      });
      if (!result.cancelled) {
        this.setState({ pic: result.uri });
      }
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 3],
        quality: .1,
      });
      //Set the state pic to the uri of the uri of the selected image
      if (!result.cancelled) {

        this.setState({ pic: result.uri });
      }
    }
  }

  async uploadImage(uri, name) {
    //This code snippet converts the image path (uri) into a blob
    //Which is required in order to upload the picture to firebase.
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    //Create a reference to the storage path and put the blob (upload)
    var ref = firebase.storage().ref().child('dogs/' + this.props.user + '/' + name);
    return ref.put(blob);
  }

  async datePick() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        maxDate: new Date(),
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ selectedDate: month + 1 + '/' + day + '/' + year });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal style={{ margin: 0, alignItems: 'center', justifyContent: 'center', height: 500, }}
          isVisible={this.state.isModalVisible}
          onBackdropPress={this._toggleModal}>
          <View style={styles.backgroundView}>
            <View style={styles.modal}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.props.label}</Text>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} color="black" size={30} />
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center' }}>

                <TouchableOpacity onPress={this._togglePicOptions}>
                  <Image style={styles.avatar} source={this.state.pic == '' ? require('../../assets/images/smiling-dog-edit.png') : { uri: this.state.pic }} />
                </TouchableOpacity>
                {this.state.picOptionsVisible ?
                  <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => this.pickImage(false)}>
                      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-images' : 'md-images'} color={Colors.tintColor} size={30} />
                      <Text>From Gallery..</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickImage(true)}>
                      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'} color={Colors.tintColor} size={30} />
                      <Text>Take Photo..</Text>
                    </TouchableOpacity>
                  </View>
                  : null}

                <View style={[AuthPages.inputContainer, { marginTop: 5 }]}>
                  <TextInput style={[AuthPages.inputBox, { width: 250 }]}
                    maxLength={32}
                    underlineColorAndroid="transparent"
                    placeholder="Dog's Name"
                    placeholderTextColor={Colors.text}
                    onChangeText={text => this.setState({ name: text })}
                    ref={(input) => this.name = input}
                  /></View>

                <Picker
                  selectedValue={this.state.breed}
                  style={{ width: 250 }}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ breed: itemValue })}>
                  {this.state.breedChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={item} />)
                  })}
                </Picker>
                {Platform === 'ios' ?
                  <DatePickerIOS
                    date={this.state.selectedDate}
                    onDateChange={(date) => this.setState({ selectedDate: date })}
                  />
                  :
                  <TouchableOpacity onPress={() => this.datePick()}>
                    <Text style={{ padding: 10 }}>Date: {this.state.selectedDate.toString()}</Text>
                  </TouchableOpacity>
                }
              </View>
              {this.state.isCreatingDogProfile ? <ActivityIndicator color={Colors.tintColor} /> :
              <TouchableOpacity style={[AuthPages.button, { width: 250 }]} onPress={() => this.registerDog()}>
                  <Text style={AuthPages.buttonText}>Add Dog Profile</Text>
                </TouchableOpacity>}
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
      picOptionsVisible: false,
      isCreatingDogProfile: false,
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
