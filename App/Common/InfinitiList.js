/**
 * @flow
 */

import React, {
    Component,
} from 'react';

import {
    View,
    FlatList,
    Image,
    Text,
    RefreshControl,
    ScrollView,
    Alert
} from 'react-native';

import { connect } from 'react-redux';

type Props = {
    type: number;
    onRef: Function;
    Get: Function;
    onSetListLength: Function,
    ListItem: any;
    GetParams: Object;
    typeArray: [];
    valueArray: [];
};

class InfiniteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            idx: 0,
            count: 10,
            page:1,
            isLoading: false,
            hasMore: true,
            refreshing: true,
            isDataEmpty: false,
        };

        if (!this.props.GetParams) { this.props.GetParams = {}; }
        if (!this.props.typeArray) { this.props.typeArray = []; }
        if (!this.props.valueArray) { this.props.valueArray = []; }

        this.getList = this.getList.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        this.onRefresh();
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    onRefresh() {
        console.log('INFINITE LIST ==== REFRESH');
        this.setState({
            idx: 0,
            page: 1,
            list: [],
            isLoading: false,
            hasMore: true,
            refreshing: true,
        });

        setTimeout(() => {
            this.getList();
        }, 100);
    }

    getList() {
        console.log('INFINITE LIST ==== GET LIST');
        if (!this.state.isLoading && this.state.hasMore) {
            this.setState({ isLoading: true, refreshing: true });
            this.props.GetParams.idx = this.state.idx;
            this.props.GetParams.count = this.state.count;
            this.props.GetParams.page = this.state.page;
            this.props.Get(this.props.GetParams).then((response) => {
                console.log('INFINITE LIST ==== RETURN LIST');
                console.log(response)
                if (response.success == false) {
                    setTimeout(() => {
                        this.onRefresh();
                    }, 200);
                }
                console.log(`INFINITE LIST ==== GET Success! length: ${response.data.length}`);
                console.log(response.data.length == this.state.count)
                if (response.data.length == this.state.count) {
                    this.setState({
                        hasMore: true,
                        page: this.state.page + 1
                    });
                } else {
                    this.setState({
                        hasMore: false,
                    });
                }
                if (response.data.length == 0) {
                    this.setState({
                        isDataEmpty: true,
                    });
                }
                this.setState({
                    idx: this.state.idx + this.state.count,
                    list: [...this.state.list, ...response.data],
                    isLoading: false,
                    refreshing: false,
                });
                if (this.props.onSetListLength != null) {
                    this.props.onSetListLength(this.state.list.length);
                }
            }).catch((err) => {
                console.log('INFINITE LIST ==== GET Fail!');
                console.log(err);
                Alert.alert(
                        '',
                        '네트워크 연결을 확인해주세요',
                        [
                            { text: '확인', onPress: () => { } },
                        ],
                );
                this.setState({
                    hasMore: false,
                    isLoading: false,
                    refreshing: false,
                    isDataEmpty: false,
                });
            });

        }
        console.log('INFINITE LIST ==== Not Load');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                  data={this.state.list}
                  onEndReachedThreshold={1}
                  onEndReached={this.getList}
                  keyExtractor={(item, index) => index}
                  refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this.onRefresh}
                          tintColor="#000000"
                        />
                    }
                  key={this.props.numColumns}
                  numColumns={this.props.numColumns}
                  renderItem={({ item, index }) => this.props.ListItem(item, index)}
                  ListHeaderComponent={this.props.header}
                  ListEmptyComponent={this.state.refreshing ? null : (
                        <View style={{
                            marginTop: 70, marginBottom: 70, justifyContent: 'center', alignItems: 'center',
                        }}
                        >
                            <Text style={{ fontSize: 16, color: '#848787' }}>목록이 없습니다.</Text>
                        </View>)
                    }
                />
            </View>
        );
    }
}
export default connect(state => ({

}))(InfiniteList);
