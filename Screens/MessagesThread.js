//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from "../Components/api-config"
import { withNavigation } from "react-navigation"
import KeyboardSpacer from "react-native-keyboard-spacer"
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { NEW_MESSAGE_TITLE, NEW_MESSAGE_MESSAGE, NOTIFICATION_API, NEW_MESSAGE_TOAST_MESSAGE } from "../Components/Constants"

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
      user2Name: this.props.navigation.state.params.user2Name,
      request_ID: this.props.navigation.state.params.request_ID,
      popupIsOpen: false,
      creatorEmail: "",
    }
  }

  componentDidMount() {
    /**
     * Passback the props for the navigation
     * Header that is set in App.js
     */
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
    this.state.socket.on("deletingRequestCallback", (data) => this.processRequestDeletion(data))
    this.state.socket.on("removingConversationCallback", (data) => this.processConversationDeletion(data))
    this.state.socket.emit("requestConversationRequestCreator", (this.state.request_ID))
    this.state.socket.on("requestCreatorEmailReceived", (data) => this.setState({ creatorEmail: data }))

    // console.log("Convo ID: " + this.state.convo_ID)
    // console.log("User ID: " + this.state.user_ID)
    // console.log("User Expo Token ", this.state.userToReceivePushNotifications)
    // console.log("Other User's Name: " + this.state.user2Name)
    // console.log("Request_ID: " + this.state.request_ID)
  }

  //Pull Messages for the thread from DB
  requestMessages() {
    console.log("Requesting Messages from Server")

    var data = { convo_ID: this.state.convo_ID }

    this.state.socket.emit("requestConversationMessages", (data))
  }

  //Process the Messages received and then sort them
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
   * Update the frontend with the new message
   * and then send the entire messages array
   * to the server for adding to DB
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

  //Called from onSend()
  /**
   * Sends a push notification to the OTHER
   * user that there is a new message
   */
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
        body: NEW_MESSAGE_MESSAGE + this.state.fullName,
        data: {
          message: NEW_MESSAGE_TOAST_MESSAGE + this.state.fullName
        }
      })
    })
    console.log("Push Notification Sent", JSON.stringify(response))
  }

  //Open the options modal
  openCloseModal() {
    console.log("Request Creator is: " + this.state.creatorEmail)

    this.setState({
      popupIsOpen: true,
    })
  }

  //Close the options modal
  closeCloseRequest() {
    this.setState({
      popupIsOpen: false,
    })
  }

  //Deletes only the conversation
  closeChat() {
    console.log("User wants to close chat only")
    Alert.alert("Confirm", "Are you sure you want to remove this conversation? If this person is harassing you or breaking rules, please report them under Account > Help",
      [
        { text: "No" },
        {
          text: "Yes", onPress: () => {
            console.log("Deleting Request")
            this.state.socket.emit("removeConversationOnly", (this.state.convo_ID))
          }
        }
      ])
  }

  /** 
   * Deletes Request, conversation,
   * anything related to the request 
   * and it's request_ID
   * */
  closeRequest() {
    console.log("User wants to close entire request")
    Alert.alert("Confirm", "Are you sure you want to remove this request? This will remove the conversation.",
      [
        { text: "No" },
        {
          text: "Yes", onPress: () => {
            console.log("Deleting Request")
            this.state.socket.emit("deletePersonalRequest", (this.state.request_ID))
          }
        }
      ])
  }

  //Process callback for deletion
  processRequestDeletion = (data) => {
    console.log("Data from deleting request is: " + data)
    switch (data) {
      case "error":
        Alert.alert("Error", "There was an error removing the request. Please try again.",
          [{ text: "OK", onPress: () => this.closeCloseRequest() }])
        break;
      case "success":
        Alert.alert("Success", "Successfully deleted the request",
          [{ text: "OK", onPress: () => this.closeModalThenGoBack() }])
        break;
    }
  }

  //Process callback for deletion
  processConversationDeletion = (data) => {
    console.log("Data from deleting conversation is: " + data)
    switch (data) {
      case "error":
        Alert.alert("Error", "There was an error removing the conversation. Please try again",
          [{ text: "OK", onPress: () => this.closeCloseRequest() }])
        break;
      case "success":
        Alert.alert("Success", "Successfully deleted the conversation",
          [{ text: "OK", onPress: () => this.closeModalThenGoBack() }])
        break;
    }
  }

  /**
   * Close the Modal and then navigate back to the
   * Messages screen. Then it runs Messages.js's
   * refreshFeed() method to update the conversations
   * so users can click on the conversation that was just removed
   */
  closeModalThenGoBack() {
    const { params } = this.props.navigation.state

    this.closeCloseRequest()
    this.props.navigation.navigate("Messages")
    params.refreshFeed()
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
      <React.Fragment>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.popupIsOpen}
          onRequestClose={() => {
            this.closeCloseRequest()
          }}>
          <View style={[{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            backgroundColor: '#ecf0f1',
          }, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <View style={{
              backgroundColor: '#fff', padding: 20, height: "40%",
              width: "80%", borderRadius: 10, justifyContent: "space-between"
            }}>
              <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: RF(2.5), textAlign: "center", padding: 3 }}>Close Request?</Text>
                <Text style={{ fontSize: RF(2), paddingTop: 5, textAlign: "center" }}>
                  Here you can choose to close the request, or just this conversation. Closing the request will mark it as done and remove
                  it from the app. Closing this conversation will delete only this conversation and keep your request open. Only the creator of the request can close the request itself.
                                    </Text>
              </View>

              <View>
                <Text style={{ textAlign: "center", fontSize: RF(2), paddingBottom: 2.5, paddingTop: 2.5 }}>
                  Which would you like to delete?
                 </Text>
              </View>


              <View style={{ flex: .3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: "10%" }}>
                <CustomButton text='None'
                  onPress={() => this.closeCloseRequest()} buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle}
                />

                <CustomButton text="Chat"
                  onPress={() => this.closeChat()}
                  buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />

                <CustomButton text="Request"
                  onPress={() => this.closeRequest()} 
                  buttonStyle={this.state.creatorEmail === this.state.email ? styles.buttonStyle : styles.buttonStyleFaded} 
                  textStyle={styles.buttonTextStyle}
                  disabled={this.state.creatorEmail === this.state.email ? false : true} />
              </View>
            </View>


          </View>
        </Modal>
      </React.Fragment>
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
  },

  buttonStyle: {
    padding: 10,
    backgroundColor: 'rgb(56, 73, 154)',
    borderRadius: 10
  },

  buttonStyleFaded: {
    padding: 10,
    backgroundColor: 'rgba(56, 73, 154, .6)',
    borderRadius: 10
  },

  buttonTextStyle: {
    fontSize: RF(2),
    color: '#ffffff',
    textAlign: 'center'
  }
});


//make this component available to the app
export default withNavigation(MessagesThread);
