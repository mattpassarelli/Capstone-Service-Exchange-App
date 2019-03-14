import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Alert, Button, Platform } from 'react-native'
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
import PersonalRequests from "./Screens/PersonalRequests"
import RejectedDistance from "./Screens/RejectedDistance"
import Help from "./Screens/Help"
import geolib from 'geolib'
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
      <Settings navigation={this.props.navigation}/>
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

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: "Messages",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <Messages />
    )
  }
}

class MessageThreadScreen extends React.Component {
  render() {
    return (
      <MessageThread />
    )
  }
}

class PersonalRequestsScreen extends React.Component {
  static navigationOptions = {
    title: "Your Requests"
  }
  render() {
    return (
      <PersonalRequests />
    )
  }
}

class DistanceTooFarScreen extends React.Component {

  static navigationOptions = {
    title: "UExchange"
  }

  render() {
    return (
      <RejectedDistance />
    )
  }
}

class HelpScreen extends React.Component {
  static navigationOptions = {
    title: "Help"
  }

  render(){
    return(
      <Help/>
    )
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const AccountStack = createStackNavigator({
  Account: AccountScreen,
  Settings: SettingsScreen,
  PersonalRequests: PersonalRequestsScreen,
  Help: HelpScreen,
  TOS: TermsOfServiceScreen
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
      tabBarIcon: ({ tintColor }) => (
        <Icon name={Platform.OS === "ios" ? "ios-chatbubbles" : "md-chatbubbles"} color={tintColor} size={24} />
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

const tooFarDistance = createStackNavigator({
  tooFar: DistanceTooFarScreen
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

export const rejectedDistanceRoot = () => {
  return createSwitchNavigator(
    {
      tooFar: tooFarDistance
    }
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignedIn: false,
      withinDistance: false,
    }
  }

  componentWillMount() {

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


    console.log("Getting Geo-Location")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = JSON.stringify(position)
        console.log("LOCATION: " + location)

        /**
         * TODO: Reinstate the proper distance method below
         */


        // const distance = geolib.getDistance(position.coords, {
        //   latitude: 37.063922,
        //   longitude: -76.492951
        // })

        const distance = geolib.getDistance({ latitude: 37.066388, longitude: -76.488703 }, {
          latitude: 37.063922,
          longitude: -76.492951
        })

        console.log('You are ' + distance + ' meters away from CNU')

        if (distance <= 1610) {
          this.setState({
            withinDistance: true
          })
        }
      },
      function (error) {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )

  }

  render() {
    console.log("Are you WITHIN DISTANCE: " + this.state.withinDistance)
    console.log("SignedIn Boolean: " + this.state.signedIn)

    if (this.state.withinDistance) {
      const Layout = createRootNavigator(this.state.signedIn)
      return <Layout />
    }
    else {
      const Layout = rejectedDistanceRoot()
      return <Layout />
    }
  }
}