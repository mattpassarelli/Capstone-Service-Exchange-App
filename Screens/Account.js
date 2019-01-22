import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Left, Body, Right, Icon, Title } from 'native-base';

// create a component
class Account extends Component {

	static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="ios-man" style={{ fontSize: 24, color: tintColor }} />
        )
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Header>
					<Left style={{ flex: 1, paddingLeft: 5 }}>
						<Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
					</Left>
					<Body style={{ flex: 2 }}>
						{/* this is going to become the account user's name */}
						<Title> Matt Passarelli </Title>
					</Body>

					<Right style={{ flex: 1 }}></Right>
				</Header>

				<ScrollView contentContainerStyle={ScrollStyle.container}>
					<Text>Account</Text>
				</ScrollView>
			</View>
		);
	}
}

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

const ScrollStyle = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

//make this component available to the app
export default Account;