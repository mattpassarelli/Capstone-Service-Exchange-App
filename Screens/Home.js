//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, Left, Body, Right, Icon, Title } from 'native-base';

// create a component
class Home extends Component {

    makeNewRequest = () => {
        Alert.alert("Placeholder for now :)!")
    }

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="home" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header> 
                    <Left style={{ flex: 1, paddingLeft: 5 }}>
                        <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                    </Left>

                    <Body style={{flex: 3}}>
                        <Title>Home</Title>
                    </Body>

                    <Right style={{flex: 1}}>
                        <Icon name="swap" onPress={() => this.makeNewRequest()}/>
                    </Right>

                </Header>
                <ScrollView contentContainerStyle={ScrollStyle.container}>
                    <Text>Home</Text>
                </ScrollView>
            </View>
        );
    }
}

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

//make this component available to the app
export default Home;
