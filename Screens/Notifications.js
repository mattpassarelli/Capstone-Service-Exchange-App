//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Modal, RefreshControl, Alert } from 'react-native';
import { Card } from "react-native-elements"
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from '../Components/api-config';
import RF from "react-native-responsive-fontsize"
import CustomButton from "../Components/CustomButton"

const apiEndpoint = API_ENDPOINT

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	buttonStyle: {
		padding: 10,
		backgroundColor: '#202646',
		borderRadius: 10,
		width: "20%",
	},

	buttonTextStyle: {
		fontSize: RF(2),
		color: '#ffffff',
		textAlign: 'center'
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
			notifications: [],
			popupIsOpen: false,
			fulFiller_Name: "",
			fulFiller_Email: "",
			request_ID: "",
			requestType: "",
			refreshing: false,
		}
	}
	componentDidMount() {

		this.userFullName()
		this.userEmail()
		this.state.socket.on("receiveNotifications", (data) => { this.setState({ notificationJSON: data }), this.addNotifications() })
	}

	/**
	* Method is called when refreshControl is activated
	* Meaning that whenever you pull down to refresh, this 
	* is what is called
	*/
	refreshFeed = () => {
		console.log("Refreshing requestsDataJSON")

        /**
         * Clear requests (in case they've all been deleted lol),
         * Then pull in all of the requests again
         */
		this.setState({
			refreshing: true
		})

		this.state.socket.emit("pullNotifications", (this.state.email))

		console.log("Data received from server is: " + this.state.requestsDataJSON)

		console.log("Done Refreshing JSON")
		this.addNotifications()
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

	/**
	 * Called when the server sends the emit signal with Notification data
	 * Parses the data as a JSON and adds the notifications to the state array
	 * as Cards (possibly temporary)
	 */
	addNotifications = () => {
		console.log("Recevied notification data: " + JSON.stringify(this.state.notificationJSON, null, 2))

		this.setState({
			notifications: []
		})

		if (this.state.notificationJSON.length > 0) {

			var tempNotifications = []

			for (var i = 0; i < this.state.notificationJSON.length; i++) {

				var title = this.state.notificationJSON[i].fulFiller_Name + " has offered to help you with your request: " + this.state.notificationJSON[i].requestTitle
				console.log("Request_ID: " + this.state.notificationJSON[i].request_ID)
				var newCard = (
					<Card title={title} 
					fulFiller_Email={this.state.notificationJSON[i].fulFiller_Email}
					 fulFiller_Name={this.state.notificationJSON[i].fulFiller_Name}
					 request_ID={this.state.notificationJSON[i].request_ID}
					 requestType={this.state.notificationJSON[i].requestTitle}
					 ></Card>
				)

				tempNotifications.push(newCard)
			}

			//flip the array so the latest Notifications are at the top
			tempNotifications.reverse()

			this.setState({
				notifications: tempNotifications,
				refreshing: false
			})
		}
	}

	openRequest = (item) => {
		console.log(item.props.title)
		console.log(item.props.fulFiller_Email)
		console.log(item.props.fulFiller_Name)
		console.log(item.props.request_ID)
		console.log(item.props.requestType)
		this.setState({
			fulFiller_Name: item.props.fulFiller_Name,
			fulFiller_Email: item.props.fulFiller_Email,
			request_ID: item.props.request_ID,
			requestType: item.props.requestType,
			popupIsOpen: true
		})
	}

	closeRequest() {
		this.setState({
			popupIsOpen: false,
		})
	}


	createConversation() {
		console.log("Attempting to create conversation between: " + this.state.email + " and " + this.state.fulFiller_Email)

		var data = { user1: this.state.email, user1Name: this.state.fullName,
			 user2: this.state.fulFiller_Email, user2Name: this.state.fulFiller_Name,
			  request_ID: this.state.request_ID, requestType: this.state.requestType}

		this.state.socket.emit("createConversation", (data))
		this.state.socket.on("convoReturn", (data) => this.convoReturn(data))
	}

	convoReturn(data){
		console.log("Convo Return: " + data)
		if(data)
		{
			Alert.alert("Conversation already Exists", "A conversation about this request already exists")
		}
		else{
			this.closeRequest()
		}
	}

	render() {
		return (
			<React.Fragment>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ScrollView refreshControl={
						<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
					}>
						{
							this.state.notifications.map((item, key) => {
								return (
									<TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
										<Card key={key}>
											<View>
												{/* //TODO: Work out Time difference math */}
												<Text>{item.props.title}</Text>
												<Text style={{ position: "absolute", right: 0, bottom: 0, fontSize: RF(1.2) }}>Time diff here</Text>
											</View>
										</Card>
									</TouchableOpacity>
								)
							})
						}
					</ScrollView>
				</View>

				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.popupIsOpen}
					onRequestClose={() => {
						this.closeRequest()
					}}>
					<View style={[{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						paddingTop: 20,
						backgroundColor: '#ecf0f1',
					}, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
						<View style={{
							backgroundColor: '#fff', padding: 20, height: "40%",
							width: "80%", borderRadius: 10, justifyContent: "space-between"
						}}>
							<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
								<Text style={{ fontWeight: "bold", fontSize: RF(3), textAlign: "center", padding: 3 }}>Connect with {this.state.fulFiller_Name} about your request?</Text>
								<Text style={{ fontSize: RF(2), textAlign: "center" }}>This will create a new coversation</Text>
							</View>


							<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
								<CustomButton text="No"
									onPress={() => this.closeRequest()}
									buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />

								<CustomButton text="Yes"
									onPress={() => this.createConversation()}
									buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />
							</View>
						</View>
					</View>
				</Modal>
			</React.Fragment>
		)
	}
}



//make this component available to the app
export default Notifications;
