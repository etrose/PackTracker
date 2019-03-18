import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';

export default class NewGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isModalVisible: false,
    });
  }

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });
    
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
                <Text>Group Name:</Text>
                <View style={[AuthPages.inputContainer, {marginTop: 5}]}>
                  <TextInput style={AuthPages.inputBox}
                      underlineColorAndroid="transparent"
                      placeholder="Group Name"
                      placeholderTextColor={Colors.text}
                      onChangeText={text => this.setState({ groupName: text })}
                      ref={(input) => this.groupName = input}
                  /></View>
                  </View>

                  <TouchableOpacity style={AuthPages.button} >
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
        height: "50%",
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
