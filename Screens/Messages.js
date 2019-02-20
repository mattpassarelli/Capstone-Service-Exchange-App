//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Message from "../Components/Message"
import { withNavigation } from "react-navigation"

// create a component
class Messages extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate("Thread")}>
                    <Message />
                </TouchableOpacity>
                <Message />
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
