//import liraries
import React, { Component } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
//import RequestPopup from './RequestPopup'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { YellowBox } from 'react-native';
import { API_ENDPOINT } from "../Components/api-config"

console.ignoredYellowBox = ["Remote Debugger"]
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const apiEndpoint = API_ENDPOINT

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


// create a component
class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            popupIsOpen: false,
            cardTitle: "",
            cardBody: "",
            socket: apiEndpoint
        }
    }


    /**
     * Method is run when component mounts (duh)
     * This is where the majority of our server listens will be so things
     * can connect properly
     */
    componentDidMount() {
        console.log("Component Mounted")

        this.state.socket.on("connect", () => Alert.alert("connected"))
        this.state.socket.emit("requestRequests", (data) => this.addRequestsFromServer(data))
    }

    /**
     * Make a new Card for adding to the home feed. 
     * 
     * Data will contain, at the very least, a title prop
     * and a subtitle, prop. Possibly more later on (like date/time of posting, requester's first name)
     */
    makeNewCard = (data) => {
        var newCard = (
            <Card title={data.title} subtitle={data.subtitle}>
                <Text>{data.subtitle}</Text>
            </Card>
        )

        //Make a new array from the state and then add the new Card to it
        var tempRequests = this.state.requests.slice()
        tempRequests.push(newCard)

        //replace old array with the new one that has the New Request
        this.setState({
            requests: tempRequests
        })

        console.log("adding request. Requests is now " + this.state.requests.length)
    }

    //Displays the modal for clicking a Request
    openRequest = (item) => {
        console.log(item.props.title)
        console.log(item.props.subtitle)
        this.setState({
            popupIsOpen: true,
            cardTitle: item.props.title,
            cardBody: item.props.subtitle,
        })
    }

    //Closes the Request modal
    closeRequest = () => {
        this.setState({
            popupIsOpen: false,
        })
    }

    //Gathers the requests from the backend for adding into
    //the array of requests
    addRequestsFromServer = (data) => {

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
                            // Map the requests for proper display onto the main feed
                            this.state.requests.map((item, key) => {
                                return (
                                    <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openRequest(item)}>
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

                {/* The gesture recognition so we can swipe down to dismiss the modal */}
                <GestureRecognizer onSwipeDown={() => this.closeRequest()} config={gestureConfig}>

                    {/*Modal for the requests*/}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.popupIsOpen}
                        onRequestClose={() => {
                            this.closeRequest()
                        }}>
                        <View style={[{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 20,
                            backgroundColor: '#ecf0f1',
                        }, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                            <View style={{ backgroundColor: '#fff', padding: 20, height: "80%", width: "80%" }}>
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
