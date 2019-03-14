//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import RF from "react-native-responsive-fontsize"


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 40
    },
    option: {
        justifyContent: "space-between",
        flexDirection: "row", backgroundColor: "rgb(255,255,255)",
        padding: 10, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "rgb(202, 202, 206)",
        borderBottomColor: "rgb(202, 202, 206)", alignItems: "center"
    }
});

const ScrollStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


// create a component
class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            darkMode: false
        }
    }

    toggleDarkMode = (value) => {

        this.setState({
            darkMode: value
        })
        console.log("DARK MODE STATE IS NOW: " + value)
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <View style={styles.option}>
                    
                        <Text style={{ textAlign: "center", fontSize: RF(2.5), justifyContent: "center" }}>Dark Mode</Text>

                        <Switch
                            value={this.state.darkMode}
                            onValueChange={(value) => this.toggleDarkMode(value)}
                            style={{ transform: [{ scaleX: .9 }, { scaleY: .9 }] }} />
                    </View>

                    <View style={styles.option}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate("TOS")}>
                            <Text style={{ textAlign: "center", fontSize: RF(2.5) }}>View Terms of Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        );
    }
}

//make this component available to the app
export default Settings;
