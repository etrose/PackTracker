import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import Groups from '../../FirebaseCalls/Groups';
import MyButton from './MyButton';

export default class NewPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isModalVisible: false,
      title: '',
      body: '',
      currId: this.props.id,
    });
  }

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });
    
    async onCreatePressed() {
        const g = new Groups(this.props.id, this.props.username);
        g.createPost(this.props.group, this.state.title, this.state.body);
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

                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingBottom: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon.Ionicons onPress={this._toggleModal} name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={20}/>
                <Text style={{fontSize: 22, fontWeight: 'bold', paddingLeft: 10}}>Post to {this.props.group}</Text>
                </View>
                  <MyButton text="Post" onPress={()=> this.onCreatePressed()}/>
                </View>
  
                <View style={{alignItems: 'center', width: '100%'}}>
                <View style={[AuthPages.inputContainer, { marginTop: 5, width: '85%'}]}>
                  <TextInput style={[AuthPages.inputBox, {minHeight: 30, maxHeight: 120, width: '100%',  padding: 5}]}
                      maxLength={28}
                      fontSize={16}
                      
                      multiline={true}
                      underlineColorAndroid="transparent"
                      placeholder="Post Title..."
                      placeholderTextColor={Colors.text}
                      onChangeText={text => this.setState({ title: text })}
                      ref={(input) => this.title = input}
                  /></View>
                  <View style={[AuthPages.inputContainer, {marginTop: 5, width: '85%'}]}>
                  <TextInput style={[AuthPages.inputBox, {minHeight: 30, maxHeight: 160, width: '100%',  padding: 5}]}
                      maxLength={220}
                      fontSize={16}
                      numberOfLines={2}
                      multiline={true}
                      underlineColorAndroid="transparent"
                      placeholder="Post Body..."
                      placeholderTextColor={Colors.text}
                      onChangeText={text => this.setState({ body: text })}
                      ref={(input) => this.body = input}
                  /></View>
                  
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
          padding: 10, 
          width: "95%", 
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
  
