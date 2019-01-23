import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { View, Text, Button, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Home from "./Screens/Home"
import Settings from "./Screens/Settings"
import Notifications from "./Screens/Notifications"
import Account from "./Screens/Account"
import NewRequest from "./Screens/NewRequest"


class NotificationsScreen extends React.Component {

  static navigationOptions = {
    title: "Notifications",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <Notifications />
    );
  }
}

class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Home",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <Home />
    );
  }
}

class SettingsScreen extends React.Component {

  static navigationOptions = {
    title: "Settings",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <Settings />
    );
  }
}

class AccountScreen extends React.Component {

  static navigationOptions = {
    //TODO Change to User's name
    title: "Account",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <React.Fragment>
        <Account />

        <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </React.Fragment>
    )
  }
}

class NewRequestScreen extends React.Component {

  static navigationOptions = {
    title: "New Request",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <NewRequest />
    )
  }
}


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

const AccountStack = createStackNavigator({
  Account: AccountScreen,
  Settings: SettingsScreen
})

const NotificationStack = createStackNavigator({
  Notifications: NotificationsScreen,
})

const NewRequestStack = createStackNavigator({
  NewRequest: NewRequestScreen
})

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: ({ tintColor }) => (
        <Icon name={Platform.OS === "ios" ? "ios-home" : "md-home"} color={tintColor} size={24} />
      )
    }
  },
  Notifications: {
    screen: NotificationStack,
    navigationOptions: {
      tabBarLabel: 'Notifications',
      tabBarIcon: ({ tintColor }) => (
        <Icon name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications"} color={tintColor} size={24} />
      )
    }
  },
  Account: {
    screen: AccountStack,
    navigationOptions: {
      tabBarLabel: 'Account',
      tabBarIcon: ({ tintColor }) => (
        <Icon name={Platform.OS === "ios" ? "ios-man" : "md-man"} color={tintColor} size={24} />
      )
    }
  },
  NewRequest: {
    screen: NewRequestStack,
    navigationOptions: {
      tabBarLabel: "New Request",
      tabBarIcon: ({ tintColor }) => (
        <Icon name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"} color={tintColor} size={24} />
      )
    }
  }
},
  {//router config
    initialRouteName: 'Home',
    order: ['Home', 'NewRequest', 'Notifications', 'Account'],
    //navigation for complete tab navigator
    navigationOptions: {
      tabBarVisible: true
    },
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'grey'
    }
  })

export default TabNavigator;