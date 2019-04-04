import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Alert, Button, Platform, View, Image, ActivityIndicator, Text } from 'react-native'
import { Permissions, Notifications, SplashScreen, Asset } from "expo"
import Icon from 'react-native-vector-icons/Ionicons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { AsyncStorage } from 'react-native';
import Home from "./Screens/Home"
import Settings from "./Screens/Settings"
import NotificationsComponent from "./Screens/Notifications"
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
import geolib, { getCenter } from 'geolib'
import { API_ENDPOINT } from "./Components/api-config"
import Toast from 'react-native-root-toast';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const apiEndpoint = API_ENDPOINT


class NotificationsScreen extends React.Component {

  static navigationOptions = {
    title: "Notifications",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', }
  }

  render() {
    return (
      <NotificationsComponent />
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
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center",
      flex: 1
    },
    headerRight: (<View></View>)
  }

  render() {
    return (
      <Settings navigation={this.props.navigation} />
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
      <NewRequest navigation={this.props.navigation} />
    )
  }
}

class RegisterAccountScreen extends React.Component {
  static navigationOptions = {
    title: "Create Account",
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', },
    headerRight:(<View></View>)
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
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', },
    headerRight:(<View></View>)
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
  static navigationOptions = ({ navigation }) => {
    const { state: { params = {} } } = navigation;
    return {
      title: params.myTitle || "Messaging",
      headerRight: params.close,
      headerTitleStyle: {
        alignSelf: "center",
        textAlign: "center",
        flex: 1
      }
    }
  }

  render() {
    return (
      <MessageThread />
    )
  }
}

class PersonalRequestsScreen extends React.Component {
  static navigationOptions = {
    title: "Your Requests",
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center",
      flex: 1
    },
    headerRight: (<View></View>)
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
    title: "Help",
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center",
      flex: 1
    },
    headerRight: (<View></View>)
  }

  render() {
    return (
      <Help />
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
      activeTintColor: 'rgb(56, 73, 154)',
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
      loading: false,
      socket: apiEndpoint,
      email: "",
      token: "",
      notification: {},
      isReady: false,
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
        this.setState({ isReady: true })
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

    this.checkForTokenStorage()

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentDidMount() {
    SplashScreen.preventAutoHide()
  }

  async userEmail() {
    try {
      await AsyncStorage.getItem("userEmail").then((value) => {
        console.log("Email:" + value)
        this.setState({
          email: value,
        })
        this.state.socket.emit("addNotificationTokenToAccount", ({ token: this.state.token, email: value }))
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  //Check phone storage for a possible Expo Token
  checkForTokenStorage() {
    AsyncStorage.getItem("expoToken").then((value) => {
      if (value !== null) {
        console.log("Expo Token found in storage")
      }
      else {
        console.log("No Expo Token found. Asking for token/permissions")
        this.registerForPushNotificationsAsync()
      }
    })
  }

  //Request notifications permissions and, if yes,
  //send Expo Token to account in DB
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    //let token =  "ExponentPushToken[XeeNo9APZFj_gWwUnfJk2O]"

    console.log("TOKEN: " + token, "Sending token to user account and saving to STORAGE")

    AsyncStorage.setItem("expoToken", token)
    console.log("Expo Token saved to Phone Storage")

    this.setState({
      token: token,
    })
    // this.state.socket.emit("addNotificationTokenToAccount", ({token: token, email: this.state.email}))
    this.userEmail()

  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/splash.png');
    return Asset.fromModule(gif).downloadAsync()
  }

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require('./assets/roundedIcon.png'),
      require('./assets/icon.png'),
      require('./assets/splash.png')
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
  }

  _handleNotification = (notification) => {
    console.log("Incoming notification: " + JSON.stringify(notification))
    Toast.show(notification.data.message)
  };

  render() {
    console.log("Are you WITHIN DISTANCE: " + this.state.withinDistance)
    console.log("SignedIn Boolean: " + this.state.signedIn)

    if (!this.state.isReady) {
      return (

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Image style={{ flex: 1, width: undefined, height: undefined }}
            source={require('./assets/splash.png')}
            onLoad={this._cacheResourcesAsync}
            resizeMode="cover"
            resizeMethod="scale"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator size="large" color="rgb(255,255,255)" />
            <Text style={{ textAlign: "center", color: "rgb(255,255,255)", paddingTop: 5 }}>Loading...</Text>
          </View>
        </View>
      )
    }
    else {
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
}