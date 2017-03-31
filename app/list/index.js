import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import request from '../common/request';
import config from '../common/config';
import ListItem from './item_row';
import Detail from './detail';


const {height, width} = Dimensions.get('window');


var cacheResults={
	page:1,
	items:[],
	total:0
}

export default class List extends Component{


	constructor(props) {

	  super(props);
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

	  this.state = {
	    dataSource: ds.cloneWithRows([]),
		 up:false ,
		 isRefreshing:false,
         isTopRefreshing:false,
		 page:1

	  };
}

	_itemShow(rowData){

        return(
            <ListItem
                key={rowData.id}
                onSelect={()=> this._onpageSelected(rowData)}
                row={rowData}/>
        );


	}

	componentDidMount(){
		this._fetchData(1);
	}

    _onpageSelected(rowData){
	    this.props.navigator.push({
	        name:'detail',
            component:Detail,
            params:{
	            row:rowData
            }
        });
    }

	//初始化请求参数
	_fetchData(page){

	    var that=this;

	    if(page!==1){

            this.setState({
                isRefreshing:true
            });
        }else{
            this.setState({
                isTopRefreshing:true
            });
        }


		request.get(config.api.base+config.api.creations,{
			accessToken:'abcd',
			page: cacheResults.page
		})
	      .then((data) => {

	      	if(data.success){

	      		var items=cacheResults.items;

	      		if(page!==1){

                    items=items.concat(data.data);
                }else{

                    items.splice(0,items.length);
                    items=items.concat(data.data);

                    // items=data.data.concat(items);
                }

	      		cacheResults.items=items;

	      		console.log('cacheResults==='+cacheResults.items.length);
                console.log('items==='+items.length);

	      		cacheResults.total=data.total;

                that.setState({
	      			isRefreshing:false,
                    isTopRefreshing:false,
	      			dataSource:this.state.dataSource.cloneWithRows(cacheResults.items)
	      		});
	      	}

	      	console.log(data)
	      })
	      .catch((error) => {
              that.setstate({
	      		isRefreshing:false,
                isTopRefreshing:false

	      	});
	        console.error(error);
	      });
	}

	render(){

		return(
			<View style={styles.contaner}>
				<View style={styles.header}>
		          <Text style={styles.headerTitle}>列表页面</Text>
		        </View>

				<ListView
			      dataSource={this.state.dataSource}
			      renderRow={this._itemShow.bind(this)}
			      renderFooter={this._renderFooter.bind(this)}
			      onEndReachedThreshold={20}
			      enableEmptySections={true}
			      showsVerticalScrollIndicator={false}
          		  automaticallyAdjustContentInsets={false}
			      onEndReached={this._fetchMoreData.bind(this)}
                  refreshControl={
                      <RefreshControl
                        refreshing={this.state.isTopRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#ff6600"
                        title="拼命加载中..."
                      />
                    }
			    />

			</View>

		);
	}

    _onRefresh(){

        cacheResults.page=1;

	    //没有更多或者在刷新状态的时候不刷新
	    if(this.state.isTopRefreshing){
            return;
        }

        this._fetchData(cacheResults.page);
    }

	_haseMore(){
		return cacheResults.items.length!=cacheResults.total;
	}

	_renderFooter(){

	    //没有更多了,刚开始，total为0
		if(!this._haseMore()&&cacheResults.total!==0){
            return (
                <View style={styles.loading_more}>
                    <Text style={styles.loading_text}>没有更多了</Text>
                </View>
            );
        }
        //如果状态不是在刷新，返回空
        if(!this.state.isRefreshing){
		    return(
                <View />
            );
        }
        return (
            <ActivityIndicator
                style={styles.loading_more}
            />
        );

	}
	_fetchMoreData(){
        //page加1
	    cacheResults.page+=1;

		let lengthAll=cacheResults.items.length;
    	console.log('lengthAll'+lengthAll);

	    let totalLength=cacheResults.total;
	    console.log('total'+totalLength);

		if(!this._haseMore()||this.state.isRefreshing){

			return;
		}

		this._fetchData(cacheResults.page);
	}

}

const styles=StyleSheet.create({

	contaner:{
		flex:1,
	},
	header:{
		paddingTop:25,
		paddingBottom:12,
		backgroundColor: '#ee735c'
	},
	headerTitle:{
		textAlign:'center',
		color:'#fff',
		backgroundColor:'#ee735c',
		fontWeight:'600'
	},
	text:{
		textAlign:'center'
	},

    loading_more:{
        marginVertical:20
    },
    loading_text:{
	    color:'#777',
        textAlign:'center'
    }

});


