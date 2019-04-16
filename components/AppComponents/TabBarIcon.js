import React from 'react';
import { Icon } from 'expo';

import Colors from '../../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={this.props.focused ? 32 :26}
        style={this.props.focused ? {marginBottom: 1}:{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        tintColor={Colors.tabIconSelected}
      />
    );
  }
}