//import liraries
import React, { Component } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements'
//import RequestPopup from './RequestPopup'
import GestureRecognizer from 'react-native-swipe-gestures';
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
            requestsDataJSON: "",
            popupIsOpen: false,
            cardTitle: "",
            cardBody: "",
            cardPoster: "",
            socket: apiEndpoint,
            refreshing: false
        }
    }


    /**
     * Method is run when component mounts (duh)
     * This is where the majority of our server listens will be so things
     * can connect properly
     */
    componentDidMount(){
        console.log("Component Mounted")
        this.state.socket.on("requestData", (data) => { this.setState({ requestsDataJSON: data }), this.addRequestsFromServer() })
    }
    
    componentWillMount(){
        this.state.socket.emit("requestRequests") 
    }
    

    //Displays the modal for clicking a Request
    openRequest = (item) => {
        console.log(item.props.title)
        console.log(item.props.subtitle)
        this.setState({
            popupIsOpen: true,
            cardTitle: item.props.title,
            cardBody: item.props.subtitle,
            cardPoster: item.props.posterName
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
    addRequestsFromServer = () => {

        console.log("Gotten Request data from server")

        this.setState({
            requests: []
        })

        if (this.state.requestsDataJSON.length > 0) {
            //console.log(this.state.requestsDataJSON)
            var tempRequests = []


            for (var i = 0; i < this.state.requestsDataJSON.length; i++) {
               // console.log("Adding request " + i + " to array of requests")
                var newCard = (
                    <Card title={this.state.requestsDataJSON[i].title} subtitle={this.state.requestsDataJSON[i].subtitle} 
                    posterName={this.state.requestsDataJSON[i].posterName}>
                        <Text>{this.state.requestsDataJSON[i].subtitle}</Text>
                    </Card>
                )

                tempRequests.push(newCard)
            }

            this.setState({
                requests: tempRequests
            })

            //console.log("Finished adding requests. Total is now: " + this.state.requests.length)

        }
        else {
            console.log("No requests in DB. Or is connection bad?")
        }
    }

    /**
     * Method is called when refreshControl is activated
     * Meaning that whenever you pull down to refresh, this 
     * is what is called
     */
    refreshFeed = () => {
        console.log("Refreshing requestsDataJSON")

        /**
         * Clear requests (in case they've all been deleted lol),
         * Then pull in all of the requests again
         */
        this.setState({
            refreshing: true
        })

        this.state.socket.emit("requestRequests", (data) => { this.setState({ requestsDataJSON: data }) })

        console.log("Data received from server is: " + this.state.requestsDataJSON)

        this.setState({
            refreshing: false
        })

        console.log("Done Refreshing JSON")
        this.addRequestsFromServer()
    }

    render() {

        const gestureConfig = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                        }>
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
                            <View style={{ backgroundColor: '#fff', padding: 20, height: "80%", width: "80%", borderRadius: 10 }}>
                                <Text>{this.state.cardTitle}</Text>
                                <Text>{this.state.cardBody}</Text>
                                <Text style={{position: "absolute", right: 5, bottom: 5,}}>Posted by: {this.state.cardPoster}</Text>
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
