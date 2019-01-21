import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation'
import Home from './Screens/Home'
import Settings from './Screens/Settings'


const CustomDrawerComponent = (props) => (
  <ScrollView contentContainerStyle={{ flex: 1, flexDirection: "column", justifyContent: 'space-between' }}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
)

const AppDrawerNavigator = createDrawerNavigator({
  Home: Home,
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
      <AppDrawerNavigator />
    );
  }
}