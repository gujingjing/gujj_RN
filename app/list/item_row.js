import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    AlertIOS,
    TouchableOpacity
} from 'react-native';

import request from '../common/request';
import config from '../common/config';

import Icon from 'react-native-vector-icons/FontAwesome';


const {height, width} = Dimensions.get('window');

export default class ListItem extends Component{


    constructor(props){
        super(props);
        var rowData=this.props.row;

        this.state={
            up:false,
            row:rowData
        }

    }

    _up(){
        let up=!this.state.up;
        let row=this.state.row;

        let url=config.api.base+config.api.up;

        var body={
            id:row.id,
            up:up?'yes':'no',
            accessToken:'abcd',

        }

        let that=this;

        request.post(url,body)
            .then(function (data) {

                if(data && data.success){
                    that.setState({
                        up:up
                    });
                }else{
                    AlertIOS.alert('请求失败，稍后重试。');
                }
            })
            .catch(function (err) {
                console.log(err);
                AlertIOS.alert('请求失败，稍后重试。');
            })

    }

    render(){

        var rowData=this.state.row;
        var that=this;

        return (

            <TouchableOpacity onPress={that.props.onSelect}>
                <View style={styles.item}>
                    <Text style={styles.text}>{rowData.id}</Text>


                    <Image
                        style={styles.video_image}
                        source={{uri: rowData.thumb}}
                    />

                    <Icon
                        style={styles.video}
                        name='play'
                        size={28}
                        color='#900'
                    />

                    <View style={styles.footer}>
                        <View style={styles.like} >

                            {
                                this.state.up
                                ?<Icon
                                        style={styles.up}
                                        name='star'
                                        size={20}
                                        color='#900'
                                    />
                                :<Icon
                                        style={styles.up}
                                        name='heart'
                                        size={20}
                                        color='#900'
                                    />

                            }

                            <Text style={styles.like_text} onPress={this._up.bind(this)}>喜欢</Text>

                        </View>

                        <View style={styles.comment}>
                            <Icon
                                style={styles.comment_icon}
                                name='search'
                                size={20}
                                color='#900'
                            />

                            <Text style={styles.like_text}>评论</Text>

                        </View>

                    </View>

                </View>
            </TouchableOpacity>

        );
    }
}

 const styles=StyleSheet.create({

        item:{
            width:width,
            marginBottom:10,
            backgroundColor:'#fff'

        },
        video_image:{

            width:width,
            height:width*0.56,
            resizeMode:'cover'
        },
        video:{

            position:'absolute',
            bottom:54,
            right:14,
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
        footer:{
            flexDirection:'row',
            justifyContent:'space-between',
            backgroundColor:'#eee'
        },
        like:{
            padding:10,
            flexDirection:'row',
            width:width/2 -0.5,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#fff'
        },
        comment:{
            padding:10,
            flexDirection:'row',
            width:width/2 -0.5,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#fff'
        },

        like_text:{
            paddingLeft:12,
            fontSize:18,
            color:'#333'
        },
        up:{
            fontSize:22,
            color:'#333'
        },
        down:{
            fontSize:22,
            color:'#ed7b66'
        },
    });


