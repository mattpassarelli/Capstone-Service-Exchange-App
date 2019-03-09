//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
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

	/**
	 * TODO: 
	 * Copy these methods to every other class that requires it
	 */

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

	//Wipe the loginkey, and user email, and name from the phone's storage
	//then redirect to the login screen
	logout = async (navigation) => {
		try {
			await AsyncStorage.removeItem("loginKey")
			await AsyncStorage.removeItem("userEmail")
			await AsyncStorage.removeItem("fullAccountName")
			console.log("Login information Removed")
			navigation.navigate("SignedOut")
		}
		catch (error) {
			console.log(error)
		}
	}

	render() {

		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={ScrollStyle.container}>
					<Text>{this.state.fullName}</Text>
					<Text>{this.state.email}</Text>
					<CustomButton text="Logout" onPress={() => Alert.alert("Confirm Logout", "Are you sure you want to logout?",
					[
						{text: "No"},
						{text: "Yes", onPress: () => this.logout(this.props.navigation)}
					])}
						buttonStyle={styles.buttonStyle}
						textStyle={styles.buttonTextStyle} />
					<Button 
					title="View Your Requests"
					onPress={() => this.props.navigation.navigate("PersonalRequests")}/>
				</ScrollView>
			</View>
		)
	}
}

export default Account

