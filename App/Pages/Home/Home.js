/**
 * @flow
 */

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
// import InfiniteList from '../../Component/InfiniteList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataActions from '../../Modules/Data';
import {getIssueBlock} from '../../Lib/BlockManager/GetIssueBlocks';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import { AsyncStorage } from 'react-native';
import *  as util from '../../Util/util';
import Reply from '../../Component/Reply/Reply';
import IssueBlock from '../../Component/IssueBlock/IssueBlock';


const loadAmount = 5;

class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this._infiniteScroll = null;
		this.isMount = false;
		this.state = {
			items: [],
			type: 'ready',
      index: 0,

      searchText: '',
      replyToggle: false,
      targetBlock: null,
		};
  }

  componentDidMount() {
    this.isMount = true;
    // if(!this.props.blocks.data.length){
      getIssueBlock({})
      .then( (res) => {
  			// console.log('Initialized with initial data blocks', res);
        this.props.DataActions.setCurrentData(res.data);
        this.setState({
          items: res.data,
        })


      })
      .catch((err) => {
        console.log(err);
      })
    // }
  }

  componentWillReceiveProps(nextProps){
    //Refresh on reload
    if(nextProps.navigation.state.params && nextProps.navigation.state.params.needRefresh){
      this.load('refresh');
      nextProps.navigation.setParams({
        needRefresh : false,
      })
    }

    this.setState({searchText: nextProps.screenProps.searchText})
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  async load(type) {
		const { props, state } = this;

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
						...items,
					]
				});
				break;

			case 'refresh':
        console.log('refresh');
				await this.setState({ type: 'refresh' });
				await util.sleep(1000);
				if (!this.isMount) return;
        getIssueBlock({})
        .then( (res) => {
    			// console.log('Initialized with initial data blocks', res);
          this.props.DataActions.setCurrentData(res.data);
          this.setState({
  					type: state.type === 'end' ? 'end' : 'ready',
            items: res.data,
          })
        })
        .catch((err) => {
          console.log(err);
        })
				break;
		}
	}

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.blocks !== this.props.blocks;
  // }

  toggleReply = (block) => {
    console.log('blk', block);

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

  renderRow({ item, index, size }) {
    // console.log('rendering row', index);
		return (
			<IssueBlock
         key={index}
         navigation={this.props.navigation}
         block={item}
         toggleReply={this.toggleReply}
      />
		);
    // return <Text> why is this happening? </Text>;
	}

  // renderRow({ item, index, size }) {
  //   console.log('rendering row', index);
  //   return <Text> why is this happening? </Text>;
	// }

  render() {
    const { props, state } = this;
    const { data } = this.props.blocks;
    // console.log( props, state);
    // const filter = data ? data.filter( (item, index) => index < 5 ) : null;

    const filter = data ? data.filter( (item, index ) => {
      return (item.ParentBlocks.BLOCK_ISSUE_THEME ? item.ParentBlocks.BLOCK_ISSUE_THEME.toUpperCase().indexOf(state.searchText.toUpperCase()) > -1 : []);
    }) : [];
    // console.log('filtered data', state.searchText,  filter);
    return (
        <View style={styles.container}>
          <InfiniteScroll
            pageSize={5}
  					ref={(r) => { this._infiniteScroll = r; }}
  					items={filter}
            keyExtractor={ (item, index) => item.ParentBlocks.PID }
  					column={1}
  					innerMargin={[5,1]}
  					outerMargin={[5,5]}
  					type={state.type}
  					load={(type) => this.load(type)}
  					renderRow={(res) => this.renderRow(res)}
          />

          <Reply
            replyToggle={state.replyToggle}
            toggleReply={this.toggleReply}
            targetBlock={state.targetBlock}
            navigation={props.navigation}
          />
        </View>
    );
  }
}

let mapStateToProps = (state) => {
  console.log(state);
    return {
        blocks: state.data.Data,
      };
}


let mapDispatchToProps = (dispatch) => {
    return {
        DataActions: bindActionCreators(dataActions, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
