//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Card } from 'react-native-elements'
import Picker from 'react-native-universal-picker'
import RF from "react-native-responsive-fontsize"
import CustomButton from "../Components/CustomButton"
import { API_ENDPOINT } from "../Components/api-config"
import { AsyncStorage } from 'react-native';
import Home from "./Home"


const apiEndpoint = API_ENDPOINT

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start"
    },

    buttonStyle: {
        padding: 10,
        backgroundColor: 'rgb(56, 73, 154)',
        borderRadius: 10
    },

    buttonTextStyle: {
        fontSize: RF(2),
        color: '#ffffff',
        textAlign: 'center'
    }
});

// create a component
class NewRequest extends PureComponent {

    homeInstance = Home
    _isMounted = false

    constructor(props) {
        super(props)
        this.homeInstance = new Home(props)

        this.state = {
            selectedItem: "",
            requestDescription: "",
            isPreviewOpen: false,
            socket: apiEndpoint,
            fullName: "",
            email: "",
            firstNameLastInitial: "",
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.userFullName()
        this.userEmail()

        this.state.socket.on("requestAddCallback", (data) => this.processRequestCallback(data))
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
                this.removeLastName()
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
            })
        }
        catch (error) {
            //console.log(error)
        }
    }

    /**
     * Removes every character from the
     * last Name so it's only the first character.
     * There are probably better ways to do this, 
     * but oh well
     */
    removeLastName() {
        var index = this.state.fullName.indexOf(" ")
        var firstName = this.state.fullName.substring(0, index)
        var lastName = this.state.fullName.substring(index + 1)
        var firstIntialofLast = lastName.substring(0, 1)
        var name = firstName + " " + firstIntialofLast

        if (this._isMounted) {
            this.setState({
                firstNameLastInitial: name
            })
        }
    }

    //Handles selection from the Picker for title
    handlePickerChange = (itemValue, itemIndex) => {
        // Keeps the placeholder from being selected
        if (itemValue != "0") {
            if (this._isMounted) {
                this.setState({
                    selectedItem: itemValue,
                })
            }
        }
    }

    //Handles text input in the textInput for requestDescription
    handleDescriptionChange = (text) => {
        if (this._isMounted) {
            this.setState({
                requestDescription: text
            })
        }
    }

    //Opens preview modal
    openPreview() {

        var checked = this.checkForEmptyStates()

        if (checked) {
            if (this._isMounted) {
                this.setState({
                    isPreviewOpen: true
                })
            }
        }
        else {
            Alert.alert("Please fill in all fields")
        }

    }

    //closes preview modal
    closePreview() {
        if (this._isMounted) {
            this.setState({
                isPreviewOpen: false
            })
        }
    }

    /**Checks to make sure Pick has a valid option selected
     * and the textInput is not blank. Only called when the Preview button
     * is pressed
     * */
    checkForEmptyStates() {
        if (this.state.selectedItem.length <= 0) {
            return false
        }
        else {
            if (this.state.requestDescription.length <= 0) {
                return false
            }
        }

        return true
    }

    /**
     * Takes the data from the inputs and processes them into
     * a data variable. Data is then sent to the server, where 
     * it adds it to the database. Closes preview, then clears
     * inputs
     */
    sendRequestToDatabase() {

        var data = {
            title: this.state.selectedItem, subtitle: this.state.requestDescription,
            posterName: this.state.firstNameLastInitial, posterEmail: this.state.email
        }

        this.state.socket.emit("saveRequest", data)

        this.closePreview()

        if (this._isMounted) {
            this.setState({
                selectedItem: "",
                requestDescription: ""
            })
        }
        this.textInput.clear()
    }

    /**
     * Handles the callback from the server
     * so that we can process what to do next
     */
    processRequestCallback = (data) => {
        //console.log("Request Feedback is: " + data)
        switch (data) {
            case "success":
                //console.log("Success!")
                this.homeInstance.refreshFeed()
                this.props.navigation.navigate("Home")
                break;
            default:
                //console.log("Oh no")
                break;
        }
    }

    render() {

        return (

            <React.Fragment>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                            <Text style={{ paddingTop: 15, fontSize: RF(2.5) }}>Select a Request...</Text>

                            <View style={{ backgroundColor: "rgba(137, 132, 132, 0.1)", height: 50, width: "80%", borderRadius: 10, borderWidth: .25 }}>
                                <Picker
                                    selectedValue={this.state.selectedItem}
                                    onValueChange={this.handlePickerChange}
                                    style={{ alignItems: 'center', justifyContent: "center" }}
                                    prompt="Select a Request Type">

                                    {/* Placeholder Item */}
                                    <Picker.Item label="Please Select a Request..." value="0" />

                                    <Picker.Item label="Need Help Moving Something" value="Need Help Moving Something" />
                                    <Picker.Item label="Need A Ride" value="Need A Ride" />
                                    <Picker.Item label="Selling Textbook" value="Selling Textbook" />
                                    <Picker.Item label="Homework Help" value="Homework Help" />
                                    <Picker.Item label="Found Missing Item" value="Found Missing Item" />

                                </Picker>
                            </View>

                        </View>

                        <View style={{ flex: 2, }}>

                            {/* Character Counter */}
                            <Text style={{ position: "absolute", right: 0, backgroundColor: "transparent", color: "rgba(137, 132, 132, 0.5)", alignItems: "flex-end" }}>{this.state.requestDescription.length}/100</Text>

                            <TextInput
                                placeholder="Type a description..."
                                multiline={true}
                                style={{
                                    backgroundColor: "rgba(137, 132, 132, 0.1)", height: "100%", textAlignVertical: "top", fontSize: RF(2.5),
                                    borderTopWidth: 1, borderTopColor: "#bfbfbf", paddingTop: 15, paddingLeft: 10
                                }}
                                onChangeText={(text) => this.handleDescriptionChange(text)}
                                maxLength={100}
                                numberOfLines={8}
                                returnKeyType="done"
                                blurOnSubmit={true}
                                ref={input => { this.textInput = input }}
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                            />
                        </View>

                        <View style={{ flex: .5, justifyContent: "center", paddingRight: 10, paddingLeft: 10 }}>
                            <CustomButton text="Preview Button" onPress={() => this.openPreview()} buttonStyle={styles.buttonStyle}
                                textStyle={styles.buttonTextStyle} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>


                <Modal animationType="slide" transparent={true} visible={this.state.isPreviewOpen} onRequestClose={() => this.closePreview()}>
                    <TouchableWithoutFeedback onPress={() => this.closePreview()}>
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
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: RF(3), textAlign: "center", padding: 3 }}>{this.state.selectedItem}</Text>
                                    <Text style={{ fontSize: RF(1.5), textAlign: "center" }}>Posted by: {this.state.firstNameLastInitial}</Text>
                                    <Text style={{ fontSize: RF(2.5), paddingTop: 15, textAlign: "center" }}>{this.state.requestDescription}</Text>
                                </View>
                                <View style={{ flex: .3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: "10%" }}>
                                    <CustomButton text='Close'
                                        onPress={() => this.closePreview()} buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle}
                                    />

                                    <CustomButton text="Submit"
                                        onPress={() => this.sendRequestToDatabase()} buttonStyle={styles.buttonStyle} textStyle={styles.buttonTextStyle} />
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
export default NewRequest;
