import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, findNodeHandle, Alert } from 'react-native';
import { withNavigation } from 'react-navigation'
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view'
import { API_ENDPOINT } from "../Components/api-config"


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
		backgroundColor: '#202646',
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
	constructor(props) {
		super(props);

		this.state = {
			socket: apiEndpoint,
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			password: "",
			passwordConfirm: "",
		};
	}

	handleFirstNameChange = (first) => {
		this.setState({
			firstName: first
		})
	}

	handleLastNameChange = (last) => {
		this.setState({
			lastName: last
		})
	}

	handleEmailTextChange = (email) => {
		this.setState({
			email: email
		})
	}

	handlePhoneNumberChange = (phone) => {
		this.setState({
			phoneNumber: phone
		})
	}

	handlePasswordTextChange = (pass) => {
		this.setState({
			password: pass
		})
	}

	handlePasswordConfirmChange = (confirm) => {
		this.setState({
			passwordConfirm: confirm
		})
	}

	//Checks against various needed conditions and if all match, create account
	createAccount() {

		var fieldsAreNotEmpty = this.checkFieldsForCompleteness()
		var emailHasAtSign = this.checkEmailForAtSign()
		var emailEndsInEDU = this.checkEmailForEDU()
		var phoneNumberLengthIs10 = this.checkPhoneNumberLength()
		var passwordsMatch = this.checkPasswordsMatch()

		console.log("Completeness " + fieldsAreNotEmpty)
		console.log("Email Has @: " + emailHasAtSign)
		console.log("Email ends in EDU: " + emailEndsInEDU)
		console.log("Is Phone number 10 digits? " + phoneNumberLengthIs10)
		console.log("Do passwords match? " + passwordsMatch)

		if (!fieldsAreNotEmpty) { Alert.alert("Fill in all fields") }
		if (!emailHasAtSign) { Alert.alert("Make sure your email contains an @") }
		if (!emailEndsInEDU) { Alert.alert("Your email must end in 'edu'") }
		if (!phoneNumberLengthIs10) { Alert.alert("Make sure the phone number is 10 digits, with no hypens") }
		if (!passwordsMatch) { Alert.alert("Your passwords do not match") }


		if (fieldsAreNotEmpty && emailHasAtSign && emailEndsInEDU && phoneNumberLengthIs10 && passwordsMatch) {
			Alert.alert("Check your email for the verification email and then come back and login")
			//TODO: send data to server backend
			var data= {firstName: this.state.firstName, lastName: this.state.lastName, 
				email: this.state.email, phoneNumber: this.state.phoneNumber, password: this.state.password}
			this.state.socket.emit("newUserRegistration", (data))

			//this.props.navigation.navigate("SignIn")	
			}
	}

	//Checks all fields for for lengths > 0
	checkFieldsForCompleteness() {
		if (this.state.firstName.trim() == "" ||
			this.state.lastName.trim() == "" ||
			this.state.email.trim() == "" ||
			this.state.phoneNumber.trim() == "" ||
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

	//We check to make sure the email ends in EDU since it's the only way
	//I can verify they are a current student
	checkEmailForEDU() {
		var res = this.state.email.substring(this.state.email.length - 3, this.state.email.length)

		if (res === "edu") {
			return true;
		}
		return false;
	}

	//Make sure the phone number they entered is 10 digits
	checkPhoneNumberLength() {
		if (this.state.phoneNumber.trim().length == 10) {
			return true
		}
		return false

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

	render() {

		return (

			<KeyboardAwareScrollView
				style={{ flex: 1, paddingTop: 125 }}
				resetScrollToCoords={{ x: 0, y: 0 }}
				contentContainerStyle={styles.container}
				scrollEnabled={false}
				innerRef={ref => {
					this.scroll = ref
				}}
				enableOnAndroid={true}>


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
					onSubmitEditing={() => this.phoneInput.focus()}
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

				<TextInput placeholder="Phone Number"
					style={styles.textInput}
					ref={(input) => { this.phoneInput = input }}
					returnKeyType={"next"}
					onSubmitEditing={() => this.passwordInput.focus()}
					blurOnSubmit={true}
					onChangeText={(text) => this.handlePhoneNumberChange(text)}
					onFocus={(event) => {
						// `bind` the function if you're using ES6 classes
						this._scrollToInput(findNodeHandle(event.target))
					}}
					textContentType={"telephoneNumber"}
					keyboardType={"phone-pad"}
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


				<View style={{ flex: 1, flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "space-between", paddingBottom: 30, paddingTop: 20 }}>
					<CustomButton text="Create Account" onPress={() => { this.createAccount() }}
						buttonStyle={styles.buttonStyle}
						textStyle={styles.buttonTextStyle} />


				</View>
			</KeyboardAwareScrollView>
		);
	}
}

export default withNavigation(Login)
