//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Picker } from 'react-native';


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
class NewRequest extends Component {

    constructor(props)
    {
        super(props)

        this.state = {
            selectedItem: "Select a Request"
        }
    }

    render() {
        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView contentContainerStyle={ScrollStyle.container}>
                    <Text>Pick one below</Text>
                        <Picker 
                        selectedValue={this.state.selectedItem}
                        onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectedItem: itemValue})}
                        style={{height: 40, width: 200}}
                        >
                        <Picker.Item label="option one" value="option one"/>
                        <Picker.Item label="option two" value="option two"/>
                        </Picker>
                    </ScrollView>
                </View>
            </React.Fragment>
        );
    }
}

//make this component available to the app
export default NewRequest;
