import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Edit extends Component{


	render(){

		return(
			<View style={styles.contaner}>

				<Text style={styles.text}>edit</Text>

			</View>

		);
	}

}

const styles=StyleSheet.create({

	contaner:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},

	text:{
		textAlign:'center'
	},

});


