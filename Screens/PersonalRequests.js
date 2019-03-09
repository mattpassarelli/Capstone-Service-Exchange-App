//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import CustomButton from "../Components/CustomButton"
import { Card } from 'react-native-elements'
import RF from "react-native-responsive-fontsize"
import { AsyncStorage } from 'react-native';
import { API_ENDPOINT } from "../Components/api-config"

const apiEndpoint = API_ENDPOINT

// create a component
class PersonalRequests extends Component {

    constructor(props) {
        super(props)

        this.state = {
            fullName: "",
            email: "",
            socket: apiEndpoint,
            refreshing: false,
            requestsDataJSON: "",
            requests: []
        }
    }

    componentWillMount() {
        this.userFullName()
        this.userEmail()
    }

    componentDidMount(){
        this.state.socket.on("personalRequestsReceived", (data) => { this.setState({ requestsDataJSON: data }), this.processRequests() })
    }

    //Grab the full name from the phone's storage
    userFullName = async () => {
        try {
            await AsyncStorage.getItem("fullAccountName").then(async (value) => {
                console.log("Name: " + value)
                this.setState({
                    fullName: value
                })
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    //grab user email from phone storage
    userEmail = async () => {
        try {
            await AsyncStorage.getItem("userEmail").then((value) => {
                console.log("Email:" + value)
                this.setState({
                    email: value
                })
                this.state.socket.emit("requestPersonalRequests", (value))
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    processRequests = () => {
        this.setState({
            requests: []
        })

        if(this.state.requestsDataJSON.length > 0){
            console.log("Requests received: " + this.state.requestsDataJSON)

            var temp = []

            for(var i = 0; i < this.state.requestsDataJSON.length; i++){
                var newCard = (
                    <Card title={this.state.requestsDataJSON[i].title} subtitle={this.state.requestsDataJSON[i].subtitle}
                        posterName={this.state.requestsDataJSON[i].posterName} request_ID={this.state.requestsDataJSON[i]._id}
                        containerStyle={{borderRadius: 0, margin: 5, borderRadius: 10, backgroundColor: "rgb(249, 244, 244)"}} 
                        wrapperStyle={{}}
                        titleStyle={{fontSize: RF(2.5), fontWeight: "bold"}}
                        >
                        <Text style={{textAlign: "center", fontSize: RF(2)}}>{this.state.requestsDataJSON[i].subtitle}</Text>
                    </Card>
                )

                temp.push(newCard)
            }

            this.setState({
                requests: temp
            })

        }
        else {
            console.log("No requests for user. Or is DB connection bad?")
        }

        this.setState({
            refreshing: false
        })
    }

    refreshFeed = () => {
        this.setState({
            refreshing: true
        })

        console.log("Refreshing. Email: " + this.state.email)

        this.state.socket.emit("requestPersonalRequests", (this.state.email))

        this.setState({
            refreshing: false
        })
    }

    openOptions = (item) => {

    }

    render() {
        return (
            <ScrollView style={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshFeed} />
                }>
                {
                    this.state.requests.map((item, key) => {
                        if(this.state.requests.length > 0){
                            return (
                                <TouchableOpacity key={key} activeOpacity={0.7} onPress={() => this.openOptions(item)}>
                                    {item}
                                </TouchableOpacity>
                            )
                        }
                        else {
                            return (
                                <Text>You have no requests.</Text>
                            )
                        }
                    })
                }
            </ScrollView>
        );
    }

}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    buttonStyle: {
        padding: 10,
        backgroundColor: '#202646',
        borderRadius: 10,
        width: "80%",
    },

    buttonTextStyle: {
        fontSize: RF(2),
        color: '#ffffff',
        textAlign: 'center'
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
export default PersonalRequests;
