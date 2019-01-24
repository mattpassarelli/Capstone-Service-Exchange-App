//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import RequestPopup from './RequestPopup'

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
        }
    }

    /**
     * Make a new Card for adding to the home feed. 
     * TODO add parameter so that we can pull title
     * and body texts
     */
    makeNewCard = () => {
        var newCard = (
            <Card title="New Card">
                <Text>
                    This will be a request, wow!
                </Text>
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

    openRequest = (request) => {
        this.setState({
            popupIsOpen: true,
            request,
        })
    }

    closeRequest = () => {
        this.setState({
            popupIsOpen: false,
        })
    }


    render() {
        return (

            <React.Fragment>

                <View style={styles.container}>

                    <ScrollView>
                        {
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

                    <RequestPopup
                        isOpen={this.state.popupIsOpen}
                        onClose={this.closeRequest}
                    />
                </View>

                <View>
                    <Button title="Make Request" onPress={() => this.makeNewCard()}></Button>

                </View>

            </React.Fragment>
        );
    }
}

//make this component available to the app
export default Home;
