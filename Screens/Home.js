//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';


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
class Home extends Component {
    
    render() {
        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView contentContainerStyle={ScrollStyle.container}>
                        <Text>Hello World</Text>
                    </ScrollView>
                </View>
            </React.Fragment>
        );
    }
}

//make this component available to the app
export default Home;
