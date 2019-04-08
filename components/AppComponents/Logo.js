import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default class Logo extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <View style= {this.props.noMargin ? styles.container : [styles.container, styles.margin]}>
          <Image
              style={this.props.simple ? {width:75, height:75} : {width:120, height: 120}}
              source={
                this.props.simple ? require('../../assets/images/logo-gray-cropped.png') : require('../../assets/images/pt_logo_1.png')
                }
          />
        {this.props.header == null ? null : <Text style= {styles.logoText}>{this.props.header}</Text>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container : {
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    marginTop:30,
    marginBottom:30 ,
  },
    logoText : {
    padding:10,
    fontSize: 20,
    fontWeight:"bold",
    color: Colors.tintColor,
  }
});