import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Account extends Component{


	render(){

		return(
			<View style={styles.container}>

				<Text style={styles.text}>account</Text>

			</View>

		);
	}

}


const styles=StyleSheet.create({

	container:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},

	text:{
		textAlign:'center'
	},

});


