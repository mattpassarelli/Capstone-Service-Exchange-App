//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import {createStackNavigator} from 'react-navigation'
import {AsyncStorage} from "react-native"
import { API_ENDPOINT } from '../Components/api-config';

const apiEndpoint = API_ENDPOINT


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

	constructor(props){
		super(props)

		this.state = {
			fullName: "",
			email:"",
			socket: apiEndpoint,
		}
	}
	componentDidMount(){
		this.userFullName()
		this.userEmail()
		this.state.socket.on("newFulfillerNotification", (data) => this.addNotification(data))
	}

	//Grab the full name from the phone's storage
	userFullName = async () => {
		try {
			await AsyncStorage.getItem("fullAccountName").then(async (value) => {
				console.log("Name: " + value)
				this.setState({
					fullName: value
				})
			})
		}
		catch (error) {
			console.log(error)
		}
	}

	//grab user email from phone storage
	userEmail = async () => {
		try {
			await AsyncStorage.getItem("userEmail").then((value) => {
				console.log("Email:" + value)
				this.setState({
					email: value
				})
			})
		}
		catch (error) {
			console.log(error)
		}
	}
	
	addNotification = (data) => {
		console.log("Recevied notification data: " + data)
	}

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
