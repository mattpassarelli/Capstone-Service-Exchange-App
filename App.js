import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerItems } from 'react-navigation'
import Home from './Screens/Home'
import Settings from './Screens/Settings'
import Account from './Screens/Account'
import { Avatar } from 'react-native-elements'


const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', height: 80 }}>
      <Avatar size={125} rounded title="MP" />
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)

const StackNavigator = createStackNavigator({
  Account: Account
})

const AppDrawerNavigator = createDrawerNavigator({
  Home: Home,
  Account: Account,
  Settings: Settings,
},
  {
    contentComponent: CustomDrawerComponent,
    // contentOptions: {
    //   activeTintColor: 'orange'
    // }
  })

export default class App extends React.Component {
  render() {
    return (
      <StackNavigator /> ,
      <AppDrawerNavigator />
    );
  }
}