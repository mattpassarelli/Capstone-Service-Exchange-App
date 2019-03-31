//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { AsyncStorage } from 'react-native';


// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	buttonStyle: {
		padding: 10,
		backgroundColor: '#202646',
		borderRadius: 10,
		width: "80%",
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

// create a component
class Account extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			fullName: "",
			email: "",
		}
	}

	componentDidMount() {
		this.userFullName()
		this.userEmail()
	}

	//Grab the full name from the phone's storage
	async userFullName() {
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
	async userEmail() {
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

	//Wipe the loginkey, and user email, and name from the phone's storage
	//then redirect to the login screen
	logout = async (navigation) => {
		try {
			await AsyncStorage.removeItem("loginKey")
			await AsyncStorage.removeItem("userEmail")
			await AsyncStorage.removeItem("fullAccountName")
			await AsyncStorage.removeItem("expoToken")
			console.log("Login information Removed")
			navigation.navigate("SignedOut")
		}
		catch (error) {
			console.log(error)
		}
	}

	render() {

		return (
			<ScrollView contentContainerStyle={ScrollStyle.container}>
				<View style={{
					flex: .3, flexDirection: "row", justifyContent: "space-between", width: "100%", padding: 10,
					position: "absolute", top: 10, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "rgb(202, 202, 206)",
					borderBottomColor: "rgb(202, 202, 206)", backgroundColor: "rgb(255,255,255)"
				}}>
					<View>
						<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate("")}>
							<Text style={{ fontSize: RF(2.5), fontWeight: "bold" }}>{this.state.fullName}</Text>
							<Text style={{ fontSize: RF(2) }}>{this.state.email}</Text>
						</TouchableOpacity>
					</View>

					<View style={{ justifyContent: "center" }}>
						<TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Confirm Logout", "Are you sure you want to logout?",
							[
								{ text: "No" },
								{ text: "Yes", onPress: () => this.logout(this.props.navigation) }
							])}>
							<Text style={{ fontSize: RF(2), color: 'rgb(56, 73, 154)' }}>Logout</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={{ flex: .7, flexDirection: "column", width: "100%", top: 20 }}>

					<View style={{
						backgroundColor: "rgb(255,255,255)", borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "rgb(202, 202, 206)",
						borderBottomColor: "rgb(202, 202, 206)", padding: 10
					}}>

						<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate("PersonalRequests")}>
							<Text style={{ fontSize: RF(2.5) }}>Your Requests</Text>
						</TouchableOpacity>

					</View>

					<View style={{
						backgroundColor: "rgb(255,255,255)", borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "rgb(202, 202, 206)",
						borderBottomColor: "rgb(202, 202, 206)", padding: 10
					}}>

						<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Settings')}>
							<Text style={{ fontSize: RF(2.5) }}>Settings</Text>
						</TouchableOpacity>

					</View>

					<View style={{
						backgroundColor: "rgb(255,255,255)", borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "rgb(202, 202, 206)",
						borderBottomColor: "rgb(202, 202, 206)", padding: 10
					}}>

						<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Help')}>
							<Text style={{ fontSize: RF(2.5) }}>Help</Text>
						</TouchableOpacity>

					</View>
				</View>

			</ScrollView>
		)
	}
}

export default Account

