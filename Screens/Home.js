//import liraries
import React, { Component } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
//import RequestPopup from './RequestPopup'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import io from 'socket.io-client'

//window.navigator.userAgent = ("ReactNative")

const styles = StyleSheet.create(
    {
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

    const socket = io("https://uexchange-backend.herokuapp.com/", {transports: ['websocket']})

// create a component
class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            popupIsOpen: false,
            cardTitle: "",
            cardBody: ""
        }
    }



    componentDidMount() {
        console.log("Component Mounted")

        socket.on("connect", () => Alert.alert("connected"))
        socket.on("time", (timeString) => this.handleTestConnection(timeString))
        socket.on("_buttonReceived", (string) => this.handleTestConnection(string))
        socket.on('example', (data) => {
            console.log(data);
        
            socket.emit('my other event', { my: 'data' });
        });
    }


    handleTestConnection = (string) => {
        Alert.alert(string)
    }

    sendTestButton() {
        socket.emit("disconnect")
    }


    /**
     * Make a new Card for adding to the home feed. 
     * TODO add parameter so that we can pull title
     * and body texts
     */
    makeNewCard = (data) => {
        var newCard = (
            <Card title={data.title} subtitle={data.subtitle}>
                <Text>{data.subtitle}</Text>
            </Card>
        )

        var tempRequests = this.state.requests.slice()
        tempRequests.push(newCard)

        this.setState({
            requests: tempRequests
        })

        console.log("adding request. Requests is now " + this.state.requests.length)

        this.forceUpdate()
    }

    openRequest = (item) => {
        console.log(item.props.title)
        console.log(item.props.subtitle)
        this.setState({
            popupIsOpen: true,
            cardTitle: item.props.title,
            cardBody: item.props.subtitle,
        })
    }

    closeRequest = () => {
        this.setState({
            popupIsOpen: false,
        })
    }


    render() {


        var data = { title: "New Card Title", subtitle: "heh" }

        const gestureConfig = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView>
                        {
                            this.state.requests.map((item, key) => {
                                return (
                                     <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
                                    {/* <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.sendTestButton()}> */}

                                    <Card key={key} containerStyle={{ backgroundColor: 'green' }}>
                                        {item}
                                    </Card>
                                    </TouchableOpacity>
                    )
                })
            }
                    </ScrollView>
                </View>

                <View>
                    <Button title="Make Request" onPress={() => this.makeNewCard(data)}></Button>

                </View>

                <GestureRecognizer onSwipeDown={() => this.closeRequest()} config={gestureConfig}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.popupIsOpen}
                        onRequestClose={() => {
                            this.closeRequest()
                        }}>
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>{this.state.cardTitle}</Text>
                                <Text>{this.state.cardBody}</Text>
                            </View>
                        </View>
                    </Modal>
                </GestureRecognizer>


            </React.Fragment>
        );
    }
}

//make this component available to the app
export default Home;
