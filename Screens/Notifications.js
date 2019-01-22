//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import {createStackNavigator} from 'react-navigation'


// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

const ScrollStyle = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})



class Notifications extends React.Component {
	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Here will lie notifications!</Text>
			</View>
		)
	}
}



//make this component available to the app
export default Notifications;
