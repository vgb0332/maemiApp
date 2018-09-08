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
      targetBlock: null,
      needRefresh: true,
    }
  }

  toggleReply = (block) => {
    if(block){
      this.setState({
        replyToggle: !this.state.replyToggle,
        targetBlock : block
      })
    }
    else {
      this.setState({
        replyToggle: !this.state.replyToggle,
      })
    }

  }

  toggleReplyBlock = ( block ) => {
    this.setState({
      replyBlockToggle: !this.state.replyBlockToggle,
      replyBlockData: block,
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.navigation.state.params.needRefresh){
      this.setState({
        needRefresh: true,
      })
    }
  }

  componentDidMount() {
    // console.log('from main', this.props.navigation);
    // console.log(this.props.navigation.state.params.index);
  }

  render() {
    const { props, state } = this;
    const { block } = props.navigation.state.params;
    const { navigation } = props;
    return (
      <View style={styles.container}>
        <DetailBlock
          block={ block }
          needRefresh = {state.needRefresh}
          replyBlockToggle={state.replyBlockToggle}
          toggleReplyBlock={this.toggleReplyBlock}
          scrollIndex={navigation.state.params ? navigation.state.params.index : null}
        />
        <Add
          replyToggle={state.replyToggle}
          toggleReply={this.toggleReply}
        />
        <Reply
          replyToggle={state.replyToggle}
          toggleReply={this.toggleReply}
          targetBlock={ block }
          navigation={props.navigation}
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
