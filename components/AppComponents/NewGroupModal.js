import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import firebase from "firebase";
import Groups from '../../FirebaseCalls/Groups';

export default class NewGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isModalVisible: false,
      groupName: '',
      cityChoices: ["Newport News", "Norfolk", "Leesburg", "Richmond", "Ashburn", "Williamsburg"],
      stateChoices: ["VA"],
      city: 'Newport News',
      state: 'VA',
      currId: this.props.id,

    });
  }

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });
    
    async onCreatePressed() {
      const groupName = this.state.groupName;
    
      if(groupName.length > 2) {
        var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
        if (pattern.test(groupName)) {
          Alert.alert("Group name invalid", "Cannot contain symbols");
          return;
        }else {
          const city = this.state.city;
          const state = this.state.state;
      
          new Groups(this.props.id, this.props.username).createGroup(groupName, city, state) ?
          Alert.alert("Success!", "Group: " + groupName + " created.") : Alert.alert("Group name invalid", "An existing group already has this name");
          this._toggleModal();
        }
      }else {
        Alert.alert("Group name invalid", "Must be greater than 2 characters.");
      }
    }

    render() {
      return (
        <View style={ styles.container }>
          <TouchableOpacity onPress={this._toggleModal}>
            <Text style={styles.linkText}>{this.props.label}</Text>
          </TouchableOpacity>
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
              <Text>Group Name</Text>
              <View style={[AuthPages.inputContainer, {marginTop: 5}]}>
                <TextInput style={AuthPages.inputBox}
                    underlineColorAndroid="transparent"
                    placeholder="Group Name"
                    placeholderTextColor={Colors.text}
                    onChangeText={text => this.setState({ groupName: text })}
                    ref={(input) => this.groupName = input}
                /></View>
                <Picker
                  selectedValue={this.state.state}
                  style={{width: 150}}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({state: itemValue})}>
                  {this.state.stateChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={index} key={index}/>) 
                  })}
                </Picker>
                <Picker
                  selectedValue={this.state.city}
                  style={{width: 200}}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({city: itemValue})}>
                  {this.state.cityChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={item}/>) 
                  })}
                </Picker>
                </View>

                <TouchableOpacity style={AuthPages.button} onPress={()=>this.onCreatePressed()}>
                  <Text style={AuthPages.buttonText}>Create</Text>
                </TouchableOpacity>
            </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
      container: {
        flex: 1,
        margin: 0,
        alignItems: 'center',
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
