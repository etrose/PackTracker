import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default class NewDogModal extends React.Component {
    state = {
      isModalVisible: this.props.isModalVisible,
    };
  
    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });
    
    render() {
      return (
        <View style={ styles.container }>
          <TouchableOpacity onPress={this._toggleModal}>
            <Text>Add Dog</Text>
          </TouchableOpacity>
          <Modal 
          style={{ margin: 0, alignItems: 'center', justifyContent: 'center', height: 500, }}
           isVisible={this.state.isModalVisible}
           onBackdropPress={()=> this.setState({isModalVisible: false})}>
            <View style={styles.contentContainer}>
              <Text>Hello!</Text>
              <TouchableOpacity onPress={this._toggleModal}>
                <Text>Hide me!</Text>
              </TouchableOpacity>
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
      contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
        backgroundColor: '#fff',
        margin: 0,
      },
  });
