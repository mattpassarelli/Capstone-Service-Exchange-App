import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, findNodeHandle, Alert, Modal } from 'react-native';
import { withNavigation } from 'react-navigation'
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view'
import { API_ENDPOINT } from "../Components/api-config"
import { AsyncStorage } from 'react-native';


const apiEndpoint = API_ENDPOINT

/**
 * TODO:
 * Possible forgot password option down the line
 */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: "flex-start",
		alignItems: "center",
	},

	buttonStyle: {
		padding: 10,
		backgroundColor: 'rgb(56, 73, 154)',
		borderRadius: 10,
		width: "80%",
	},

	buttonTextStyle: {
		fontSize: RF(2),
		color: '#ffffff',
		textAlign: 'center'
	},

	textInput: {
		backgroundColor: "rgba(137, 132, 132, 0.1)", height: 40, width: 300, textAlignVertical: "top", fontSize: RF(2),
		borderTopWidth: 1, borderTopColor: "#bfbfbf", borderBottomWidth: 1, borderBottomColor: "#bfbfbf",
		borderLeftColor: "#bfbfbf", borderLeftWidth: 1, borderRightWidth: 1, borderRightColor: "#bfbfbf",
		paddingLeft: 5, textAlignVertical: "center"
	}
});



class Login extends Component {

	_isMounted = false

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			socket: apiEndpoint,
			popupIsOpen: false,
			pinString: "",
		};
	}

	/**
	 * Stores a loginKey to save from having to reenter credentials each time
	 * Also stores, Full name and email for use throughout the app
	 */
	async saveLogin(fullName) {

		try {
			AsyncStorage.setItem('loginKey', 'loginExists')
			AsyncStorage.setItem("fullAccountName", fullName)
			AsyncStorage.setItem("userEmail", this.state.email)
			console.log("Login Key and info Saved")
		}
		catch (error) {
			console.log("ASyncStoreage Error: " + error)
		}
	}

	componentDidMount() {
		this._isMounted = true
		this.state.socket.on("isAccountVerified", (data) => this.checkVerifiedAccount(data))
		this.state.socket.on("loginReturn", (data) => this.processLogin(data))
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	handleEmailTextChange = (email) => {
		if (this._isMounted) {
			this.setState({
				email: email
			})
		}
	}

	handlePasswordTextChange = (pass) => {
		if (this._isMounted) {
			this.setState({
				password: pass
			})
		}
	}

	_scrollToInput(reactNode) {
		// Add a 'scroll' ref to your ScrollView
		this.scroll.props.scrollToFocusedInput(reactNode)
	}

	sendLoginRequest() {

		/** 
		 * Checks for email and password
		 * 
		 * Return function for when server emits callback
		 */

		var data = { email: this.state.email, password: this.state.password }

		this.state.socket.emit("requestLogin", (data))
	}

	processLogin = (data) => {
		console.log("Return Data: " + data.firstName + " " + data.lastName)
		const fullName = data.firstName + " " + data.lastName
		console.log("FULLNAME: " + fullName)

		switch (data.message) {
			case "Login Accepted":
				//Only clear password for any potential security reasons
				//Keep email so we can store it across the the app
				if (this._isMounted) {
					this.setState({
						password: ""
					})
				}

				this.saveLogin(fullName)

				this.props.navigation.navigate("SignedIn")
				break
			case "Wrong Password":
				Alert.alert("Password Incorrect", "Please double check your password")
				break;
			case "Email Not Found":
				Alert.alert("Email Not Found", "Please double check your email")
				break
			case "Account Not Verified":
				Alert.alert("Account Not Verified", "Your account has not been verified yet. Would you like to verify it now?",
					[
						{ text: "No" },
						{ text: "Yes", onPress: () => this.openRequest() }
					])
				break
			default:
				Alert.alert("Oh no. How did this happen? We're smarter than this")
		}
	}

	openRequest = () => {
		if (this._isMounted) {
			this.setState({
				popupIsOpen: true,
			})
		}
	}

	//Closes the Request modal
	closeRequest = () => {
		if (this._isMounted) {
			this.setState({
				popupIsOpen: false,
			})
		}
	}

	handlePinCodeChange = (code) => {
		if (this._isMounted) {
			this.setState({
				pinString: code,
			})
		}
	}

	crossCheckCode = () => {
		var code = parseInt(this.state.pinString)
		var data = { email: this.state.email, pinCode: code }

		if (this.state.pinString.trim().length == 6) {
			this.state.socket.emit("verifyNewAccount", (data))
		}
		else {
			Alert.alert("Verification code must 6 digits. Check your email")
		}
	}

	checkVerifiedAccount = (data) => {

		switch (data) {
			case "Default Messages":
				{
					Alert.alert("An error occured. Please try again")
					break
				}
			case "Verification successful":
				{
					this.closeRequest()
					this.props.navigation.navigate("SignedIn")
					break
				}
			case "Codes do not match":
				{
					Alert.alert("Codes do not match. Please check your email and try again")
					break
				}
			default:
				{
					Alert.alert("Pray this never appears cause I have no idea why it would")
					break
				}
		}
	}

	render() {

		return (
			<React.Fragment>

				{/* Containts the text inputs for 
				email and password for logging in
				to the app. Keyboard aware is used to move the
				screen if the keyboard were to cover any 
				of the inputs*/}
				<KeyboardAwareScrollView
					style={{ flex: 1, }}
					resetScrollToCoords={{ x: 0, y: 0 }}
					contentContainerStyle={styles.container}
					scrollEnabled={false}
					innerRef={ref => {
						this.scroll = ref
					}}
					enableOnAndroid={true}>

					<Image
						style={{ flex: 1, width: 200, height: 200, paddingTop: 125 }}
						resizeMode="contain"
						source={require('../assets/roundedIcon.png')}
					/>




					<TextInput placeholder="Email"
						style={styles.textInput}
						returnKeyType={"next"}
						onSubmitEditing={() => this.passwordInput.focus()}
						blurOnSubmit={true}
						onChangeText={(text) => this.handleEmailTextChange(text)}
						onFocus={(event) => {
							// `bind` the function if you're using ES6 classes
							this._scrollToInput(findNodeHandle(event.target))
						}}
						keyboardType={"email-address"}
						autoCorrect={false}
						autoCapitalize={"none"}
					/>

					<View style={{ paddingTop: 5, paddingBottom: 5 }}></View>


					<TextInput placeholder="Password"
						ref={(input) => { this.passwordInput = input; }}
						style={styles.textInput}
						returnKeyType={"go"}
						onChangeText={(text) => this.handlePasswordTextChange(text)}
						blurOnSubmit={true}
						onFocus={(event) => {
							// `bind` the function if you're using ES6 classes
							this._scrollToInput(findNodeHandle(event.target))
						}}
						secureTextEntry={true}
					/>


					<View style={{ flex: 1, flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "space-between", paddingBottom: 30, paddingTop: 20 }}>
						<CustomButton text="Login" onPress={() => { this.sendLoginRequest() }}
							buttonStyle={styles.buttonStyle}
							textStyle={styles.buttonTextStyle} />

						<Text>

							Don't have an account?
						<Text style={{ color: 'rgb(56, 73, 154)' }} onPress={() => this.props.navigation.navigate("SignUp")}> Click here</Text>

						</Text>

					</View>
				</KeyboardAwareScrollView>


				{/* Modal that we are going to 
				use to verify the user account */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.popupIsOpen}
					onRequestClose={() => {
						this.closeRequest()
					}
					}>
					<View style={[{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						paddingTop: 20,
						backgroundColor: '#ecf0f1',
					}, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
						<View style={{
							backgroundColor: '#fff', padding: 20, height: "30%", width: "80%",
							justifyContent: "space-between", alignItems: "center", borderRadius: 10
						}}>

							<Text style={{ fontSize: RF(2.5) }}>Enter the PIN you got from your email</Text>

							<TextInput
								placeholder="Verification Pin"
								keyboardType="numeric"
								maxLength={6}
								fontSize={RF(3)}
								style={{
									textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#bfbfbf",
									backgroundColor: "rgba(137, 132, 132, 0.1)",
									height: 40, width: "100%", textAlignVertical: "top"
								}}
								onChangeText={(code) => this.handlePinCodeChange(code)}
							/>

							<CustomButton
								text="Verify Account"
								onPress={() => this.crossCheckCode()}
								buttonStyle={styles.buttonStyle}
								textStyle={styles.buttonTextStyle}
							/>
						</View>
					</View>
				</Modal>
			</React.Fragment>
		);
	}
}

export default withNavigation(Login)
