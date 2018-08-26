import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  Share,
  TouchableOpacity
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import styles from './Styles';

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
    console.log('sharing link');
    Share.share({
      message: 'BAM: we\'re helping your business with awesome React Native apps',
      url: 'https://www.maemi.com/DetailPage/NPGQTKW',
      title: 'Wow, did you see that?',
    }, {
      // Android only:
      dialogTitle: 'Share BAM goodness',
      // iOS only:
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    })
  }

  link2AddNews = () => {
    this.props.toggleReply();
  }

  render(){
    const { block } = this.props;
    const BLOCK = block.ParentBlocks;
    const CHILDREN = block.ChildBlocks;
    // console.log('children', CHILDREN);
    // console.log(styles);
    // console.log(BLOCK.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200'));
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
                  <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200')}}
                        resizeMode="stretch"
                        resizeMethod='resize'
                        style={styles.MainImageImage}
                  />
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
            }}
          />
        </View>
        </View>
        <View style={styles.Bottom}>
          <View style={styles.BottomShareWrapper}>
            <TouchableOpacity onPress={this.shareLink}>
              <Text style={styles.BottomShareWrapperShare}>
                공유하기
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BottomShareAddNewsWrapper}>
            <TouchableOpacity onPress={this.link2AddNews}>
              <Text style={styles.BottomShareAddNewsWrapperAddNews}>
                뉴스 더하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default IssueBlock;
