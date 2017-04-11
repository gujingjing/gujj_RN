import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    AlertIOS,
    TextInput,
    Dimensions,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button';


import request from '../common/request';
import config from '../common/config';
import sha1 from 'sha1';

const {height, width} = Dimensions.get('window');


var photoOptions = {
    title: '选择头像',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    quality: 0.75,
    allowsEditing: true,
    noData: false,

    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


export default class Account extends Component {

    constructor(props) {
        super(props);

        let user = this.props.user || {};

        this.state = {
            user: user,
            avatarProgress: 0,
            avararUpLoading: false,
            nickname: '',
            module_visible: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('user')
            .then((data) => {
                let user;

                if (data) {
                    user = JSON.parse(data);
                }
                if (user) {

                    this.setState({
                        user: user
                    });
                }

            })
            .catch((error) => {

                console.log(error);

            });
    }

    render() {

        let user=this.state.user;

        return (
            <View style={styles.container}>

                <View style={styles.titleConta}>

                    <Text style={styles.text}>我的界面</Text>
                    <Text style={styles.edit} onPress={this._editPress.bind(this)}>编辑</Text>

                </View>

                {
                    this.state.user.icon
                        ? <TouchableOpacity
                            style={styles.photoBox}
                            onPress={this._choosePhoto.bind(this)}
                        >

                            <Image
                                style={styles.photoBox}
                                source={{uri:this.state.user.icon}}
                            >

                                <View style={styles.addIcon}>
                                    {
                                        this.state.avararUpLoading
                                            ? <Progress.Circle
                                                showsText={true}
                                                size={40}
                                                color='#ee735c'
                                                progress={this.state.avatarProgress}
                                                style={styles.iconPlus}
                                            />
                                            : <Image
                                                style={styles.smallIconShow}
                                                source={{uri:this.state.user.icon}}
                                            />
                                    }

                                </View>


                                <Text style={styles.addIconText}>戳这里添加头像</Text>

                            </Image>

                        </TouchableOpacity>
                        : <View style={styles.photoBox}>

                            <Text style={styles.addIconText}>添加我的头像</Text>

                            <TouchableOpacity style={styles.addIcon}>

                                {
                                    this.state.avararUpLoading
                                        ? <Progress.Circle
                                            showsText={true}
                                            size={40}
                                            color='#ee735c'
                                            progress={this.state.avatarProgress}
                                            style={styles.iconPlus}
                                        />
                                        : <Icon
                                            onPress={this._addIconPress.bind(this)}
                                            style={styles.iconPlus}
                                            name='plus'
                                            size={28}
                                            color='#900'
                                        />
                                }


                            </TouchableOpacity>
                        </View>

                }

                <Modal
                    animationType={'slide'}
                    visible={this.state.module_visible}>
                    <View style={styles.modalContaner}>

                        <Icon
                            onPress={this._closeModal.bind(this)}
                            style={styles.modalBackIcon}
                            name='ios-add'
                            size={28}
                            color='#900'
                        />

                        <View style={styles.fieldItem}>
                            <Text style={styles.nicknameTips}>昵称</Text>
                            <TextInput
                                placeholder='请输入昵称'
                                style={styles.nicnameInputStyle}
                                defaultValue={user.nickname}
                                onChangeText={(text)=>{

                                    this._changeUserState('nickname',text);
                                }}

                            />
                        </View>

                        <View style={styles.fieldItem}>
                            <Text style={styles.nicknameTips}>爱好</Text>
                            <TextInput
                                placeholder='请输入你的爱好'
                                style={styles.nicnameInputStyle}
                                defaultValue={user.likes}
                                onChangeText={(text)=>{

                                    this._changeUserState('likes',text);
                                }}

                            />
                        </View>

                        <View style={styles.fieldItem}>
                            <Text style={styles.nicknameTips}>年龄</Text>
                            <TextInput
                                placeholder='请输入你的年龄'
                                style={styles.nicnameInputStyle}
                                keyboardType={'numeric'}
                                defaultValue={user.ages}
                                onChangeText={(text)=>{

                                   this._changeUserState('ages',text);

                                }}

                            />
                        </View>

                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>性别</Text>
                            <Icon.Button
                                onPress={() => {
                                  this._changeUserState('gender', 'male')
                                }}
                                style={[
                                  styles.gender,
                                  user.gender === 'male' && styles.genderChecked
                                ]}
                                name='ios-paw'>男</Icon.Button>
                            <Icon.Button
                                onPress={() => {
                                  this._changeUserState('gender', 'female')
                                }}
                                style={[
                                  styles.gender,
                                  user.gender === 'female' && styles.genderChecked
                                ]}
                                name='ios-paw-outline'>女</Icon.Button>
                        </View>


                        <Button
                            style={styles.nicSubmit}
                            onPress={this._nicSubmit.bind(this)}
                        >
                            保存
                        </Button>

                    </View>
                </Modal>
            </View>

        );
    }

    //选择性别
    _changeUserState(key,value){

        let user=this.state.user;
        user[key]=value;

        this.setState({
            user:user
        });
    }

    //提交昵称
    _nicSubmit() {
        let user=this.state.user;

        if (!user.nickname) {
            AlertIOS.alert('昵称不能为空');
            return;
        }
        if (!user.likes) {
            AlertIOS.alert('爱好不能为空');
            return;
        }
        if (!user.ages) {
            AlertIOS.alert('年龄不能为空');
            return;
        }
        if (!user.gender) {
            AlertIOS.alert('性别不能为空');
            return;
        }


        AsyncStorage.setItem('user', JSON.stringify(user));

        this._closeModal();
    }

    //编译按钮
    _editPress() {

        this.setState({
            module_visible: true
        });
    }

    //关闭modal
    _closeModal() {
        this.setState({
            module_visible: false
        });
    }

    _upLoadImage(body) {

        this.setState({
            avararUpLoading: true,
            avatarProgress: 0
        });

        let upUrl = config.cloudinary.imageUpload;

        let request = new XMLHttpRequest();
        request.open('POST', upUrl);

        request.onload = () => {

            if (request.status != 200) {
                AlertIOS.alert('请求失败')
                console.log(request.responseText);
                this._upLoadDown();
                return;
            }
            if (!request.responseText) {
                AlertIOS.alert('请求内容为空');
                this._upLoadDown();
                return;
            }

            let response;
            try {

                response = JSON.parse(request.responseText);
            } catch (e) {
                console.log(e);

            }

            if (response && response.public_id) {

                let user = this.state.user;
                user.icon = this._avatar(response.public_id, 'image');

                this.setState({
                    user: user,
                    avararUpLoading: false,
                    avatarProgress: 0
                });
            } else {
                this._upLoadDown();
            }

        }

        if (request.upload) {

            request.upload.onprogress = (event) => {
                if (event.lengthComputable) {

                    let percent = Number((event.loaded / event.total).toFixed(2));

                    console.log(percent);


                    this.setState({
                        avatarProgress: percent
                    });
                }
            }
        }
        request.send(body);

    }

    //上传结束状态修改
    _upLoadDown() {
        this.setState({
            avararUpLoading: false,
            avatarProgress: 0
        });
    }

    _avatar(id, type) {

        return config.cloudinary.base + '/' + type + '/upload/' + id;
    }

    //点击添加头像
    _addIconPress() {
        this._choosePhoto();
    }

    //点击添加头像
    _choosePhoto() {

        ImagePicker.showImagePicker(photoOptions, (response) => {

            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                let icon = 'data:image/jpeg;base64,' + response.data;
                let user = this.state.user;
                user.icon = icon;

                // this.setState({
                //     user: user
                // });

                //存储user对象
                user = JSON.stringify(user);

                AsyncStorage.setItem('user', user)
                    .then(() => {

                    })
                    .catch((error) => {

                    });

                //上传图片
                let timestamp = Date.now();
                let tags = 'app,avatar';
                let folder = 'avatar';
                let signatureUrl = config.api.base2 + config.api.signature;
                let accessToken = this.state.user.accessToken;

                request.post(signatureUrl, {
                    timestamp: timestamp,
                    type: 'avatar',
                    accessToken: accessToken
                })
                    .then((data) => {
                        if (data && data.success) {

                            let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp='
                                + timestamp + config.cloudinary.api_secret;

                            signature = sha1(signature);


                            let body = new FormData();
                            body.append('folder', folder);
                            body.append('signature', signature);
                            body.append('tags', tags);
                            body.append('timestamp', timestamp);
                            body.append('api_key', config.cloudinary.api_key);
                            body.append('resource_type', 'image');
                            body.append('file', icon);

                            this._upLoadImage(body);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        AlertIOS.alert("图片上传失败")
                    })


            }
        });
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    text: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        alignSelf: 'center'

    },
    photoBox: {
        width: width,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    addIconText: {

        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 14
    },
    addIcon: {
        marginTop: 15,
        alignItems: 'center'
    },
    iconPlus: {
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        color: '#999',
        fontSize: 24,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    iconShowBox: {
        width: width,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    smallIconShow: {
        marginBottom: 15,
        width: width * 0.2,
        height: width * 0.2,
        resizeMode: 'cover',
        borderRadius: width * 0.1
    },
    titleConta: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 10,
        backgroundColor: '#ee735c'

    },
    edit: {
        position: 'absolute',
        right: 10,
        top: 26,
        color: '#fff',
        textAlign: 'right',
        fontWeight: '600',
        fontSize: 14
    },
    modalContaner: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff'
    },
    modalBackIcon: {

        color: '#ee735c',
        alignItems: 'center',
        alignSelf: 'center'
    },
    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    nicknameTips: {
        color: '#ccc'
    },
    nicnameInputStyle: {
        flex: 1,
        height: 50,
        color: '#666',
        fontSize: 14,
        marginLeft: 10,
        textAlignVertical: 'center'
    },
    nicSubmit: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#ee735c',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ee735c'
    },
    gender: {
        backgroundColor: '#ccc'
    },

    genderChecked: {
        backgroundColor: '#ee735c'
    },

});


