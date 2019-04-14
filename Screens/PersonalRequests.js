//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import CustomButton from "../Components/CustomButton"
import { Card } from 'react-native-elements'
import RF from "react-native-responsive-fontsize"
import { AsyncStorage } from 'react-native';
import { API_ENDPOINT } from "../Components/api-config"

const apiEndpoint = API_ENDPOINT

// create a component
class PersonalRequests extends Component {

    _isMounted = true

    constructor(props) {
        super(props)

        this.state = {
            fullName: "",
            email: "",
            socket: apiEndpoint,
            refreshing: false,
            requestsDataJSON: "",
            requests: [],
            popupIsOpen: false,
            requestTitle: "",
            requestSubtitle: "",
            requestDateCreated: "",
            request_ID: "",
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.userFullName()
        this.userEmail()
        this.state.socket.on("personalRequestsReceived", (data) => {
            if (this._isMounted) {
                this.setState({ requestsDataJSON: data }),
                    this.processRequests()
            }
        })
        this.state.socket.on("deletingRequestCallback", (data) => this.processRequestDeletion(data))
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //Grab the full name from the phone's storage
    userFullName = async () => {
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
    userEmail = async () => {
        try {
            await AsyncStorage.getItem("userEmail").then((value) => {
                //console.log("Email:" + value)
                if (this._isMounted) {
                    this.setState({
                        email: value
                    })
                }
                this.state.socket.emit("requestPersonalRequests", (value))
            })
        }
        catch (error) {
            //console.log(error)
        }
    }

    /**
     * Process all personal requests this account
     * has created and sort and display them
     */
    processRequests = () => {
        if (this._isMounted) {
            this.setState({
                requests: []
            })
        }

        if (this.state.requestsDataJSON.length > 0) {
            //console.log("Requests received: " + this.state.requestsDataJSON)

            var temp = []

            for (var i = 0; i < this.state.requestsDataJSON.length; i++) {
                var newCard = (
                    <Card title={this.state.requestsDataJSON[i].title} subtitle={this.state.requestsDataJSON[i].subtitle}
                        posterName={this.state.requestsDataJSON[i].posterName} request_ID={this.state.requestsDataJSON[i]._id}
                        dateCreated={this.state.requestsDataJSON[i].dateCreated}
                        containerStyle={{ borderRadius: 0, margin: 5, borderRadius: 10, backgroundColor: "rgb(255,255,255)" }}
                        wrapperStyle={{}}
                        titleStyle={{ fontSize: RF(2.5), fontWeight: "bold" }}
                    >
                        <Text style={{ textAlign: "center", fontSize: RF(2) }}>{this.state.requestsDataJSON[i].subtitle}</Text>
                    </Card>
                )

                temp.push(newCard)
            }

            if (this._isMounted) {
                this.setState({
                    requests: temp
                })
            }

        }
        else {
            //console.log("No requests for user. Or is DB connection bad?")
        }

        if (this._isMounted) {
            this.setState({
                refreshing: false
            })
        }
    }

    //refresh feed
    refreshFeed = () => {
        if (this._isMounted) {
            this.setState({
                refreshing: true
            })
        }

        //console.log("Refreshing. Email: " + this.state.email)

        this.state.socket.emit("requestPersonalRequests", (this.state.email))
    }

    //Open the Request Modal
    openRequest = (item) => {
        //console.log("Date Created: " + new Date(item.props.dateCreated).toLocaleDateString())
        //console.log("Request ID: " + item.props.request_ID)

        if (this._isMounted) {
            this.setState({
                popupIsOpen: true,
                requestDateCreated: new Date(item.props.dateCreated).toLocaleDateString(),
                requestTitle: item.props.title,
                requestSubtitle: item.props.subtitle,
                request_ID: item.props.request_ID
            })
        }

    }

    //Clost the Modal
    closeRequest() {
        if (this._isMounted) {
            this.setState({
                popupIsOpen: false
            })
        }
    }

    //Sends a request the Server to delete
    //the request
    deleteRequest() {
        Alert.alert("Confirm", "Are you sure you want to remove this request? It will also remove the conversation about it if it exists.",
            [
                { text: "No" },
                {
                    text: "Yes", onPress: () => {
                        //console.log("Deleting Request")
                        this.state.socket.emit("deletePersonalRequest", (this.state.request_ID))
                    }
                }
            ])
    }

    //If request was deleted, refresh
    processRequestDeletion = (data) => {
        //console.log("Data from deleting request is: " + data)

        switch (data) {
            case "error":
                Alert.alert("Error", "There was an error removing the request. Please try again.",
                    [{ text: "OK", onPress: () => this.closeRequest() }])
                break;
            case "success":
                // Alert.alert("Success", "Successfully deleted the request",
                //     [{ text: "OK", onPress: () => this.closeRequest() }])
                this.refreshFeed()
                break;
        }
    }

    render() {

        

        return (
            <React.Fragment>
                <ScrollView style={styles.container}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                    }>
                    {
                        this.state.requests.length > 0 ?
                            this.state.requests.map((item, key) => {
                                return (
                                    <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
                                        {item}
                                    </TouchableOpacity>
                                )
                            })
                            :
                            <Text style={{ textAlign: "center", fontSize: RF(2.5), top: "50%", bottom: "50%" }}>This is where you'll find any open requests you've made. It looks like you don't have any yet.</Text>
                    }

                </ScrollView>

             

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
                                    <Text style={{ fontWeight: "bold", fontSize: RF(3), textAlign: "center", padding: 3 }}>{this.state.requestTitle}</Text>
                                    <Text style={{ fontSize: RF(1.5), textAlign: "center", paddingTop: 3 }}>Created on {this.state.requestDateCreated}</Text>
                                    <Text style={{ fontSize: RF(2.5), paddingTop: 15, textAlign: "center" }}>{this.state.requestSubtitle}</Text>
                                </View>


                                <View style={{ alignItems: "center" }}>
                                    <CustomButton text="Delete Request"
                                        onPress={() => this.deleteRequest()}
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
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
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

const ScrollStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

//make this component available to the app
export default PersonalRequests;
