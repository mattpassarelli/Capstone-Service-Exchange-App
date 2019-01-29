//import liraries
import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import Picker from 'react-native-universal-picker'
import RF from "react-native-responsive-fontsize"

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});

const ScrollStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


// create a component
class NewRequest extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            selectedItem: "",
        }
    }

    componentDidMount() {

    }

    handleValueChange = (itemValue, itemIndex) => {
        this.setState({
            selectedItem: itemValue,
        })
    }


    render() {

        return (

            <React.Fragment>

                <View style={styles.container}>

                    <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around"}}>
                        <Text style={{paddingTop:15, fontSize: RF(2.5)}}>Select a Request...</Text>
                        
                            <Picker
                                selectedValue={this.state.selectedItem}
                                onValueChange={this.handleValueChange}
                                style={{ backgroundColor: "rgba(137, 132, 132, 0.1)" , height: 50, width: "50%", alignContent: 'center', justifyContent: "center"}}
                                prompt="Select a Request Type"
                            >

                                <Picker.Item label="java" value="java" />
                                <Picker.Item label="JS" value="js" />

                            </Picker>
                        
                    </View>

                    <View style={{}}></View>
                </View>
            </React.Fragment>
        );
    }
}

//make this component available to the app
export default NewRequest;
