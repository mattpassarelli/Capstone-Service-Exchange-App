//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from "../Components/api-config"
import { withNavigation } from "react-navigation"
import KeyboardSpacer from "react-native-keyboard-spacer"

const apiEndpoint = API_ENDPOINT

// create a component
class MessagesThread extends Component {

  static navigationOptions = {
    title: "Hello There"
  }

  constructor(props) {
    super(props)

    this.state = {
      fullName: "",
      email: "",
      messages: [],
      socket: apiEndpoint,
      user2Name: "",
      user2Email: "",
      convo_ID: this.props.navigation.state.params.convo_ID,
    }
  }

  componentDidMount() {
    this.userFullName()
    this.userEmail()

    console.log("Convo ID: " + this.state.convo_ID)
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

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    var data = {messages: this.state.messages, _ID: this.state.convo_ID}

    this.state.socket.emit("addMessageToConvo", (data))
  }

  /**
   * TODO: Add a header
   */

  
  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          user={{ _name: this.state.name }}
          onSend={(messages) => this.onSend(messages)}
          placeholder="Message"
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
