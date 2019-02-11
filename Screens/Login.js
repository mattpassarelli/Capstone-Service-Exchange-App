import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, findNodeHandle } from 'react-native';
import { withNavigation } from 'react-navigation'
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view'


/**
 * TODO:
 * At login, check for email and password.
 * If for some reason the account isn't verified yet, give them an
 * option to enter the PIN and/or resend the email
 * 
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
			email: "",
			password: "",
		};
	}

	handleEmailTextChange = (email) => {
		this.setState({
			email: email
		})
	}

	handlePasswordTextChange = (pass) => {
		this.setState({
			password: pass
		})
	}

	_scrollToInput(reactNode) {
		// Add a 'scroll' ref to your ScrollView
		this.scroll.props.scrollToFocusedInput(reactNode)
	}

	render() {

		return (

			<KeyboardAwareScrollView
				style={{ flex: 1, }}
				resetScrollToCoords={{ x: 0, y: 0 }}
				contentContainerStyle={styles.container}
				scrollEnabled={false}
				innerRef={ref => {
					this.scroll = ref
				}}
				enableOnAndroid={true}>


				{/* TODO: get an app icon for placement here */}

				<Image
					style={{ flex: 1, width: 200, height: 200, paddingTop: 125 }}
					resizeMode="contain"
					source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
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
					<CustomButton text="Login" onPress={() => { this.props.navigation.navigate("SignedIn") }}
						buttonStyle={styles.buttonStyle}
						textStyle={styles.buttonTextStyle} />

					<Text>

						Don't have an account?
						<Text style={{ color: '#00F' }} onPress={() => this.props.navigation.navigate("SignUp")}> Click here</Text>

					</Text>

				</View>
			</KeyboardAwareScrollView>
		);
	}
}

export default withNavigation(Login)
