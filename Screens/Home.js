//import liraries
import React, { Component } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-elements'
import { YellowBox } from 'react-native';
import { API_ENDPOINT } from "../Components/api-config"
import CustomButton from "../Components/CustomButton"
import RF from "react-native-responsive-fontsize"
import { NEW_NOTIFICATION_MESSAGE, NEW_NOTIFICATION_TITLE, NOTIFICATION_API } from "../Components/Constants"
import { AsyncStorage } from "react-native"

console.ignoredYellowBox = ["Remote Debugger"]
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const apiEndpoint = API_ENDPOINT

const styles = StyleSheet.create(
    {
        container:
        {
            flex: 1,
            paddingTop: (Platform.OS === 'ios') ? 20 : 0,
            // backgroundColor: "rgb(56, 73, 154)"
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
            borderRadius: 10,
            width: "80%",
        },

        buttonTextStyle: {
            fontSize: RF(2),
            color: '#ffffff',
            textAlign: 'center'
        },
    });


// create a component
class Home extends Component {

    _isMounted = false;

    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            requestsDataJSON: "",
            popupIsOpen: false,
            cardTitle: "",
            cardBody: "",
            cardPoster: "",
            cardID: "",
            socket: apiEndpoint,
            refreshing: false,
            fullName: "",
            email: "",
            OPExpoToken: "",
            posterEmail: "",
        }
    }


    /**
     * Method is run when component mounts (duh)
     * This is where the majority of our server listens will be so things
     * can connect properly
     */
    componentDidMount() {
        this._isMounted = true
        this.userFullName()
        this.userEmail()
        this.state.socket.emit("requestRequests")
        console.log("Component Mounted")
        this.state.socket.on("requestData", (data) => {
            if (this._isMounted) {
                this.setState({ requestsDataJSON: data }), this.addRequestsFromServer()
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //Grab the full name from the phone's storage
    async userFullName() {
        try {
            await AsyncStorage.getItem("fullAccountName").then(async (value) => {
                console.log("Name: " + value)
                if (this._isMounted) {
                    this.setState({
                        fullName: value
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    //grab user email from phone storage
    async userEmail() {
        try {
            await AsyncStorage.getItem("userEmail").then((value) => {
                console.log("Email:" + value)
                if (this._isMounted) {
                    this.setState({
                        email: value
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }



    //Displays the modal for clicking a Request
    openRequest = (item) => {
        console.log(item.props.title)
        console.log(item.props.subtitle)
        console.log(item.props.request_ID)
        console.log(item.props.posterName)
        console.log("EXPO TOKEN: " + item.props.expoToken)
        console.log("Poster email: " + item.props.posterEmail)
        if (this._isMounted) {
            this.setState({
                popupIsOpen: true,
                cardTitle: item.props.title,
                cardBody: item.props.subtitle,
                cardPoster: item.props.posterName,
                cardID: item.props.request_ID,
                OPExpoToken: item.props.expoToken,
                posterEmail: item.props.posterEmail
            })
        }
    }

    //Closes the Request modal
    closeRequest = () => {
        if (this._isMounted) {
            this.setState({
                popupIsOpen: false,
            })
        }
    }

    //Gathers the requests from the backend for adding into
    //the array of requests
    addRequestsFromServer = () => {

        console.log("Gotten Request data from server")
        // console.log(this.state.requestsDataJSON)

        if (this._isMounted) {
            this.setState({
                requests: []
            })
        }

        if (this.state.requestsDataJSON.length > 0) {
            //console.log(this.state.requestsDataJSON)
            var tempRequests = []


            for (var i = 0; i < this.state.requestsDataJSON.length; i++) {
                // console.log("Adding request " + i + " to array of requests")
                var newCard = (
                    <Card title={this.state.requestsDataJSON[i].title} subtitle={this.state.requestsDataJSON[i].subtitle}
                        posterName={this.state.requestsDataJSON[i].posterName} request_ID={this.state.requestsDataJSON[i]._id}
                        expoToken={this.state.requestsDataJSON[i].posterExpoToken} posterEmail={this.state.requestsDataJSON[i].posterEmail}
                        containerStyle={{ borderRadius: 0, margin: 5, borderRadius: 10, backgroundColor: "rgb(255,255,255)" }}
                        wrapperStyle={{}}
                        titleStyle={{ fontSize: RF(2.5), fontWeight: "bold" }}
                    >
                        <Text style={{ textAlign: "center", fontSize: RF(2) }}>{this.state.requestsDataJSON[i].subtitle}</Text>
                    </Card>
                )

                tempRequests.push(newCard)
            }

            tempRequests.reverse()

            if (this._isMounted) {
                this.setState({
                    requests: tempRequests
                })
            }

            //console.log("Finished adding requests. Total is now: " + this.state.requests.length)

        }
        else {
            console.log("No requests in DB. Or is connection bad?")
        }

        if (this._isMounted) {
            this.setState({
                refreshing: false
            })
        }
    }

    /**
     * Method is called when refreshControl is activated
     * Meaning that whenever you pull down to refresh, this 
     * is what is called
     */
    refreshFeed = () => {
        console.log("Refreshing requestsDataJSON")

        /**
         * Clear requests (in case they've all been deleted lol),
         * Then pull in all of the requests again
         */
        if (this._isMounted) {
            this.setState({
                refreshing: true
            })
        }

        this.state.socket.emit("requestRequests", (data) => {
            if (this._isMounted) {
                this.setState({ requestsDataJSON: data })
            }
        })

        console.log("Data received from server is: " + this.state.requestsDataJSON)

        console.log("Done Refreshing JSON")
        this.addRequestsFromServer()
    }

    /**
     * Checks to make sure the user fulfilling
     * is not the OP of the request
     */
    connectWithRequester() {
        var data = { request_ID: this.state.cardID, fulfiller: this.state.email, fulFiller_Name: this.state.fullName }

        if (this.state.posterEmail === this.state.email) {
            Alert.alert("You cannot request to fulfill your own request")
        }
        else {
            Alert.alert("Confirm", "Offer to help this person?",
                [
                    { text: "No", onPress: () => this.closeRequest() },
                    { text: "Yes", onPress: () => this.sendConnectRequest(data) }
                ])
        }
    }
    /**
     * submits a request to the server to add
     * the user who sent this socket to the request
     * as a fulfiller
     */
    sendConnectRequest = (data) => {
        this.state.socket.emit("offerToConnect", (data))
        this.closeRequest()
        this.sendPushNotification()
    }

    //Upon submitting the offer to help
    //we send a push notification to that
    //request's OP
    sendPushNotification = () => {
        console.log("Sending Push Notification", this.state.OPExpoToken)
        let response = fetch(NOTIFICATION_API, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: this.state.OPExpoToken,
                sound: 'default',
                title: NEW_NOTIFICATION_TITLE,
                body: NEW_NOTIFICATION_MESSAGE,
                data: {
                    message: "Someone's offered to help!"
                }
            })
        })
        console.log("Push Notification Sent", JSON.stringify(response))
    }


    render() {

        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                        }>
                        {
                            // Map the requests for proper display onto the main feed
                            this.state.requests.map((item, key) => {
                                return (
                                    <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
                                        {item}
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>


                    {/*Modal for the requests*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.popupIsOpen}
                        onRequestClose={() => {
                            this.closeRequest()
                        }}>
                        <TouchableWithoutFeedback onPress={() => this.closeRequest()}>
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
                                        <Text style={{ fontWeight: "bold", fontSize: RF(3), textAlign: "center", padding: 3 }}>{this.state.cardTitle}</Text>
                                        <Text style={{ fontSize: RF(1.5), textAlign: "center" }}>Posted by: {this.state.cardPoster}</Text>
                                        <Text style={{ fontSize: RF(2.5), paddingTop: 15, textAlign: "center" }}>{this.state.cardBody}</Text>
                                    </View>


                                    <View style={{ alignItems: "center" }}>
                                        <CustomButton text="Fulfill Request"
                                            onPress={() => this.connectWithRequester()}
                                            buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

            </React.Fragment>
        );
    }
}

//make this component available to the app
export default Home;
