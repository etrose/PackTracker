import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import Friends from '../../FirebaseCalls/Friends';

export default class MessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isModalVisible: false,
      message: '',
    });
  }

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });
    

    async sendMessage () {
        const g = new Friends(this.props.id, this.props.username);
        g.sendMessage(this.props.toId, this.state.message);
        this._toggleModal();
    }

    render() {
      return (
        <View style={ styles.container }>
          <Modal style={{ margin: 0, alignItems: 'center', justifyContent: 'center'}}
            isVisible={this.state.isModalVisible}
            onBackdropPress={this._toggleModal}>
            <View style={styles.backgroundView}>
            <View style={styles.modal}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>To: {this.props.toUser}</Text>
              <TouchableOpacity onPress={this._toggleModal}>
                <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={30}/>
              </TouchableOpacity>
              </View>

              <View style={{alignItems: 'center', flexDirection: 'row',}}>
              <View style={[AuthPages.inputContainer, {marginTop: 5, width: '85%', flex: 1}]}>
                <TextInput style={[AuthPages.inputBox, {maxHeight: 120, width: '100%',  padding: 5}]}
                    maxLength={100}
                    fontSize={20}
                    
                    multiline={true}
                    underlineColorAndroid="transparent"
                    placeholder="Type message here..."
                    placeholderTextColor={Colors.text}
                    onChangeText={text => this.setState({ message: text })}
                    ref={(input) => this.message = input}
                /></View>
                <TouchableOpacity onPress={()=> this.sendMessage()}>
                <Icon.Ionicons style={{paddingHorizontal: 15}} name={Platform.OS === 'ios'? 'ios-send' : 'md-send'} color={Colors.tintColor} size={30}/>
                </TouchableOpacity>
                </View>

                {/* <TouchableOpacity style={[AuthPages.button, {width: 250}]} onPress={()=>this.onCreatePressed()}>
                  <Text style={AuthPages.buttonText}>Create</Text>
                </TouchableOpacity> */}
            </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
      container: {
        //padding: 20,
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
