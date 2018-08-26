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
import Lightbox from 'react-native-lightbox';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as dataActions from '../../Modules/Data';
// import * as GetIssueBlock from '../../Lib/BlockManager/GetIssueBlocks';

import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import *  as util from '../../Util/util';

class ReplyBlock extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  toggleReplyBlock = () => {
    const BLOCK = this.props.data;
    this.props.toggleReplyBlock( BLOCK );
  }

  render() {
    console.log('coming from reply', this.props);
    const BLOCK = this.props.data;
    const regex = /(<([^>]+)>)|&nbsp;/ig;
    const nbsp = '&nbsp;';
    const gt = '&gt;';
    const lt = '&lt;';

    return (
      <View style={styles.Container}>
        <View style={styles.Status.wrap}>
          <View style={{backgroundColor:C.gray, width:30, height:30}}></View>
          <Text style={styles.Status.id}>
            {BLOCK.USER_NICK}
          </Text>
          <Text style={styles.Status.date}>
            {BLOCK.CREATE_DATE.split(' ')[0]}
          </Text>
          <Text style={styles.Status.location}>
            {BLOCK.BLOCK_ISSUE_LOCATION}
          </Text>
        </View>

        <View style={styles.Title.wrap}>
          <TouchableOpacity onPress={this.toggleReplyBlock}>
            <Text numberOfLines ={3} style={styles.Title.text}>
              {BLOCK.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.MainImage.wrap}>

          <View>
            <TouchableOpacity onPress={this.toggleReplyBlock}>
              <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE}}
                    resizeMode={"stretch"}
                    style={styles.MainImage.image}
              />
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.Footer.wrap}>
          <View style={styles.Footer.content}>
            <Text style={styles.Footer.text}>
              <Text style={{'fontWeight': 'bold'}}> 댓글 </Text>
              <Text> 1 </Text>
            </Text>
          </View>
          <View style={styles.Footer.content}>
            <Text style={styles.Footer.text}>
              <Text style={{'fontWeight': 'bold'}}> 추천 </Text>
              <Text> {BLOCK.VOTE_UP} </Text>
            </Text>
          </View>
          <View style={styles.Footer.content}>
            <Text style={styles.Footer.text}>
              <Text style={{'fontWeight': 'bold'}}> 반대 </Text>
              <Text> {BLOCK.VOTE_DOWN} </Text>
            </Text>
          </View>

        </View>
      </View>
    );
  }
}

export default ReplyBlock;
