//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import RF from "react-native-responsive-fontsize"
import { KeyboardAwareScrollView, } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from "../Components/CustomButton"
import { CheckBox } from 'react-native-elements'
import { AsyncStorage } from 'react-native';
import { MY_EMAIL } from "../Components/Constants"
import email from 'react-native-email'


// create a component
class Help extends Component {

    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            fullName: "",
            email: "",
            emailBody: "",
            phonePlatform: "",
        }
    }

    componentWillMount() {
        this.userEmail()
        this.userFullName()
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted = false
    }

    //Grab the full name from the phone's storage
    userFullName = async () => {
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
    userEmail = async () => {
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

    handleBodyChange = (text) => {
        if (this._isMounted) {
            this.setState({
                emailBody: text
            })
        }
    }

    sendEmail() {
        let device = ""

        if (!this.state.isAndroid && !this.state.isiPhone) {
            Alert.alert("Please select a device")
        }
        else {
            if (this.state.emailBody.trim().length > 0) {
                if (this.state.isAndroid) {
                    device = "Android"
                }
                else if (this.state.isiPhone) {
                    device = "iPhone"
                }

                deviceInfo = "NAME: " + this.state.fullName + "\n" +
                    "EMAIL: " + this.state.email + "\n" +
                    "DEVICE: " + device + "\n" +
                    "MESSAGE: " + this.state.emailBody

                console.log("Sending email")
                console.log("INFO: " + deviceInfo)

                const to = [MY_EMAIL]

                email(to, {
                    cc: "",
                    bcc: "",
                    subject: "UExchange Feedback App",
                    body: deviceInfo
                }).then(this.clearAll()).catch(console.error)
            }
            else {
                Alert.alert("Please type a message")
            }
        }
    }

    clearAll() {
        if (this._isMounted) {
            this.setState({
                emailBody: "",
                isiPhone: false,
                isAndroid: false,
            })
        }
    }

    handleAndroidChoice() {
        if (this._isMounted) {
            this.setState({
                isAndroid: true,
                isiPhone: false
            })
        }
    }

    handleiPhoneChoice() {
        if (this._isMounted) {
            this.setState({
                isAndroid: false,
                isiPhone: true
            })
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>

                    <View style={{ flex: .1 }}>
                        <Text style={{ padding: 5, fontSize: RF(2) }}>
                            Please, shoot me an email with any feedback or bug reports! I would love to hear from you!
                            </Text>
                    </View>

                    <View style={{ flex: .15, flexDirection: "row", justifyContent: "space-evenly" }}>

                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ textAlign: "center", fontSize: RF(2.5) }}>What device are you using?</Text>
                        </View>

                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <CheckBox
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.isiPhone}
                                containerStyle={{ backgroundColor: "transparent" }}
                                onPress={() => this.handleiPhoneChoice()} />
                            <Text style={{ textAlign: "center" }}>iPhone</Text>
                        </View>

                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <CheckBox
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.isAndroid}
                                containerStyle={{ backgroundColor: "transparent" }}
                                onPress={() => this.handleAndroidChoice()} />
                            <Text style={{ textAlign: "center" }}>Android</Text>
                        </View>
                    </View>


                    <View style={{ flex: .6 }}>
                        <TextInput
                            placeholder="What do you want to say to me?"
                            multiline={true}
                            style={{
                                backgroundColor: "rgba(137, 132, 132, 0.1)", height: "100%", textAlignVertical: "top", fontSize: RF(2.5),
                                borderTopWidth: 1, borderTopColor: "#bfbfbf", paddingTop: 15, paddingLeft: 10
                            }}
                            numberOfLines={8}
                            onChangeText={(text) => this.handleBodyChange(text)}
                            returnKeyLabel="Done"
                            returnKeyType='done'
                            blurOnSubmit={true}
                            value={this.state.emailBody}
                        />
                    </View>

                    <View style={{ flex: .1, justifyContent: "center", alignItems: "center" }}>
                        <CustomButton text="Send Email"
                            onPress={() => this.sendEmail()}
                            buttonStyle={styles.buttonStyle}
                            textStyle={styles.buttonTextStyle}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
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

    textInput: {
        backgroundColor: "rgba(137, 132, 132, 0.1)", height: 40, width: "100%", textAlignVertical: "top", fontSize: RF(2),
        borderTopWidth: 1, borderTopColor: "#bfbfbf", borderBottomWidth: 1, borderBottomColor: "#bfbfbf",
        borderLeftColor: "#bfbfbf", borderLeftWidth: 1, borderRightWidth: 1, borderRightColor: "#bfbfbf",
        paddingLeft: 5, textAlignVertical: "center"
    }
});

//make this component available to the app
export default Help;
