//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import Picker from 'react-native-universal-picker'
import RF from "react-native-responsive-fontsize"


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start"
    },
});

// create a component
class NewRequest extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            selectedItem: "",
            requestDescription: "",
        }
    }

    componentDidMount() {

    }

    handlePickerChange = (itemValue, itemIndex) => {
        this.setState({
            selectedItem: itemValue,
        })
    }

    handleDescriptionChange = (text) => {
        this.setState({
            requestDescription: text
        })
    }

    render() {

        return (

            <React.Fragment>

                <View style={styles.container}>

                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                        <Text style={{ paddingTop: 15, fontSize: RF(2.5) }}>Select a Request...</Text>

                        <View style={{ backgroundColor: "rgba(137, 132, 132, 0.1)", height: 50, width: "50%", borderRadius: 15, borderWidth: .25 }}>
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
                            numberOfLines={8} />
                    </View>

                    <View style={{ flex: .5 }}>
                        <Text>Temp placement for preview button</Text>
                    </View>

                    <View style={{}}></View>
                </View>
            </React.Fragment>
        );
    }
}

//make this component available to the app
export default NewRequest;
