//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
// import { createStackNavigator } from 'react-navigation'
// import Notifications from './Notifications'

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

// const StackNavigator = createStackNavigator({
// 	Notifications: Notifications
// })

// create a component
class Account extends Component {
	render() {
		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={ScrollStyle.container}>
					<Text>Hello Account</Text>
				</ScrollView>
			</View>
		)
	}
}

//make this component available to the app
export default Account;
