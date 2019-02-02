//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Card } from 'react-native-elements'
import Picker from 'react-native-universal-picker'
import RF from "react-native-responsive-fontsize"
import CustomButton from "../Components/CustomButton"
import { API_ENDPOINT } from "../Components/api-config"
import io from "socket.io-client"


const apiEndpoint = API_ENDPOINT

//const socket = io(, { transports: ['websocket'] })
const socket = io(apiEndpoint, { transports: ["websocket"] });

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start"
    },

    buttonStyle: {
        padding: 10,
        backgroundColor: '#202646',
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

    constructor(props) {
        super(props)

        this.state = {
            selectedItem: "",
            requestDescription: "",
            isPreviewOpen: false,
        }
    }

    componentDidMount() {

    }

    //Handles selection from the Picker for title
    handlePickerChange = (itemValue, itemIndex) => {
        this.setState({
            selectedItem: itemValue,
        })
    }

    //Handles text input in the textInput for requestDescription
    handleDescriptionChange = (text) => {
        this.setState({
            requestDescription: text
        })
    }

    //Opens preview modal
    openPreview() {

        var checked = this.checkForEmptyStates()

        if (checked) {
            this.setState({
                isPreviewOpen: true
            })
        }
        else {
            Alert.alert("Please fill in all fields")
        }
    }

    //closes preview modal
    closePreview() {
        this.setState({
            isPreviewOpen: false
        })
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

        var data = { title: this.state.selectedItem, subtitle: this.state.requestDescription, posterID: 0 }

        socket.emit("saveRequest", data)

        this.closePreview()

        this.setState({
            selectedItem: "",
            requestDescription: ""
        })
    }

    render() {

        return (

            <React.Fragment>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                            <Text style={{ paddingTop: 15, fontSize: RF(2.5) }}>Select a Request...</Text>

                            <View style={{ backgroundColor: "rgba(137, 132, 132, 0.1)", height: 50, width: "50%", borderRadius: 10, borderWidth: .25 }}>
                                <Picker
                                    selectedValue={this.state.selectedItem}
                                    onValueChange={this.handlePickerChange}
                                    style={{ alignItems: 'center', justifyContent: "center" }}
                                    prompt="Select a Request Type">

                                    <Picker.Item label="java" value="java" />
                                    <Picker.Item label="JS" value="js" />

                                </Picker>
                            </View>

                        </View>

                        <View style={{ flex: 2, }}>

                            <View style={{ position: "absolute", backgroundColor: "transparent", top: 0, bottom: 0, left: "84.5%", right: 0, zIndex: 0 }}>
                                <Text style={{ color: "rgba(137, 132, 132, 0.5)" }}>{this.state.requestDescription.length}/100</Text>
                            </View>

                            <TextInput placeholder="Type a description..." multiline={true}
                                style={{
                                    backgroundColor: "rgba(137, 132, 132, 0.1)", height: "100%", textAlignVertical: "top", fontSize: RF(2.5),
                                    borderTopWidth: 1, borderTopColor: "#bfbfbf", paddingTop: 15, paddingLeft: 10
                                }}
                                onChangeText={(text) => this.handleDescriptionChange(text)}
                                maxLength={100}
                                numberOfLines={8}
                                returnKeyType="done"
                                blurOnSubmit={true}
                            />
                        </View>

                        <View style={{ flex: .5, justifyContent: "center", paddingRight: 10, paddingLeft: 10 }}>
                            <CustomButton text="Preview Button" onPress={() => this.openPreview()} buttonStyle={styles.buttonStyle}
                                textStyle={styles.buttonTextStyle} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>


                <Modal animationType="slide" transparent={true} visible={this.state.isPreviewOpen} onRequestClose={() => this.closePreview()}>
                    <View style={[{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 20,
                        backgroundColor: '#ecf0f1',
                    }, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>

                        <View style={{ backgroundColor: '#fff', padding: 20, height: "50%", width: "80%" }}>
                            <View style={{ flex: 1 }}>
                                <Card title={this.state.selectedItem} subtitle={this.state.requestDescription}>
                                    <Text>{this.state.requestDescription}</Text>
                                </Card>
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

                </Modal>


            </React.Fragment>
        );
    }
}

//make this component available to the app
export default NewRequest;
