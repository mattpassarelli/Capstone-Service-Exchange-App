//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { Card } from "react-native-elements"
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from '../Components/api-config';
import RF from "react-native-responsive-fontsize"

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

	constructor(props) {
		super(props)

		this.state = {
			fullName: "",
			email: "",
			socket: apiEndpoint,
			notificationJSON: "",
			notifications: []
		}
	}
	componentDidMount() {

		this.userFullName()
		this.userEmail()
		this.state.socket.on("receiveNotifications", (data) => { this.setState({ notificationJSON: data }), this.addNotifications() })
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
				/**
				 * Since I can't come up with a decent way of storing these
				 * values in state before the socket emits, we'll just emit
				 * in the call back. I hope to fix this later on
				 * 
				 * TODO: Store account data in a constant file hopefully
				 */
				this.state.socket.emit("pullNotifications", (value))
			})
		}
		catch (error) {
			console.log(error)
		}
	}

	addNotifications = () => {
		console.log("Recevied notification data: " + JSON.stringify(this.state.notificationJSON, null, 2))

		this.setState({
			notifications: []
		})

		if (this.state.notificationJSON.length > 0) {

			var tempNotifications = []

			for (var i = 0; i < this.state.notificationJSON.length; i++) {

				var title = this.state.notificationJSON[i].fulFiller_Name + " has offered to help you with your request: " + this.state.notificationJSON[i].requestTitle

				var newCard = (
					<Card title={title} fulFiller_Email={this.state.notificationJSON[i].fulFiller_Email}></Card>
				)

				tempNotifications.push(newCard)
			}

			this.setState({
				notifications: tempNotifications
			})
		}
	}

	openRequest = (item) =>{
		console.log(item.props.title)
		console.log(item.props.fulFiller_Email)
	}

	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ScrollView>
					{
						this.state.notifications.map((item, key) => {
							return (
								<TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
									<Card key={key}>
										<View>
											{/* //TODO: Work out Time difference math */}
											<Text>{item.props.title}</Text>
											<Text style={{position: "absolute", right: 0, bottom: 0, fontSize: RF(1.2)}}>Time diff here</Text>
										</View>
									</Card>
								</TouchableOpacity>
							)
						})
					}
				</ScrollView>
			</View>
		)
	}
}



//make this component available to the app
export default Notifications;
