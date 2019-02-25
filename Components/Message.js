//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from "react-native-elements"
import RF from "react-native-responsive-fontsize"

// create a component

class Message extends React.Component {

    render() {

        const {userNameTitle, requestType} = this.props

        return (
            <Card>
                <View>
                    <Text style={{fontSize: RF(2)}}>{userNameTitle}</Text>
                    <Text style={{fontSize: RF(1.5)}}>{requestType}</Text>
                </View>
            </Card>
        );
    }
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default Message;
