//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from "../Components/api-config"
import { withNavigation } from "react-navigation"
import KeyboardSpacer from "react-native-keyboard-spacer"
import Icon from 'react-native-vector-icons/Ionicons';
import { NEW_MESSAGE_TITLE, NEW_MESSAGE_MESSAGE, NOTIFICATION_API } from "../Components/Constants"

const apiEndpoint = API_ENDPOINT

// create a component
class MessagesThread extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fullName: "",
      email: "",
      messages: [],
      socket: apiEndpoint,
      convo_ID: this.props.navigation.state.params.convo_ID,
      user_ID: this.props.navigation.state.params.user_ID,
      userToReceivePushNotifications: this.props.navigation.state.params.expoToken,
      user2Name: this.props.navigation.state.params.user2Name
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      myTitle: this.state.user2Name,
      close: (
        <TouchableOpacity style={{ paddingRight: 10 }} activeOpacity={0.7} onPress={() => this.openCloseModal()}>
          <Icon name={Platform.OS === "ios" ? "ios-close-circle-outline" : "md-close-circle-outline"}
            color={"rgb(56, 73, 154)"}
            size={32} />
        </TouchableOpacity>
      )
    })

    this.userFullName()
    this.userEmail()

    this.requestMessages()
    this.state.socket.on("conversationMessagesReceived", (data) => this.processMessagesReceived(data))
    this.state.socket.on("pullNewMessage", () => this.requestMessages())

    console.log("Convo ID: " + this.state.convo_ID)
    console.log("User ID: " + this.state.user_ID)
    console.log("User Expo Token ", this.state.userToReceivePushNotifications)
    console.log("Other User's Name: " + this.state.user2Name)
  }

  requestMessages() {
    console.log("Requesting Messages from Server")

    var data = { convo_ID: this.state.convo_ID }

    this.state.socket.emit("requestConversationMessages", (data))
  }

  processMessagesReceived = (data = []) => {
    console.log("Messages Recevied: " + data)

    /**
     * TODO:
     * I'm apparently causing another memory leak here, but
     * that is yet to be confirmed. Just keep it in mind
     */

    this.setState({
      messages: []
    })

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, data),
    }))
  }

  //Grab the full name from the phone's storage
  userFullName = async () => {
    try {
      await AsyncStorage.getItem("fullAccountName").then(async (value) => {
        console.log("Name: " + value)
        this.setState({
          fullName: value
        })
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  //grab user email from phone storage
  userEmail = async () => {
    try {
      await AsyncStorage.getItem("userEmail").then((value) => {
        console.log("Email:" + value)
        this.setState({
          email: value
        })
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  /**
   * TODO: For now, I'm passing in the entire new state to the server and 
   * replacing the message array everytime. I have no idea how taxing this
   * will get on the front/back ends. If it proves too much, I can try sending
   * only the message that is sent 
   */

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    var data = { messages: messages, _ID: this.state.convo_ID }

    console.log(messages)

    this.state.socket.emit("addMessageToConvo", (data))

    this.sendPushNotification()
  }

  sendPushNotification = () => {
    console.log("Sending Push Notification", this.state.userToReceivePushNotifications)
    let response = fetch(NOTIFICATION_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: this.state.userToReceivePushNotifications,
        sound: 'default',
        title: NEW_MESSAGE_TITLE,
        body: NEW_MESSAGE_MESSAGE + this.state.user2Name
      })
    })
    console.log("Push Notification Sent", JSON.stringify(response))
  }

  openCloseModal() {
    console.log("Showing closing options")
  }

  renderBubble(props) {
    return (
      <Bubble {...props}
        wrapperStyle={{
          left: {

          },
          right: {
            backgroundColor: "rgb(56, 73, 154)"
          }
        }}
      />)
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          user={{
            _id: this.state.user_ID,
            name: this.state.fullName,
            // _avatar: "https://facebook.github.io/react/img/logo_og.png"
          }}
          onSend={(messages) => this.onSend(messages)}
          renderBubble={this.renderBubble}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },

  separator:
  {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%'
  },

  text:
  {
    fontSize: 18,
    color: 'black',
    padding: 15
  }
});


//make this component available to the app
export default withNavigation(MessagesThread);
