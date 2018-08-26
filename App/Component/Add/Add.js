import React, { Component } from 'react';
import {
    Image,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import *  as util from '../../Util/util';

class Add extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { props, state } = this;
    return (
      <TouchableOpacity style={styles.AddWrapper} onPress={props.toggleReply}>
        <Image
        style={styles.AddImage}
        source={require('../../Public/Images/plus.png')} />
      </TouchableOpacity>
    );
  }
}

export default Add;
