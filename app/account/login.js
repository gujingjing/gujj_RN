import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AlertIOS
} from 'react-native';

import Button from 'react-native-button';
import {CountDownText} from 'react-native-sk-countdown'

import request from '../common/request';
import config from '../common/config';

export default class Login extends Component {


    constructor(props) {
        super(props);

        this.state = {
            content: '',
            codeSend: false,
            codeNumber: '',
            countingDown: false
        }
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.loginBox}>

                    <Text style={styles.text}>快速登陆</Text>
                    <TextInput
                        placeholder='输入手机号'
                        multiline={false}
                        style={styles.textInputStyle}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'numeric'}
                        maxLength={11}
                        defaultValue={this.state.content}
                        onChangeText={(text)=>{

                                    this.setState({
                                        content:text
                                    });
                                }}
                    />

                    {
                        this.state.codeSend
                            ? <View style={styles.reCodeBox}>
                                <TextInput
                                    placeholder='输入验证码'
                                    multiline={false}
                                    style={styles.reTextInputStyle}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    keyboardType={'numeric'}
                                    defaultValue={this.state.codeNumber}
                                    onChangeText={(text)=>{

                                    this.setState({
                                        codeNumber:text
                                    });
                                }}
                                />

                                {
                                    this.state.countingDown
                                        ? <Button
                                            style={styles.reCodeBtn}
                                            onPress={this._reCodeBtnSend.bind(this)}
                                        >
                                            重新发送
                                        </Button>
                                        : <CountDownText // 倒计时
                                            style={styles.reCodeBtn}
                                            countType='date' // 计时类型：seconds / date
                                            auto={true} // 自动开始
                                            afterEnd={this._coundDown.bind(this)} // 结束回调
                                            timeLeft={10} // 正向计时 时间起点为0秒
                                            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                            startText='重新发送' // 开始的文本
                                            endText='重新发送' // 结束的文本
                                            intervalText={(date, hour, min, sec) => '剩余秒数' + sec} // 定时的文本回调
                                        />
                                }

                            </View>
                            : null
                    }

                    {
                        !this.state.codeSend
                            ? <Button
                                style={styles.submitBtn}
                                onPress={this._codeSendPress.bind(this)}
                            >
                                获取验证码
                            </Button>
                            : <Button
                                style={styles.submitBtn}
                                onPress={this._submitPress.bind(this)}
                            >
                                登陆
                            </Button>
                    }


                </View>


            </View>

        );
    }

    //
    _coundDown() {

        if (!this.state.countingDown) {
            this.setState({
                countingDown: true
            });
        }
    }

    //重新发送
    _reCodeBtnSend() {

        this._codeSendPress();
    }

    //登陆
    _submitPress() {

        let context = this.state.content;
        if (!context) {
            AlertIOS.alert('请输入手机号');
            return;
        }
        let codeNumber = this.state.codeNumber;
        if (!context) {
            AlertIOS.alert('请输入验证码');
            return;
        }

        let url = config.api.base2 + config.api.login;
        let body = {
            codeNumber: Number(codeNumber),
            phoneNumber: Number(context)
        }

        request.post(url, body)
            .then((data) => {
                if (data && data.success) {

                    //讲user保存到本地
                    this.props.afterLogin(data.data);
                }
            })
            .catch((error) => {

                console.log(error);
                AlertIOS.alert('登陆失败');

            });

    }

    //获取验证码
    _codeSendPress() {

        let context = this.state.content;
        if (!context) {
            AlertIOS.alert('请输入手机号');
            return;
        }

        let url = config.api.base + config.api.sinCode;
        let body = {
            phonenumber: Number(context)
        }
        request.post(url, body)
            .then((data) => {
                if (data.success) {

                    this._codeSucceedShow();

                    if (this.state.countingDown) {
                        this.setState({
                            countingDown: false
                        });
                    }

                }
            })
            .catch((error) => {

                console.log(error);
                AlertIOS.alert('请求失败，稍后重试');
            })
    }

    // 验证码获取成功的现实

    _codeSucceedShow() {

        this.setState({
            codeSend: true
        });

        if (this.state.countingDown) {
            this.setState({
                countingDown: false
            });
        }

    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10
    },

    text: {
        textAlign: 'center',
        marginTop: 20
    },
    loginBox: {
        flex: 1
    },
    textInputStyle: {
        marginTop: 10,
        height: 40,
        backgroundColor: '#fff',
        fontSize: 14,
        padding: 5,
        color: '#666'
    },
    reTextInputStyle: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        fontSize: 14,
        padding: 5,
        color: '#666'
    },
    submitBtn: {
        paddingBottom: 8,
        paddingTop: 8,
        borderRadius: 3,
        borderColor: '#ee735c',
        borderWidth: 1,
        color: '#ee735c'
    },
    reCodeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10

    },
    reCodeBtn: {
        height: 40,
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        borderRadius: 5,
    }

});


