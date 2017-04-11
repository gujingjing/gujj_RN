import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    AlertIOS,
    Modal,
    ScrollView,
    ListView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import Video from 'react-native-video';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';

import request from '../common/request';
import config from '../common/config';

const {height, width} = Dimensions.get('window');


var cacheResults = {
    page: 1,
    items: [],
    total: 0
}

export default class Detail extends Component {


    constructor(props) {

        super(props);

        var data = this.props.row;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            data: data,
            rate: 1,
            muted: true,
            resizeMode: 'cover',
            repeat: false,
            videoRady: false,
            vedioDuration: 0,
            videoCurrentTime: 0.001,
            videoProgress: 0.001,
            playing: false,
            pause: false,
            videoOk: true,
            isRefreshing: false,
            isLoadingMore: false,
            dataSource: ds.cloneWithRows([]),
            visible:false,
            content:'',
            isSending:false

        };
    }

    componentDidMount() {
        this._fetchData(1);
    }


    _onLoadStart() {

    }

    _onLoad() {

    }

    _onProgress(data) {


        if (!this.state.videoRady) {

            this.setState({
                videoRady: true
            });
        }

        if (!this.state.playing) {
            this.setState({
                playing: true
            });
        }

        let duration = data.seekableDuration;
        let currentTime = data.currentTime;
        let percent = Number((currentTime / duration).toFixed(2));


        this.setState({
            vedioDuration: duration,
            videoCurrentTime: Number(currentTime.toFixed(2)),
            videoProgress: percent
        });

        console.log('_onProgress')

    }

    _onEnd() {

        this.setState({
            videoProgress: 1
        });

        if (this.state.playing) {
            this.setState({
                playing: false
            });
        }

        AlertIOS.alert('请求失败，稍后重试。');
        console.log('_onEnd')

    }

    _onError(error) {
        if (this.state.videoOk) {
            this.setState({
                videoOk: false
            });
        }

    }

    render() {

        var data = this.state.data;

        return (
            <View style={styles.container}>

                <View style={styles.header}>

                    <TouchableOpacity style={styles.headerBox}>

                        <Icon
                            onPress={this._back.bind(this)}
                            style={styles.header_back_icon}
                            name='user'
                            size={28}
                            color='#900'
                        />

                        <Text style={styles.header_bac_text} onPress={this._back.bind(this)}>返回</Text>


                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>视屏详情页面</Text>

                </View>

                <View style={styles.videoBox}>
                    <Video

                        source={{uri: data.video}}   // Can be a URL or a local file.
                        ref='videoPlayer'
                        volume={1}                            // 0 is muted, 1 is normal.
                        // Pauses playback entirely.
                        playInBackground={false}                // Audio continues to play when app entering background.
                        playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                        progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)

                        rate={this.state.rate}                              // 0 is paused, 1 is normal.
                        muted={this.state.muted}                           // Mutes the audio entirely.
                        resizeMode={this.state.resizeMode}                      // Fill the whole screen at aspect ratio.*
                        repeat={this.state.repeat}                           // Repeat forever.
                        paused={this.state.pause}

                        onLoadStart={this._onLoadStart.bind(this)}            // Callback when video starts to load
                        onLoad={this._onLoad.bind(this)}               // Callback when video loads
                        onProgress={this._onProgress.bind(this)}               // Callback every ~250ms with currentTime
                        onEnd={this._onEnd.bind(this)}                      // Callback when playback finishes
                        onError={this._onError.bind(this)}               // Callback when video cannot be loaded

                        style={styles.video}/>


                    {
                        !this.state.videoOk
                        && <Text style={styles.error_text}>视屏解析错误，很抱歉！</Text>

                    }
                    {
                        !this.state.videoRady && this.state.videoOk
                        && <ActivityIndicator
                            color='#fff'
                            style={styles.indicator}
                        />

                    }

                    {
                        this.state.videoRady && this.state.playing
                            ? <TouchableOpacity style={styles.resumBox} onPress={this._resumStop.bind(this)}>

                                {
                                    this.state.pause
                                        //true
                                        ? <Icon
                                            onPress={this._reSumPlay.bind(this)}
                                            style={styles.resumReplayIcon}
                                            name='play'
                                            size={28}
                                            color='#900'
                                        />
                                        : <Text></Text>
                                }
                            </TouchableOpacity>
                            : null
                    }

                    {
                        this.state.videoRady && !this.state.playing
                            //true
                            ? <Icon
                                onPress={this._rePlay.bind(this)}
                                style={styles.videoIcon}
                                name='play'
                                size={28}
                                color='#900'
                            />
                            : null
                    }

                    <View style={styles.progressBox}>

                        <View style={[styles.progress,{width:width*this.state.videoProgress}]}>

                        </View>

                    </View>

                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._itemShow.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}
                    renderHeader={this._renderHeader.bind(this)}
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    onEndReached={this._fetchMoreData.bind(this)}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#ff6600"
                        title="拼命加载中..."
                      />
                    }
                />
                <Modal
                    animationType='fade'
                    visible={this.state.visible}
                    onRequestClose={()=>{this._setModalVisible(false)}}>

                    <View style={styles.modalContaner}>

                        <Icon
                            onPress={this._modalClose.bind(this)}
                            style={styles.modalBackIcon}
                            name='ios-arrow-left'
                            size={28}
                            color='#900'
                        />

                        <View style={styles.conponentBox}>
                            <TextInput
                                placeholder='敢不敢评论一个'
                                multiline={true}
                                style={styles.textInputStyle}
                                onFocus={this._onFocus.bind(this)}
                                onBlur={this._onBlur.bind(this)}
                                defaultValue={this.state.content}
                                onChangeText={(text)=>{

                                    this.setState({
                                        content:text
                                    });
                                }}

                            />
                        </View>

                        <Button
                            style={styles.submitBtn}
                            onPress={this._submitPress.bind(this)}
                        >
                            评论
                        </Button>
                    </View>
                </Modal>

            </View>

        );
    }

    //提交评论
    _submitPress(){

        let that =this;
        if(!this.state.content){
            AlertIOS.alert('评论不能为空');
            return;
        }
        if(this.state.isSending){
            AlertIOS.alert('正在评论中');
            return;
        }

        this.setState({
            isSending:true
        },function () {

            let body={
                content:that.state.content,
                accessToken:'abcd'

            };
            let url=config.api.base+config.api.note;

            request.post(url,body)
                .then((data)=>{

                    if(data&&data.success){
                        let items=cacheResults.items;
                        items=[{
                            aply_by:{
                                icon:'http://img15.3lian.com/2015/c1/83/d/29.jpg',
                                nickname:'gjj',
                                title:'这是添加的标题'
                            }

                        }].concat(items);

                        cacheResults.items=items;
                        cacheResults.total=cacheResults.total+1;

                        this.setState({
                            isSending:false,
                            dataSource: that.state.dataSource.cloneWithRows(cacheResults.items),
                            content:''
                        });

                        that._setModalVisible(false);
                    }
                })
                .catch((error)=>{
                    console.log(error);
                    this.setState({
                        isSending:false
                    });

                    that._setModalVisible(false);
                })


        });
    }

    //初始化请求参数
    _fetchData(page) {

        var that = this;


        if (page !== 1) {

            this.setState({
                isLoadingMore: true
            });
        } else {
            this.setState({
                isRefreshing: true
            });
        }

        var url = config.api.base + config.api.component;

        request.get(url, {
            accessToken: 'abcd'
        })
            .then((data) => {

                console.log(data);

                if (data.success) {
                    let items = cacheResults.items;
                    //不是刷新的请求
                    if (page != 1) {
                        items = items.concat(data.data);
                    } else {
                        items.splice(0, items.length);
                        items.concat(data.data);

                    }

                    cacheResults.items = items;
                    cacheResults.total = data.total;
                    that.setState({
                        dataSource: this.state.dataSource.cloneWithRows(cacheResults.items),
                        isRefreshing: false,
                        isLoadingMore: false

                    });
                } else {
                    AlertIOS.alert('数据为空');
                }
            })
            .catch((error) => {
                console.log(error);
                that.setState({
                    isRefreshing: false,
                    isLoadingMore: false

                });
                AlertIOS.alert('请求失败，稍后重试。');
            })
    }

    //获取更多数据
    _fetchMoreData() {

        //请求下一页
        cacheResults.page += 1;


        if (!this._haseMore() || this.state.isLoadingMore) {

            return;
        }
        this._fetchData(cacheResults.page);

    }

    //刷新数据
    _onRefresh() {

        cacheResults.page = 1;

        if (this.state.isRefreshing) {

            return;

        }
        this._fetchData(cacheResults.page);

    }

    _haseMore() {
        return cacheResults.items.length != cacheResults.total;
    }

    //头部样式
    _renderHeader() {
        let data = this.state.data;

        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image
                        style={styles.info_icon}
                        source={{uri:data.author.icon}}
                    />


                    <View style={styles.desBox}>
                        <Text style={styles.nickname}>{data.author.nickname}</Text>
                        <Text style={styles.infoTitle}>{data.title}</Text>

                    </View>

                </View>
                <View style={styles.conponentBox}>
                    <TextInput
                        placeholder='敢不敢评论一个'
                        multiline={true}
                        style={styles.textInputStyle}
                        onFocus={this._onFocus.bind(this)}
                    />
                </View>

            </View>

        );
    }
    //获取焦点的时候
    _onFocus(){
        this._setModalVisible(true);
    }
    _setModalVisible(isVisible){

        this.setState({
            visible:isVisible,
            content:''
        });

    }

    //失去焦点的时候
    _onBlur(){

    }

    _modalClose(){
        this._setModalVisible(false);
    }

    //底部加载更多的样式
    _renderFooter() {

        if (!this._haseMore() && cacheResults.total !== 0) {
            return (
                <View style={styles.loading_more}>
                    <Text style={styles.loading_text}>没有更多了</Text>
                </View>
            );
        }

        if (!this.state.isLoadingMore) {
            return (<View/>);
        }

        return (
            <ActivityIndicator
                style={styles.loading_more}
            />
        );

    }

    //子布局的样式
    _itemShow(rowData) {

        return (
            <View style={styles.infoBoxItem}>
                <Image
                    style={styles.info_iconItem}
                    source={{uri:rowData.aply_by.icon}}
                />


                <View style={styles.desBox}>
                    <Text style={styles.nicknameItem}>{rowData.aply_by.nickname}</Text>
                    <Text style={styles.infoTitleItem}>{rowData.aply_by.title}</Text>

                </View>
            </View>
        );
    }

    //播放
    _reSumPlay() {
        if (this.state.pause) {
            this.setState({
                pause: false
            });
        }

    }

    //暂停
    _resumStop() {
        if (!this.state.pause) {
            this.setState({
                pause: true
            });
        }
    }

    _rePlay() {
        this.refs.videoPlayer.seek(0);
    }

    _back() {

        this.props.navigator.pop();
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    modalContaner:{
        flex:1,
        marginTop:45
    },

    text: {
        textAlign: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        height: 64,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
    },
    headerBox: {

        position: 'absolute',
        left: 12,
        top: 32,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_bac_text: {
        color: '#999'

    },
    header_back_icon: {
        color: '#999',
        fontSize: 20,
        marginRight: 5
    },
    modalBackIcon:{
        color: '#999',
        fontSize: 20,
        alignSelf:'center'
    }
    ,
    headerTitle: {
        width: width - 120,
        textAlign: 'center'
    },
    videoBox: {
        width: width,
        height: width * 0.56,
        backgroundColor: '#000'
    },
    video: {
        width: width,
        height: width * 0.56,
        backgroundColor: '#000'
    },
    indicator: {
        position: 'absolute',
        left: 0,
        width: width,
        top: width * 0.28,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    progressBox: {
        width: width,
        height: 2,
        backgroundColor: '#ccc'
    },
    progress: {
        width: 0,
        height: 2,
        backgroundColor: '#ff6600'
    },
    videoIcon: {
        position: 'absolute',
        bottom: 18,
        right: 18,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 17,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66',

    },
    resumBox: {

        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: width * 0.56,
        backgroundColor: 'transparent',
    },
    resumReplayIcon: {
        position: 'absolute',
        bottom: width * 0.28 - 20,
        right: width * 0.5 - 20,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 17,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66',
    },
    error_text: {
        position: 'absolute',
        left: 0,
        top: width * 0.28 - 5,
        width: width,
        height: width * 0.56,
        backgroundColor: 'transparent',
        color: '#fff',
        textAlign: 'center',

    },
    scroll_style: {},
    infoBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    info_icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 10

    }, infoTitle: {
        marginTop: 8,
        fontSize: 16,
        color: '#666'
    },
    infoBoxItem: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    info_iconItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10

    }, infoTitleItem: {
        marginTop: 8,
        fontSize: 12,
        color: '#666'
    },
    desBox: {
        flex: 1
    },
    nickname: {
        fontSize: 18
    },
    nicknameItem: {
        fontSize: 12
    },
    loading_more: {
        marginVertical: 20
    },
    loading_text: {
        color: '#777',
        textAlign: 'center'
    },
    listHeader:{
        marginTop:10,
        width:width
    },
    conponentBox:{
        paddingTop:10,
        paddingBottom:10,
        width:width
    },
    componentText:{

        fontSize:14,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10
    },
    textInputStyle:{
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:4,
        fontSize:14,
        height:80,
        marginLeft:10,
        marginRight:10,
        paddingLeft:10,
        paddingRight:10
    },
    submitBtn:{
        paddingTop:10,
        paddingBottom:10,
        color:'#ee735c',
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#ee735c'
    }

});


