import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Picker } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import MyButton from './MyButton';

export default class CityPickModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      cityChoices: ["-City-","Newport News", "Norfolk", "Leesburg", "Richmond", "Ashburn", "Williamsburg"],
      stateChoices: ["-State-", "VA"],
      isModalVisible: false,
      picked_city: '-City-',
      picked_state: '-State-',
    });
  }

    _toggleModal = () =>
      this.setState({ isModalVisible: !this.state.isModalVisible });

    async setCity() {
        if(this.state.picked_city != "-City-" && this.state.picked_state != "-State-") {
        this._toggleModal();
        this.props.onSuccess();
        }else {
          alert("Please make sure you selected both State and City");
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 20}}>{this.props.label}</Text>
              <TouchableOpacity onPress={this._toggleModal}>
                <Icon.Ionicons name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={30}/>
              </TouchableOpacity>

              </View>
              <Picker
                  selectedValue={this.state.picked_state}
                  style={{width: 150}}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({picked_state: itemValue})}>
                  {this.state.stateChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={item}/>) 
                  })}
                </Picker>
                <Picker
                  selectedValue={this.state.picked_city}
                  style={{width: 200}}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({picked_city: itemValue})}>
                  {this.state.cityChoices.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={item}/>) 
                  })}
                </Picker>
                <MyButton text="Set" onPress={()=>this.setCity()}/>
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
        height: "40%",
        width: "80%", 
        borderRadius: 10, 
        justifyContent: "space-between"
      },
      linkText: {
        fontSize: 16,
        color: Colors.colorSecondary,
        fontWeight: 'bold',
      },
  });
