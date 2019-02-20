import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { View, Text, Button, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { AsyncStorage } from 'react-native';
import Home from "./Screens/Home"
import Settings from "./Screens/Settings"
import Notifications from "./Screens/Notifications"
import Account from "./Screens/Account"
import NewRequest from "./Screens/NewRequest"
import Login from "./Screens/Login"
import RegisterAccount from "./Screens/RegisterAccount"
import TermsOfService from "./Screens/TermsOfService"
import Messages from "./Screens/Messages"
import MessageThread from "./Screens/MessagesThread"
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

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
        <Account navigation={this.props.navigation} />

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
      </React.Fragment>
    )
  }
}

class TermsOfServiceScreen extends React.Component {
  static navigationOptions = {
    title: "Terms of Service",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }
  render() {
    return (
      <TermsOfService />
    )
  }
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Sign In",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <React.Fragment>
        <Login props={this.props.navigation} />
      </React.Fragment>
    )
  }
}

class MessagesScreen extends React.Component{
  static navigationOptions = {
    title: "Messages",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render()
  {
    return(
      <Messages/>
    )
  }
}

class MessageThreadScreen extends React.Component{
  render()
  {
    return(
      <MessageThread/>
    )
  }
}


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const AccountStack = createStackNavigator({
  Account: AccountScreen,
  Settings: SettingsScreen,
})

const NotificationStack = createStackNavigator({
  Notifications: NotificationsScreen,
})

const NewRequestStack = createStackNavigator({
  NewRequest: NewRequestScreen
})

const MessagesStack = createStackNavigator({
  Messages: MessagesScreen,
  Thread: MessageThreadScreen,
})


const SignedOut = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: RegisterAccountScreen,
  TOS: TermsOfServiceScreen
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
  Messages: {
    screen: MessagesStack,
    navigationOptions: {
      tabBarLabel: "Messages",
      tabBarIcon: ({tintColor}) => (
        <Icon name={Platform.OS === "ios" ? "ios-chatbubbles" : "md-chatbubbles"} color={tintColor} size={24}/>
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
        <AccountIcon name="account" color={tintColor} size={24} />
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
    order: ['Home', 'Messages', 'NewRequest', 'Notifications', 'Account'],
    //navigation for complete tab navigator
    navigationOptions: {
      tabBarVisible: true
    },
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'grey'
    }
  })

export const createRootNavigator = (signedIn) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn,
      },
      SignedOut: {
        screen: SignedOut,
      },
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignedIn: false,
    }
  }

  componentDidMount = () => {

    //Check for loginKey to log user's back in
    AsyncStorage.getItem("loginKey").then((value) => {
      if (value !== null) {
        console.log("Login key found!")

        this.setState({
          signedIn: true
        })

      }
      else {
        console.log("Login key not found")

        this.setState({
          signedIn: false
        })
      }
    })
  }

  render() {

    console.log("SignedIn Boolean: " + this.state.signedIn)
    const Layout = createRootNavigator(this.state.signedIn)
    return <Layout />
  }
}