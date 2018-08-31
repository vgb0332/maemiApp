import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import styles from './Styles';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

class IssueBlock extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.block.ParentBlocks.PID !== this.props.block.ParentBlocks.PID;
  // }

  onMainImagePress = () => {
    this.props.navigation.navigate("Main", {
      block: this.props.block,
    });
  }

  onReplyImagePress = (index) => {
    this.props.navigation.navigate("Main", {
      index: index,
      block: this.props.block,
    });
  }

  shareLink = () => {
    const { block } = this.props;
    Share.share({
      message: 'https://www.maemi.com/DetailPage/' + block.ParentBlockPID,
      url: 'https://www.maemi.com/DetailPage/' + block.ParentBlockPID,
    }, {
      // Android only:
      dialogTitle: this.props.translate('Share'),
    })
  }

  link2AddNews = () => {
    const { isAuthenticated } = this.props.user;
    const { block } = this.props;
    if(!isAuthenticated){
      Alert.alert('', this.props.translate('LoginAlert'));
      return false;
    }
    this.props.toggleReply(block);
  }

  render(){
    const { block, translate } = this.props;
    const BLOCK = block.ParentBlocks;
    const CHILDREN = block.ChildBlocks;

    return (
      <View style={styles.Container}>
        <View style={styles.ContainerWrapper}>
          <View style={styles.Status}>
            <View style={{backgroundColor:C.gray, width:30, height:30}}></View>
            <Text style={styles.StatusId}>
              {BLOCK.USER_NICK}
            </Text>
            <Text style={styles.StatusDate}>
              {BLOCK.CREATE_DATE.split(' ')[0]}
            </Text>
            <Text style={styles.StatusLocation}>
              {BLOCK.BLOCK_ISSUE_LOCATION}
            </Text>
          </View>

          <View style={styles.Title}>
            <Text numberOfLines ={2} style={styles.TitleText}>
              {BLOCK.BLOCK_ISSUE_THEME}
            </Text>
          </View>

          <View style={styles.Tags}>
            { BLOCK.BLOCK_ISSUE_HASHTAG.split(',').map( ( tag, index) =>
                <Text key={index} style={styles.TagsTag}> { tag }</Text>
            )}
          </View>

          <View style={styles.MainImage}>
            <View>
              <TouchableOpacity onPress={this.onMainImagePress}>
                { BLOCK.BLOCK_ISSUE_IMAGE ?
                  <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200')}}
                        resizeMode="stretch"
                        resizeMethod='resize'
                        style={styles.MainImageImage}
                  />
                  :null
                }

              </TouchableOpacity>
            </View>
            <View style={styles.MainContent}>
              <Text numberOfLines ={6} style={styles.MainContentContent}>
                {BLOCK.BLOCK_ISSUE_CONTENT}
              </Text>
            </View>
          </View>

          <View style={styles.Replies}>
          <FlatList
            horizontal={true}
            data={CHILDREN}
            removeClippedSubviews={true}
            keyExtractor = {(item,index)=> item.ID.toString()}
            renderItem={({ item, index }) =>{
              if(item.BLOCK_ISSUE_IMAGE){
                return (
                    <TouchableOpacity onPress={()=>this.onReplyImagePress(index)}>
                        <Image
                              source={{uri:item.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200')}}
                              resizeMode="stretch"
                              resizeMethod='resize'
                              style={styles.RepliesReply}
                        />
                    </TouchableOpacity>
                );
              }
              else {
                return null;
              }

            }}
          />
        </View>
        </View>
        <View style={styles.Bottom}>
          <View style={styles.BottomShareWrapper}>
            <TouchableOpacity onPress={this.shareLink}>
              <Text style={styles.BottomShareWrapperShare}>
                { translate('Share') }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BottomShareAddNewsWrapper}>
            <TouchableOpacity onPress={this.link2AddNews}>
              <Text style={styles.BottomShareAddNewsWrapperAddNews}>
                { translate('AddNews') }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}

export default withLocalize(connect(mapStateToProps, null)(IssueBlock));
