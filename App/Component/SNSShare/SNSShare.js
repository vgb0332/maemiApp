import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Share,
  Alert,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { scrapCheck, scrapBlock } from '../../Lib/UserManager/scrapBlock';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

class SNSShare extends Component<Props> {
  constructor(props){
    super(props);
  }

  share = () => {
    const {block} = this.props.navigation.state.params;
    Share.share({
      message: 'https://www.maemi.com/DetailPage/' + block.ParentBlockPID,
      url: 'https://www.maemi.com/DetailPage/' + block.ParentBlockPID,
    }, {
      // Android only:
      dialogTitle: this.props.translate('Share'),
    })
  }

  render() {
    const { isAuthenticated, user } = this.props.user;
    const { translate } = this.props;

    return (
      <TouchableOpacity onPress={ this.share }>
        <Text> { translate('Share')} </Text>
      </TouchableOpacity>
    );
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}

export default withLocalize(connect( mapStateToProps, null )(SNSShare));
