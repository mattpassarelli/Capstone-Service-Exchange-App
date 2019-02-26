//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card } from "react-native-elements"
import Message from "../Components/Message"
import { withNavigation } from "react-navigation"
import { AsyncStorage } from "react-native"
import { API_ENDPOINT } from '../Components/api-config';

const apiEndpoint = API_ENDPOINT

/**
 * TODO: Pretty this up
 */


// create a component
class Messages extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            socket: apiEndpoint,
            conversationsJSON: [],
            conversations: [],
            refreshing: false,
        }
    }

    componentWillMount() {
        this.userEmail()
        this.userFullName()
    }

    componentDidMount() {
        this.state.socket.on("conversationsFound", (data) => { this.setState({ conversationsJSON: data }), this.processConversations() })
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
				/**
				 * Since I can't come up with a decent way of storing these
				 * values in state before the socket emits, we'll just emit
				 * in the call back. I hope to fix this later on
				 * 
				 * TODO: Store account data in a constant file hopefully
				 */
                this.state.socket.emit("requestConversations", (value))
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    processConversations() {
        console.log(this.state.conversationsJSON)

        this.setState({
            conversations: []
        })

        console.log("sorting JSON")
        var tempArray = []

        console.log(this.state.conversationsJSON.length)

        if (this.state.conversationsJSON.length > 0) {
            for (var i = 0; i < this.state.conversationsJSON.length; i++) {

                var title = this.state.conversationsJSON[i].user1Name + " & " + this.state.conversationsJSON[i].user2Name


                var newConvo = (
                    <Message userNameTitle={title}
                        requestType={this.state.conversationsJSON[i].requestType}
                    >
                    </Message>
                )

                tempArray.push(newConvo)
            }
        }

        tempArray.reverse()


        this.setState({
            conversations: tempArray,
            refreshing: false
        })

        console.log(this.state.conversations + " length is " + this.state.conversations.length)
    }



    refreshFeed = () => {
        console.log("requesting messages")

        this.setState({
            refreshing: true
        })

        this.state.socket.emit("requestConversations", (this.state.email))
    }


    /**
     * AsyncStorage for email and name
     * compare the data pulled from server. 
     * Whichever userXName is NOT the logged in user
     * assign that as the prop for the "Message" component
     */

    render() {
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                }>
                    {
                        this.state.conversations.map((item, key) => {
                            return (
                                <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.props.navigation.navigate("Thread",
                                    { user2Name: this.state.user2Name, user2Email: this.state.user2Email })}>
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
