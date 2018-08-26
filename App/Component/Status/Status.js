import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

class Status extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      user: '',
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.user;
    if(isAuthenticated) {
      return (
        <Text> {user.name} </Text>
      );
    }
    else {
      return (
        <Icon name="user" size={30} color="#000" />
      );
    }
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}

export default connect( mapStateToProps, null )(Status);
