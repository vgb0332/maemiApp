import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Button,
  Modal,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNullOrWhiteSpace from '../../Util/isNullOrWhiteSpace';
import * as authActions from '../../Modules/Auth';
import { createReplyBlock } from '../../Lib/BlockManager/CreateReplyBlock';
import { getDetailBlock } from '../../Lib/BlockManager/GetDetailBlock';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import styles from './Styles';
import Lightbox from 'react-native-lightbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class ReplyBlockDetail extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      REPLIES : [],

      replyInput: '',
      replyInit : false
    }

  }

  componentDidMount() {
    const { PID, PPID } = this.props.block;
    getDetailBlock({PID: PID})
    .then( res => {
      console.log(res);
      this.setState({
        REPLIES: res.data[0]
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  renderReplies = ( {item, index} ) => {
    console.log( item, index );
    return (
      <View style={styles.ReplyWrapper}>
        <View style={styles.ReplyUser}>
          {
            item.USER_IMAGE ?
            <Image source={{uri:item.USER_IMAGE}}
                  resizeMode={"contain"}
                  // style={styles.MainImage}
            />
            :
            <Icon name="user" size={20} color="#000" />
          }
        </View>

        <View style={styles.ReplyContent}>
          <View style={styles.ReplyContentInfo}>
            <Text style={styles.ReplyContentName}>{ item.USER_NICK }</Text>
            <Text>{ item.CREATE_DATE }</Text>
          </View>
          <View>
            <Text>
              {item.BLOCK_ISSUE_CONTENT}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  onReplyInputChange = (reply) => {
    this.setState({replyInput : reply})
  }

  onReplyInputFocus = () => {
    this.state.replyInit ? null : this.setState({replyInput:'',replyInit:true})
  }

  onReplyInputBlur = () => {
    if(this.state.replyInput === ''){ this.setState({replyInput: '댓글 작성하기',replyInit:false,})}
  }

  render(){
    const { state, props } = this;
    console.log( state, props);
    const BLOCK = props.block;
    const REPLIES = state.REPLIES;
    console.log(BLOCK, REPLIES);
    const regex = /(<([^>]+)>)|&nbsp;/ig;
    const nbsp = '&nbsp;';
    const gt = '&gt;';
    const lt = '&lt;';

    return (
          <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={props.replyBlockToggle}
          onRequestClose={()=>props.toggleReplyBlock(null)}>

              <View style={styles.ReplyBlockDetailContainer}>

                <View style={styles.ReplyBlockDetailWrapper}>
                  <ScrollView>
                  <View style={styles.ReplyBlockDetailHeader}>
                    <Text> {BLOCK.CREATE_DATE.split(' ')[0]} </Text>
                    <Text> {BLOCK.BLOCK_ISSUE_LOCATION} </Text>

                    <Text style={{alignSelf: 'flex-end'}}> X </Text>
                  </View>

                  <View style={styles.ReplyBlockDetailTag}>
                    {
                      BLOCK.BLOCK_ISSUE_HASHTAG ?
                      BLOCK.BLOCK_ISSUE_HASHTAG.split(',').map( ( tag, index) =>
                        <Text key={index} style={styles.Tag}> { tag }</Text>
                    ) : null}
                  </View>

                  <View style={styles.ReplyBlockDetailImage}>
                    <Lightbox activeProps={{width:'100%', height:'100%'}} springConfig={{ tension: 30, friction: 7 }} swipeToDismiss={false}>
                        <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE}}
                              resizeMode={"contain"}
                              style={styles.MainImage}
                        />
                    </Lightbox>
                  </View>

                  <View style={styles.ReplyBlockDetailContent}>
                    <Text numberOfLines ={6} style={styles.MainContent}>
                      {BLOCK.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
                    </Text>
                  </View>

                  <View style={styles.ReplyBlockDetailStaus}>
                    <View style={styles.StatusElement}>
                      <Text style={{fontWeight:'bold'}}> 댓글 </Text>
                      <Text> { REPLIES.ChildBlockCount } </Text>
                    </View>

                    <View style={styles.StatusElement}>
                      <Text style={{fontWeight:'bold'}}> 추천 </Text>
                      <Text> { BLOCK.VOTE_UP } </Text>
                    </View>

                    <View style={styles.StatusElement}>
                      <Text style={{fontWeight:'bold'}}> 반대 </Text>
                      <Text> { BLOCK.VOTE_DOWN } </Text>
                    </View>
                  </View>


                  <ScrollView>
                    <FlatList
                      data={REPLIES.ChildBlocks}
                      removeClippedSubviews={true}
                      keyExtractor = {(item,index)=> item.PID}
                      renderItem={this.renderReplies}
                    />
                  </ScrollView>
                  </ScrollView>
                  <View style={styles.ReplyInput}>
                    <TextInput
                      style={{textAlign: 'center'}}
                      multiline={true}
                      underlineColorAndroid= 'transparent'
                      onChangeText={(reply) => this.onReplyInputChange(reply)}
                      // onFocus={this.onReplyInputFocus}
                      // onBlur={this.onReplyInputBlur}
                      value={state.replyInput}
                      placeholder='댓글 작성하기'
                    />
                  </View>

                </View>

              </View>

          </Modal>
    )
  }
}
//
// let mapStateToProps = (state) => {
//     return {
//         user: state.user,
//       };
// }
//
//
// let mapDispatchToProps = (dispatch) => {
//     return {
//       AuthActions: bindActionCreators(authActions, dispatch),
//       signup
//     }
// }
export default ReplyBlockDetail;

// export default connect(mapStateToProps, mapDispatchToProps)(ReplyBlockDetail);
