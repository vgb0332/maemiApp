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
import { Icon, Avatar } from 'react-native-elements';
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

  link2UserPage = () => {
    const { block } = this.props;
    const BLOCK = block.ParentBlocks;
    console.log(BLOCK);
    this.props.navigation.navigate('MyPage', {
      uid: BLOCK.UID,
    })
  }

  render(){
    const { block, translate } = this.props;
    const BLOCK = block.ParentBlocks;
    const CHILDREN = block.ChildBlocks;
    const regex = /(<([^>]+)>)|&nbsp;/ig;
    const nbsp = '&nbsp;';
    const gt = '&gt;';
    const lt = '&lt;';

    return (
      <View style={styles.Container}>
        <View style={styles.ContainerWrapper}>
          <View style={styles.Status}>
            <TouchableOpacity onPress={this.link2UserPage}>
              {
                BLOCK.USER_IMAGE ?
                <Avatar
                  size="small"
                  rounded
                  source={{uri: BLOCK.USER_IMAGE}}
                  // onPress={() => console.log("Works!")}
                  // activeOpacity={0.7}
                />
                :
                <Avatar
                  rounded
                  icon={{name: 'user', type: 'font-awesome', color:"#333"}}
                  containerStyle={{}}
                />

              }

            </TouchableOpacity>

            <TouchableOpacity onPress={this.link2UserPage}>
              <Text style={styles.StatusId}>
                {BLOCK.USER_NICK}
              </Text>
            </TouchableOpacity>
            <Text style={styles.StatusDate}>
              {BLOCK.CREATE_DATE.split(' ')[0]}
            </Text>
            <Text style={styles.StatusLocation}>
              {BLOCK.BLOCK_ISSUE_LOCATION}
            </Text>
          </View>

          <View style={styles.Title}>
            <TouchableOpacity onPress={this.onMainImagePress}>
              <Text numberOfLines ={2} style={styles.TitleText}>
                {BLOCK.BLOCK_ISSUE_THEME}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.Tags}>
            { BLOCK.BLOCK_ISSUE_HASHTAG.split(',').map( ( tag, index) =>
                <Text key={index} style={styles.TagsTag}> { tag }</Text>
            )}
          </View>
          <TouchableOpacity onPress={this.onMainImagePress}>
            <View style={styles.MainImage}>
                <View>
                    { BLOCK.BLOCK_ISSUE_IMAGE ?
                      <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200')}}
                            resizeMode="stretch"
                            resizeMethod='resize'
                            style={styles.MainImageImage}
                      />
                      :null
                    }
                </View>
              <View style={styles.MainContent}>
                <Text numberOfLines ={6} style={styles.MainContentContent}>
                  {BLOCK.BLOCK_ISSUE_CONTENT}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.Replies}>
          <FlatList
            horizontal={true}
            data={CHILDREN}
            removeClippedSubviews={true}
            keyExtractor = {(item,index)=> item.ID.toString()}
            renderItem={({ item, index }) =>{
              if(item.BLOCK_ISSUE_IMAGE){
                return (
                    <TouchableOpacity style={{marginRight: 5}} onPress={()=>this.onReplyImagePress(index)}>
                        <Image
                              source={{uri:item.BLOCK_ISSUE_IMAGE.replace('maemi-image', 'maemi-image-resize').replace('original', '200x200')}}
                              resizeMode="stretch"
                              resizeMethod='resize'
                              style={styles.RepliesReply}
                        />
                      <View style={{position:'absolute', padding: 5,  backgroundColor: 'rgba(0, 0, 0, 0.4)',height: '40%', bottom: 0, left: 0, width: '100%'}}>
                          <Text numberOfLines={2} style={{color: 'white', fontSize: D.FontSize(1.3)}}>
                            {item.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
                          </Text>
                        </View>
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
