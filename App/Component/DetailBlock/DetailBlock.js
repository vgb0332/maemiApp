import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import { InfiniteScroll } from 'react-native-infinite';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import *  as util from '../../Util/util';
import ReplyBlock from '../../Component/ReplyBlock/ReplyBlock';
import { getDetailBlock } from '../../Lib/BlockManager/GetDetailBlock';

class DetailBlock extends Component<Props> {
  constructor(props) {
    super(props);
    this.infiniteScrollRef = null;
    this.isMount = false;
    this.state = {
      items: [],
			type: 'ready',
      imagePressed: false,
    }
  }

  componentDidMount() {
    this.isMount = true;

    const { block } = this.props;
    const { PID, PPID } = block.ParentBlocks ? block.ParentBlocks : block;
    const { scrollIndex } = this.props;
    getDetailBlock( { PID: PID })
    .then(res => {
      console.log('done',res);
      if(res.success){
        this.setState({
          block : res.data[0],
          items : res.data[0].ChildBlocks,

          headerOffset : 0,
          rowOffset: 0,
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState){

    // console.log(this.props,this.state);
    // if(this.infiniteScrollRef && this.state.items.length){
    //   console.log('lets scroll', this.infiniteScrollRef)
    //   this.infiniteScrollRef.list.scrollToIndex({ index: 0 });
    //   // this.infiniteScrollRef.list.scrollToOffset({ offset: 400 });
    // }

    // this.scrollToIndex();
    // if(this.state.items.length){
    //   // this.scrollToIndex();
    //   setTimeout(()=>{
    //     this.scrollToIndex();
    //   }, 1000)
    // }
  }

  // scrollToIndex = () => {
  //   const { scrollIndex } = this.props;
  //   console.log('did update', this.infiniteScrollRef);
  //   console.log(scrollIndex);
  //   if(scrollIndex !== null && scrollIndex !== undefined && this.infiniteScrollRef){
  //     // this.infiniteScrollRef.list.scrollToOffset({ offset: 400, animated: true });
  //    //  setTimeout(() => {
  //    //
  //    // }, 1000)
  //    this.infiniteScrollRef.list.scrollToIndex({ index: scrollIndex, animated: true });
  //   }
  //
  // }

  componentWillReceiveProps(nextProps){
    if(nextProps.needRefresh){
      this.load('refresh');
    }
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  async load(type) {
		const { props, state } = this;
    const { block } = state;
    if(block){
      const { PID, PPID } = block.ParentBlocks ? block.ParentBlocks : block;
  		switch(type) {
  			case 'more':
          return;
  				await this.setState({ type: 'loading' });
  				await util.sleep(500);
  				if (!this.isMount) return;
  				this.setState({
  					type: 'ready',
  					items: [
  						...state.items,
  					]
  				});
  				break;

  			case 'refresh':
  				await this.setState({ type: 'refresh' });
  				await util.sleep(1000);
  				if (!this.isMount) return;
          getDetailBlock( { PID: PID })
          .then(res => {
            if(res.success){
              this.setState({
                type: state.type === 'end' ? 'end' : 'ready',
                items : res.data[0].ChildBlocks,
              })
            }
          })
          .catch(err=>console.log(err))
  				break;
  		}
    }
    else{
      return null;
    }

	}

  renderRow = ({ item, index, size }) => {
    if(!item) return null;
    console.log(item, index, size);

		return (
      <ReplyBlock
        data = { item }
        needRefresh={this.props.needRefresh}
        replyBlockToggle={this.props.replyBlockToggle}
        toggleReplyBlock={this.props.toggleReplyBlock}
      />

		);
	}

  renderHeader = () => {
    const { props, state } = this;
    const { block } = state;

    if(state.block){
      const BLOCK = block.ParentBlocks;
      const CHILDREN = block.ChildBlocks;
      return (
        <View style={styles.Container}>
          <View style={styles.Status.wrap}>
            <Text style={styles.Status.date}>
              {BLOCK.CREATE_DATE.split(' ')[0]}
            </Text>
            <Text style={styles.Status.location}>
              {BLOCK.BLOCK_ISSUE_LOCATION}
            </Text>
          </View>

          <View style={styles.Tags.wrap}>
            { BLOCK.BLOCK_ISSUE_HASHTAG.split(',').map( ( tag, index) =>
                <Text key={index} style={styles.Tags.tag}> { tag }</Text>
            )}
          </View>

          <View style={styles.Title.wrap}>
            <Text style={styles.Title.text}>
              {BLOCK.BLOCK_ISSUE_THEME}
            </Text>
          </View>

          <View style={styles.MainImage.wrap}>
            <View style={{borderWidth: 1,
            borderColor: C.header,}}>
              <Lightbox onClose={this.onImageClose} onOpen={this.onImageOpen} activeProps={{flex:1}} springConfig={{ tension: 30, friction: 7 }} swipeToDismiss={false}>
                  <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE}}
                        resizeMode={this.state.imagePressed ? "contain" : "stretch"}
                        resizeMethod={"scale"}
                        style={styles.MainImage.image}
                  />
              </Lightbox>
            </View>
          </View>
          <View style={styles.MainContent.wrap}>
            <Text numberOfLines ={6} style={styles.MainContent.content}>
              {BLOCK.BLOCK_ISSUE_CONTENT}
            </Text>
          </View>
        </View>
      );
    }
    else {
      return null;
    }

  }

  onImageOpen = () => {
    this.setState({imagePressed: true})

  }

  onImageClose = () => {
    this.setState({imagePressed: false})
  }

  render() {
    const { props, state } = this;
    const { block } = state;


    if(block){
      const BLOCK = block.ParentBlocks;
      const CHILDREN = block.ChildBlocks;
      return (
        <InfiniteScroll
          ref={(r) => { this.infiniteScrollRef = r; }}
          items={state.items.length ? state.items : [ false ]}
          // itemHeight={700}
          // pageSize={5}
          column={1}
          removeClippedSubviews={false}
          innerMargin={[5,1]}
          outerMargin={[5,5]}
          type={state.type}
          load={(type) => this.load(type)}
          renderRow={this.renderRow}
          renderHeader={ this.renderHeader }
        />
      );
    }
    else{
      return null;
    }

  }
}

export default DetailBlock;
