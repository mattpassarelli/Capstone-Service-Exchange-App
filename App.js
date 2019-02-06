import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { View, Text, Button, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Home from "./Screens/Home"
import Settings from "./Screens/Settings"
import Notifications from "./Screens/Notifications"
import Account from "./Screens/Account"
import NewRequest from "./Screens/NewRequest"
import Login from "./Screens/Login"
import RegisterAccount from "./Screens/RegisterAccount"


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

        {/* //TODO: replace this inside Account.js*/}
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

class RegisterAccountScreen extends React.Component {
  static navigationOptions = {
    title: "Create Account",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <React.Fragment>
      <RegisterAccount />

      <Button title="Go to Sign In" onPress={() => this.props.navigation.navigate("SignIn")}></Button>
      </React.Fragment>
    )
  }
}

class SignInScreen extends React.Component{
  static navigationOptions = {
    title: "Sign In",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <React.Fragment>
      <Login props={this.props.navigation}/>
      </React.Fragment>
    )
  }
}


const HomeStack = createStackNavigator({
  Home: HomeScreen,
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


export const SignedOut = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: RegisterAccountScreen,
})


const SignedIn = createBottomTabNavigator({
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

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn:{
        screen: SignedIn,
      },
      SignedOut: {
        screen: SignedOut,
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  )
}

export default class App extends React.Component{
  constructor(props)
  {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignedIn: false,
    }
  }

  render()
  {
    const {checkedSignedIn, signedIn} = this.state;

    const Layout = createRootNavigator(signedIn)
    return <Layout />
  }
}