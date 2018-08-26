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
import ReplyBlock from '../../Component/ReplyBlock/ReplyBlock';

class DetailBlock extends Component<Props> {
  constructor(props) {
    super(props);
    this._infiniteScroll = null;
    this.isMount = false;
    this.state = {
      items: props.block.ChildBlocks,
			type: 'ready',
    }
  }

  // componentDidMount() {
  //   this.isMount = true;
  // }
  //
  // componentWillUnmount() {
  //   this.isMount = false;
  // }

  async load(type) {
		// const { props, state } = this;
		// switch(type) {
		// 	case 'more':
    //     return;
		// 		await this.setState({ type: 'loading' });
		// 		await util.sleep(500);
		// 		if (!this.isMount) return;
		// 		this.setState({
		// 			type: 'ready',
		// 			items: [
		// 				...state.items,
		// 			]
		// 		});
		// 		break;
    //
		// 	case 'refresh':
    //     console.log('refresh');
		// 		await this.setState({ type: 'refresh' });
		// 		await util.sleep(1000);
		// 		if (!this.isMount) return;
		// 		this.setState({
		// 			type: state.type === 'end' ? 'end' : 'ready',
		// 		});
		// 		break;
		// }
	}

  renderRow({ item, index, size }) {
    if(!item) return null;
		return (
      <ReplyBlock
        data = { item }

        replyBlockToggle={this.props.replyBlockToggle}
        toggleReplyBlock={this.props.toggleReplyBlock}
      />

		);
	}

  renderHeader() {
    const { props, state } = this;
    const { block } = props;
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

  render() {
    const { props, state } = this;
    const { block } = props;
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
}

export default DetailBlock;
