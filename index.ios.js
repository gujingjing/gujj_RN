/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TabBarIOS,
    Navigator,
    AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import List from './app/list/index';
import Edit from './app/edit/index';
import Account from './app/account/index';
import Login from './app/account/login';


var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';


export default class gujj_RN1 extends Component {


    statics: {
        title: '<TabBarIOS>',
        description: 'Tab-based navigation.',
    }

    constructor(props) {

        super(props);
        this.state = {

            selectedTab: 'list',
            notifCount: 0,
            logined: false

        };

    }

    //登陆获取用户信息
    componentDidMount() {
        AsyncStorage.getItem('user')
            .then((data) => {
                let user;
                let newState = {};

                if (data) {
                    user = JSON.parse(data);
                }
                if (user && user.accessToken) {

                    newState.user = user;
                    newState.logined = true;
                } else {
                    newState.logined = false;
                }
                this.setState(newState);

            })
            .catch((error) => {

                console.log(error);

                this.setState({
                    logined: false
                });
            });

    }

    //登陆成功之后
    _afterLogin(user){

        //存储user对象
        user=JSON.stringify(user);

        AsyncStorage.setItem('user',user)
            .then(()=>{
                this.setState({
                    user:user,
                    logined:true
                });
            })
            .catch((error)=>{
                if(this.state.logined){
                    this.setState({
                        logined:false
                    });
                }
            });


    }


    render() {

        if(!this.state.logined){
            return(
                <Login  afterLogin={this._afterLogin.bind(this)}/>
            );
        }
        return (

            <TabBarIOS
                tintColor="#ee735c">

                <Icon.TabBarItem
                    title="list"
                    iconName='ios-videocam-outline'
                    selectedIconName='ios-videocam'
                    selected={this.state.selectedTab === 'list'}
                    onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
                    <Navigator
                        initialRoute={{
                    name:'list',
                    component:List
                }}
                        configureScene={(route) => {
                    return Navigator.SceneConfigs.FloatFromRight;

                }}
                        renderScene={(route,navigator) => {
                    let Component =route.component;

                    return <Component {... route.params} navigator={navigator}

                    />
                }}
                    />
                    {/*<List />*/}

                </Icon.TabBarItem>


                <Icon.TabBarItem
                    title='edit'
                    iconName='ios-recording-outline'
                    selectedIconName='ios-recording'
                    selected={this.state.selectedTab === 'edit'}
                    onPress={() => {
            this.setState({
              selectedTab: 'edit',
              notifCount: this.state.notifCount + 1,
            });
          }}>
                    <Edit />

                </Icon.TabBarItem>

                <Icon.TabBarItem
                    iconName='ios-more-outline'
                    selectedIconName='ios-more'
                    title="account"
                    selected={this.state.selectedTab === 'account'}
                    onPress={() => {
            this.setState({
              selectedTab: 'account'
            });
          }}>
                    <Account />

                </Icon.TabBarItem>
            </TabBarIOS>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});

AppRegistry.registerComponent('gujj_RN1', () => gujj_RN1);
