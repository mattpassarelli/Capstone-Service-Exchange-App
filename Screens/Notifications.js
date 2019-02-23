//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Modal } from 'react-native';
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
					<Card title={title} fulFiller_Email={this.state.notificationJSON[i].fulFiller_Email} fulFiller_Name={this.state.notificationJSON[i].fulFiller_Name}></Card>
				)

				tempNotifications.push(newCard)
			}

			this.setState({
				notifications: tempNotifications
			})
		}
	}

	openRequest = (item) => {
		console.log(item.props.title)
		console.log(item.props.fulFiller_Email)
		console.log(item.props.fulFiller_Name)
		this.setState({
			fulFiller_Name: item.props.fulFiller_Name,
			popupIsOpen: true
		})
	}

	closeRequest() {
		this.setState({
			popupIsOpen: false,
		})
	}

	render() {
		return (
			<React.Fragment>
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


							<View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
							<CustomButton text="No"
								onPress={() => this.closeRequest()}
									buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />

								<CustomButton text="Yes"
								onPress={() => this.closeRequest()}
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
