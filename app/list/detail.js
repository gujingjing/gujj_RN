import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    AlertIOS,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

const {height, width} = Dimensions.get('window');


export default class Detail extends Component {


    constructor(props) {

        super(props);

        var data = this.props.row;

        this.state = {
            data: data,
            rate: 1,
            muted:true,
            resizeMode:'cover',
            repeat:false,
            videoRady:false,
            vedioDuration:0,
            videoCurrentTime:0.001,
            videoProgress:0.001,
            playing:false,
            pause:false,
            videoOk:true

        };
    }


    _onLoadStart() {

    }

    _onLoad() {

    }

    _onProgress(data) {


        if(!this.state.videoRady){

            this.setState({
                videoRady:true
            });
        }

        if(!this.state.playing){
            this.setState({
                playing:true
            });
        }

        let duration=data.seekableDuration;
        let currentTime=data.currentTime;
        let percent=Number((currentTime/duration).toFixed(2));


        this.setState({
            vedioDuration:duration,
            videoCurrentTime:Number(currentTime.toFixed(2)),
            videoProgress:percent
        });

        console.log('_onProgress')

    }

    _onEnd() {

        this.setState({
            videoProgress:1
        });

        if(this.state.playing){
            this.setState({
                playing:false
            });
        }

        //AlertIOS.alert('请求失败，稍后重试。');
        console.log('_onEnd')

    }

    _onError(error) {
        if(this.state.videoOk){
            this.setState({
                videoOk:false
            });
        }

    }

    render() {

        var data = this.state.data;
        console.log('detail===' + data);

        return (
            <View style={styles.container}>

                <View style={styles.header}>

                    <TouchableOpacity style={styles.headerBox}>

                        <Icon
                            onPress={this._back.bind(this)}
                            style={styles.header_back_icon}
                            name='ios-arrow-left'
                            size={28}
                            color='#900'
                        />

                        <Text  style={styles.header_bac_text} onPress={this._back.bind(this)}>返回</Text>


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
                            &&<Text style={styles.error_text}>视屏解析错误，很抱歉！</Text>

                    }
                    {
                        !this.state.videoRady&&this.state.videoOk
                            &&<ActivityIndicator
                                color='#fff'
                                style={styles.indicator}
                            />

                    }

                    {
                        this.state.videoRady&&this.state.playing
                            ?<TouchableOpacity style={styles.resumBox} onPress={this._resumStop.bind(this)}>

                                {
                                    this.state.pause
                                    //true
                                    ?<Icon
                                            onPress={this._reSumPlay.bind(this)}
                                            style={styles.resumReplayIcon}
                                            name='play'
                                            size={28}
                                            color='#900'
                                        />
                                        :<Text></Text>
                                }
                            </TouchableOpacity>
                            :null
                    }

                    {
                        this.state.videoRady&&!this.state.playing
                            //true
                        ?<Icon
                                onPress={this._rePlay.bind(this)}
                                style={styles.videoIcon}
                                name='play'
                                size={28}
                                color='#900'
                            />
                        :null
                    }

                    <View style={styles.progressBox}>

                        <View style={[styles.progress,{width:width*this.state.videoProgress}]} >

                        </View>

                    </View>

                </View>


            </View>

        );
    }

    //播放
    _reSumPlay(){
        if(this.state.pause){
            this.setState({
                pause:false
            });
        }

    }

    //暂停
    _resumStop(){
        if(!this.state.pause){
            this.setState({
                pause:true
            });
        }
    }
    _rePlay(){
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

    text: {
        textAlign: 'center'
    },
    header: {
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        width:width,
        paddingTop:20,
        paddingLeft:10,
        paddingRight:10,
        height:64,
        borderBottomWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
        backgroundColor:'#fff'
    },
    headerBox:{

        position: 'absolute',
        left: 12,
        top: 32,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_bac_text:{
        color: '#999'

    },
    header_back_icon:{
        color: '#999',
        fontSize: 20,
        marginRight: 5
    }
    ,
    headerTitle: {
        width: width - 120,
        textAlign: 'center'
    },
    videoBox:{
        width: width,
        height: width * 0.56,
        backgroundColor:'#000'
    },
    video: {
        width: width,
        height: width * 0.56,
        backgroundColor:'#000'
    },
    indicator:{
        position:'absolute',
        left:0,
        width:width,
        top:width*0.28,
        backgroundColor:'transparent',
        alignSelf:'center'
    },
    progressBox:{
        width:width,
        height:2,
        backgroundColor:'#ccc'
    },
    progress:{
        width:0,
        height:2,
        backgroundColor:'#ff6600'
    },
    videoIcon:{
        position:'absolute',
        bottom:18,
        right:18,
        width:46,
        height:46,
        paddingTop:9,
        paddingLeft:17,
        backgroundColor:'transparent',
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:23,
        color:'#ed7b66',

    },
    resumBox:{

        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: width * 0.56,
        backgroundColor:'transparent',
    },
    resumReplayIcon:{
        position:'absolute',
        bottom:width*0.28-20,
        right:width*0.5-20,
        width:46,
        height:46,
        paddingTop:9,
        paddingLeft:17,
        backgroundColor:'transparent',
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:23,
        color:'#ed7b66',
    },
    error_text:{
        position: 'absolute',
        left: 0,
        top: width*0.28-5,
        width: width,
        height: width * 0.56,
        backgroundColor:'transparent',
        color:'#fff',
        textAlign:'center',

    }


});


