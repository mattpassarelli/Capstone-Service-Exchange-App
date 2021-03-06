//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card } from "react-native-elements"
import Message from "../Components/Message"
import { withNavigation } from "react-navigation"
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from '../Components/api-config';

const apiEndpoint = API_ENDPOINT

// create a component
class Messages extends Component {

    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            fullName: "",
            email: "",
            socket: apiEndpoint,
            conversationsJSON: [],
            conversations: [],
            refreshing: false,
            user_ID: 0,
            userExpoToken: "",
            otherUsersName: "",
            request_ID: "",
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.state.socket.on("conversationsFound", (data) => {
            if (this._isMounted) {
                this.setState({ conversationsJSON: data }),
                    this.processConversations()
            }
        })
        //Get User's unique ID number from the DB
        this.state.socket.on("userIDGiven", (data) => {
            if (this._isMounted) {
                this.setState({ user_ID: data })
            }
        })
        this.userEmail()
        this.userFullName()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //Grab the full name from the phone's storage
    async userFullName() {
        try {
            await AsyncStorage.getItem("fullAccountName").then(async (value) => {
                //console.log("Name: " + value)
                if (this._isMounted) {
                    this.setState({
                        fullName: value
                    })
                }
            })
        }
        catch (error) {
            //console.log(error)
        }
    }

    //grab user email from phone storage
    async userEmail() {
        try {
            await AsyncStorage.getItem("userEmail").then((value) => {
                //console.log("Email:" + value)
                if (this._isMounted) {
                    this.setState({
                        email: value
                    })
                }
            /**
             * Since I can't come up with a decent way of storing these
             * values in state before the socket emits, we'll just emit
             * in the call back. I hope to fix this later on
             */
                this.state.socket.emit("requestConversations", ({ email: value }))
                this.state.socket.emit("requestUserID", ({ email: value }))
            })
        }
        catch (error) {
            //console.log(error)
        }
    }

    /**
     * Processes all of the message threads 
     * from the server that the user's email 
     * is a part of and then properly sorts
     * and displays them
     */
    processConversations() {
        //console.log(this.state.conversationsJSON)

        if (this._isMounted) {
            this.setState({
                conversations: []
            })
        }

        //console.log("sorting JSON")
        var tempArray = []

        //console.log(this.state.conversationsJSON.length)

        if (this.state.conversationsJSON.length > 0) {
            for (var i = 0; i < this.state.conversationsJSON.length; i++) {

                //Decide which name should be the title of the thread
                //ie. don't make the user's name the title. It's confusing
                let title = "PLACEHOLDER"
                let token = "OOF I HOPE NOT"
                if (this.state.conversationsJSON[i].user1Name == this.state.fullName) {
                    //console.log("TITLE WILL BE: " + this.state.conversationsJSON[i].user2Name)
                    title = this.state.conversationsJSON[i].user2Name
                    token = this.state.conversationsJSON[i].user2ExpoToken
                }
                else if (this.state.conversationsJSON[i].user2Name == this.state.fullName) {
                    //console.log("TITLE WILL BE: " + this.state.conversationsJSON[i].user1Name)
                    title = this.state.conversationsJSON[i].user1Name
                    token = this.state.conversationsJSON[i].user1ExpoToken
                }
                //console.log("TITLE: " + title)

                var newConvo = (
                    <Message userNameTitle={title}
                        requestType={this.state.conversationsJSON[i].requestType}
                        convo_ID={this.state.conversationsJSON[i]._id}
                    >
                    </Message>
                )

                if (this._isMounted) {
                    this.setState({
                        userExpoToken: token,
                        otherUsersName: title,
                        request_ID: this.state.conversationsJSON[i].request_ID
                    })
                }

                //console.log(newConvo, this.state.userExpoToken, this.state.otherUsersName, this.state.request_ID)

                tempArray.push(newConvo)
            }
        }

        tempArray.reverse()


        if (this._isMounted) {
            this.setState({
                conversations: tempArray,
                refreshing: false
            })
        }

        //console.log("Number of Conversations is " + this.state.conversations.length)
    }

    //Refreshes the feed
    refreshFeed = () => {
        //console.log("requesting messages")

        if (this._isMounted) {
            this.setState({
                refreshing: true
            })
        }

        this.state.socket.emit("requestConversations", ({ email: this.state.email }))
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                }>
                    {
                        this.state.conversations.map((item, key) => {
                            return (
                                <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.props.navigation.navigate(
                                    {
                                        type: "Navigate",
                                        routeName: "Thread",
                                        params: {
                                            convo_ID: item.props.convo_ID, user_ID: this.state.user_ID,
                                            expoToken: this.state.userExpoToken, user2Name: this.state.otherUsersName,
                                            request_ID: this.state.request_ID, refreshFeed: this.refreshFeed.bind(this)
                                        }
                                    })}>
                                    <Message userNameTitle={item.props.userNameTitle} key={key} requestType={item.props.requestType} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
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
export default withNavigation(Messages);
