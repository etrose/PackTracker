import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

export default class MyButton extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
    <TouchableOpacity width={this.props.width} style={styles.button} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
    </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    button: {

      },
      buttonText: {
        backgroundColor: Colors.tintColor,
        borderRadius:25,
        paddingHorizontal:16,
        paddingVertical:4,
        fontSize:16,
        fontWeight:'500',
        textAlign:'center',
        color:Colors.buttonText,
      },
});