import React, { Component } from 'react';
import { View, Text, Button, } from 'react-native';
import {withNavigation} from 'react-navigation'


class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		return (
			<View>

				<Button title="Go to App" onPress={() => {this.props.navigation.navigate("SignedIn")}} />

				<Text> Login </Text>
			</View>
		);
	}
}

export default withNavigation(Login)
