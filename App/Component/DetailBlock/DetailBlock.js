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
    this._infiniteScroll = null;
    this.isMount = false;
    this.state = {
      items: [],
			type: 'ready',
    }
  }

  componentDidMount() {
    this.isMount = true;

    const { block } = this.props;
    const { PID, PPID } = block.ParentBlocks ? block.ParentBlocks : block;
    const { scrollIndex } = this.props;
    getDetailBlock( { PID: PID })
    .then(res => {
      console.log(res);
      if(res.success){
        this.setState({
          block : res.data[0],
          items : res.data[0].ChildBlocks,
        })
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.needRefresh){
      this.load('refresh');
    }
  }

  componentWillUnmount() {
    this.isMount = false;
  }
  // componentDidMount() {
  //   this.isMount = true;
  // }
  //
  // componentWillUnmount() {
  //   this.isMount = false;
  // }

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

  renderRow({ item, index, size }) {
    if(!item) return null;

		return (
      <ReplyBlock
        data = { item }
        needRefresh={this.props.needRefresh}
        replyBlockToggle={this.props.replyBlockToggle}
        toggleReplyBlock={this.props.toggleReplyBlock}
      />

		);
	}

  renderHeader() {
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
            <Text numberOfLines ={2} style={styles.Title.text}>
              {BLOCK.BLOCK_ISSUE_THEME}
            </Text>
          </View>

          <View style={styles.MainImage.wrap}>
            <View>
              <Lightbox activeProps={{flex:1}} springConfig={{ tension: 30, friction: 7 }} swipeToDismiss={false}>
                  <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE}}
                        resizeMode={"contain"}
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

  render() {
    const { props, state } = this;
    const { block } = state;


    if(block){
      const BLOCK = block.ParentBlocks;
      const CHILDREN = block.ChildBlocks;
      return (
        <InfiniteScroll
          ref={(r) => { this._infiniteScroll = r; }}
          items={state.items.length ? state.items : [ false ]}
          // itemHeight={700}
          pageSize={3}
          column={1}
          innerMargin={[5,1]}
          outerMargin={[5,5]}
          type={state.type}
          load={(type) => this.load(type)}
          renderRow={(res) => this.renderRow(res)}
          renderHeader={ () => this.renderHeader() }
        />
      );
    }
    else{
      return null;
    }

  }
}

export default DetailBlock;
