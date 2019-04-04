import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, findNodeHandle, Alert, Modal, AsyncStorage, Platform } from 'react-native';
import { withNavigation } from 'react-navigation'
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view'
import { API_ENDPOINT } from "../Components/api-config"
import { CheckBox } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

const apiEndpoint = API_ENDPOINT

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

class RegisterAccount extends Component {

	_isMounted = false

	constructor(props) {
		super(props);

		this.state = {
			socket: apiEndpoint,
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirm: "",
			popupIsOpen: false,
			pinString: "",
			pinCode: 0,
			tosAgreed: false,
			socket: apiEndpoint,
			expoToken: "",
		};
	}

	componentDidMount() {
		this._isMounted = true
		this.state.socket.on("isAccountVerified", (data) => this.checkVerifiedAccount(data))
		this.state.socket.on("creationReturn", (data) => this.creationReturnData(data))
		this.getExpoTokenFromStorage()
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	async getExpoTokenFromStorage() {
		try {
			await AsyncStorage.getItem("expoToken").then((value) => {
				console.log("Expo Token found: " + value)
				if (value !== null) {
					console.log("expoToken found from app launch. Saving for use")
					if (this._isMounted) {
						this.setState({
							expoToken: value
						})
					}
					//console.log("Expo State: " + this.state.expoToken)
				}
				else {
					console.log("No expo Token found. Will attempt again on relaunch")
				}
			})
		}
		catch (error) {
			console.error(error)
		}
	}

	handleFirstNameChange = (first) => {
		if (this._isMounted) {
			this.setState({
				firstName: first
			})
		}
	}

	handleLastNameChange = (last) => {
		if (this._isMounted) {
			this.setState({
				lastName: last
			})
		}
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

	handlePasswordConfirmChange = (confirm) => {
		if (this._isMounted) {
			this.setState({
				passwordConfirm: confirm
			})
		}
	}

	//Checks against various needed conditions and if all match, create account
	createAccount() {

		var fieldsAreNotEmpty = this.checkFieldsForCompleteness()
		var emailHasAtSign = this.checkEmailForAtSign()
		var emailEndsInEDU = this.checkEmailForEDU()
		var passwordsMatch = this.checkPasswordsMatch()
		var emailHasNoPlus = this.checkEmailForPlus()
		var emailHasNoSpaces = this.checkEmailForSpaces()

		console.log("Completeness " + fieldsAreNotEmpty)
		console.log("Email Has @: " + emailHasAtSign)
		console.log("Email ends in EDU: " + emailEndsInEDU)
		console.log("Do passwords match? " + passwordsMatch)
		console.log("Does email have a space?" + emailHasNoSpaces)
		console.log("Does email have a + ?" + emailHasNoPlus)

		if (!fieldsAreNotEmpty) { Alert.alert("Fill in all fields") }
		if (!emailHasAtSign) { Alert.alert("Make sure your email contains an @") }
		if (!emailEndsInEDU) { Alert.alert("Your email must end in 'edu'") }
		if (!passwordsMatch) { Alert.alert("Your passwords do not match") }
		if (!this.state.tosAgreed) { Alert.alert("Please accept the Terms of Service") }
		if (emailHasNoSpaces) { Alert.alert("Your email cannot have spaces") }
		if (!emailHasNoPlus) { Alert.alert("You cannot use an email with a \"+\"" + " in it. Please try again.") }


		if (fieldsAreNotEmpty && emailHasAtSign && emailEndsInEDU && passwordsMatch && this.state.tosAgreed && !emailHasNoSpaces
			&& emailHasNoPlus) {
			var data = {
				firstName: this.state.firstName, lastName: this.state.lastName,
				email: this.state.email, password: this.state.password,
				expoNotificationToken: this.state.expoToken
			}

			console.log("Submitting new user AND Expo Token" + this.state.expoToken)
			this.state.socket.emit("newUserRegistration", (data))
		}
	}

	creationReturnData = (data) => {
		console.log(data)
		switch (data) {
			case "Email Already Used":
				Alert.alert("There is already an account with this email")
				break;
			case "Email Not Used":
				this.openRequest()
				break;
			case "Error with Email":
				Alert.alert("Oof. Aah.", "There was an error validating your email. Please try again.")
				break;
			default:
				console.log("Oh No")
				break;
		}
	}

	//Checks all fields for for lengths > 0
	checkFieldsForCompleteness() {
		if (this.state.firstName.trim() == "" ||
			this.state.lastName.trim() == "" ||
			this.state.email.trim() == "" ||
			this.state.password.trim() == "" ||
			this.state.passwordConfirm.trim() == "") {
			return false;
		}
		return true
	}

	//Make sure the email has a proper @ in it
	checkEmailForAtSign() {
		if (!this.state.email.includes("@")) {
			return false
		}
		return true
	}

	/**
	 * We need to make sure the emails
	 * do not contain any spaces or "+"
	 * signs to thwart any duplication
	 * accounts
	 */
	checkEmailForPlus() {
		if (this.state.email.includes("+")) {
			return false
		}
		else {
			return true
		}
	}

	checkEmailForSpaces() {
		return /\s/g.test(this.state.email);
	}

	//We check to make sure the email ends in EDU since it's the only way
	//I can verify they are a current student
	checkEmailForEDU() {
		var res = this.state.email.substring(this.state.email.length - 3, this.state.email.length)

		if (res === "edu") {
			return true;
		}
		return false;
	}

	//Make sure passwords match
	checkPasswordsMatch() {
		if (this.state.password === this.state.passwordConfirm) {
			return true
		}
		else {
			return false
		}
	}

	_scrollToInput(reactNode) {
		// Add a 'scroll' ref to your ScrollView
		this.scroll.props.scrollToFocusedInput(reactNode)
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
					this.props.navigation.navigate("SignIn")
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

	handleTOSChange() {
		if (this._isMounted) {
			this.setState({
				tosAgreed: !this.state.tosAgreed
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

	render() {
		return (
			<React.Fragment>

				<KeyboardAwareScrollView
					style={{ flex: 1 }}
					enableOnAndroid={true}
					enableAutomaticScroll={(Platform.OS === 'ios' ? true : false)}
					innerRef={ref => {
						this.scroll = ref
					}}>


					<ScrollView style={{ flex: 1, paddingTop: 125 }}
						contentContainerStyle={styles.container}
					>
						<TextInput placeholder="First Name"
							style={styles.textInput}
							ref={(input) => { this.firstNameInput = input }}
							returnKeyType={"next"}
							onSubmitEditing={() => this.firstLastInput.focus()}
							blurOnSubmit={true}
							onChangeText={(text) => this.handleFirstNameChange(text)}
							onFocus={(event) => {
								// `bind` the function if you're using ES6 classes
								this._scrollToInput(findNodeHandle(event.target))
							}}
							autoCorrect={false}
							autoCapitalize="words"
						/>

						<View style={{ paddingTop: 5, paddingBottom: 5 }}></View>

						<TextInput placeholder="Last Name"
							style={styles.textInput}
							ref={(input) => { this.firstLastInput = input }}
							returnKeyType={"next"}
							onSubmitEditing={() => this.emailInput.focus()}
							blurOnSubmit={true}
							onChangeText={(text) => this.handleLastNameChange(text)}
							onFocus={(event) => {
								// `bind` the function if you're using ES6 classes
								this._scrollToInput(findNodeHandle(event.target))
							}}
							autoCorrect={false}
							autoCapitalize="words"
						/>

						<View style={{ paddingTop: 5, paddingBottom: 5 }}></View>

						<TextInput placeholder="Email Ending In edu"
							style={styles.textInput}
							ref={(input) => { this.emailInput = input }}
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
							returnKeyType={"next"}
							onChangeText={(text) => this.handlePasswordTextChange(text)}
							blurOnSubmit={true}
							onSubmitEditing={() => this.passwordConfirmInput.focus()}
							onFocus={(event) => {
								// `bind` the function if you're using ES6 classes
								this._scrollToInput(findNodeHandle(event.target))
							}}
							secureTextEntry={true}
						/>

						<View style={{ paddingTop: 5, paddingBottom: 5 }}></View>

						<TextInput placeholder="Confirm Password"
							ref={(input) => { this.passwordConfirmInput = input; }}
							style={styles.textInput}
							returnKeyType={"go"}
							onChangeText={(text) => this.handlePasswordConfirmChange(text)}
							blurOnSubmit={true}
							onFocus={(event) => {
								// `bind` the function if you're using ES6 classes
								this._scrollToInput(findNodeHandle(event.target))
							}}
							secureTextEntry={true}
						/>

						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
							<CheckBox
								checkedIcon='dot-circle-o'
								uncheckedIcon='circle-o'
								checked={this.state.tosAgreed}
								containerStyle={{ backgroundColor: "transparent" }}
								onPress={() => this.handleTOSChange()}
							/>
							<Text style={{ fontSize: RF(2), color: '#00F' }} onPress={() => this.props.navigation.navigate("TOS")}>Accept Terms of Serivce</Text>
						</View>

						<View style={{ flex: 1, flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "space-between", paddingBottom: 30, paddingTop: 20 }}>
							<CustomButton text="Create Account" onPress={() => { this.createAccount() }}
								buttonStyle={styles.buttonStyle}
								textStyle={styles.buttonTextStyle} />


						</View>
					</ScrollView>

				</KeyboardAwareScrollView>


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
							backgroundColor: '#fff', padding: 20, height: "40%", width: "80%",
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

export default withNavigation(RegisterAccount)
