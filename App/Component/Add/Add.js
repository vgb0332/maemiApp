import React, { Component } from 'react';
import {
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';

import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import *  as util from '../../Util/util';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

class Add extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { props, state } = this;
    const { isAuthenticated } = props.user;

    return (
      <TouchableOpacity style={styles.AddWrapper} onPress={
          isAuthenticated ? ()=>props.toggleReply(null) : ()=>Alert.alert('', this.props.translate('LoginAlert'))
        }>
        <Image
        style={styles.AddImage}
        source={require('../../Public/Images/plus.png')} />
      </TouchableOpacity>
    );
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}


export default withLocalize(connect(mapStateToProps, null)(Add));
