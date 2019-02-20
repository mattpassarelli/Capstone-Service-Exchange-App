//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from "react-native-elements"

// create a component

/**
 * TODO: Pretty this up
 */

class Message extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Card>
                <View>
                    <Text>Username Here</Text>
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
