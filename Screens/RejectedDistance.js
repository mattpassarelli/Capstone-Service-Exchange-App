import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RF from "react-native-responsive-fontsize"

export default class RejectedDistance extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignContent: 'center', }}>
				<Text style={{ textAlign: "center", fontSize: RF(3) }}> You are too from campus to use this app.
		Please get within 1 mile of campus, restart the app, and try again. </Text>
			</View>
		);
	}
}
