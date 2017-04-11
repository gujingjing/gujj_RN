'use strict'

module.exports = {

    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    },
    api: {
        base: 'http://rap.taobao.org/mockjs/15310/',
        base2: 'http://rapapi.org/mockjs/16811/',
        creations: 'api/creations',
        up: 'api/up',//点赞
        component: 'api/component',//评论
        note: 'api/note',//留言
        sinCode: 'api/usersignup',//验证码
        login: 'api/login',//登陆
        signature:'api/signature'//获取图片验证码签名

    },
    cloudinary: {
        cloud_name: 'sanjiren',
        api_key: '724273847572731',
        api_secret: 'fkMeZzUae6HITkl3HVUK3b22Z2k',
        base:'http://res.cloudinary.com/sanjiren',
        imageUpload:'https://api.cloudinary.com/v1_1/sanjiren/image/upload',
        videoUpload:'https://api.cloudinary.com/v1_1/sanjiren/video/upload',
        audio:'https://api.cloudinary.com/v1_1/sanjiren/raw/upload',

    }


}