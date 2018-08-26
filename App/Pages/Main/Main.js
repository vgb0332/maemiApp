import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';

import { InfiniteScroll } from 'react-native-infinite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataActions from '../../Modules/Data';
import * as GetIssueBlock from '../../Lib/BlockManager/GetIssueBlocks';
// import FontAwesome, { Icons } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';

import Add from '../../Component/Add/Add';
import Reply from '../../Component/Reply/Reply';
import ReplyBlockDetail from '../../Component/ReplyBlockDetail/ReplyBlockDetail';
import *  as util from '../../Util/util';
import DetailBlock from '../../Component/DetailBlock/DetailBlock';

class Main extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      replyToggle: false,
      replyBlockToggle: false,
      replyBlockData : null,
    }
  }

  toggleReply = () => {
    this.setState({
      replyToggle: !this.state.replyToggle,
    })
  }

  toggleReplyBlock = ( block ) => {
    console.log( block );
    this.setState({
      replyBlockToggle: !this.state.replyBlockToggle,
      replyBlockData : block,
    })
  }

  render() {
    const { props, state } = this;
    const { block } = props.navigation.state.params;
    const { navigation } = props;
    return (
      <View style={styles.container}>
        <DetailBlock
          block={ block }

          replyBlockToggle={state.replyBlockToggle}
          toggleReplyBlock={this.toggleReplyBlock}
        />
        <Add
          replyToggle={state.replyToggle}
          toggleReply={this.toggleReply}
        />
        <Reply
          replyToggle={state.replyToggle}
          toggleReply={this.toggleReply}
        />

        {state.replyBlockData ?
          <ReplyBlockDetail
            replyBlockToggle={state.replyBlockToggle}
            toggleReplyBlock={this.toggleReplyBlock}
            block={state.replyBlockData}
          /> : null
        }


      </View>
    );
  }
}

export default Main;
