import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInUp from "./components/SignInUp";
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Image, Dimensions } from "react-native";
import EventList from "./components/EventList";
import EventPage from "./components/EventPage";
import Profile from "./components/Profile";
import { loggingOut, getUserInfo } from "./my-app/config/fireBaseMethods";
import * as firebase from "firebase";
import "firebase/auth";
import GroupChat from "./components/GroupChat";
import { TouchableOpacity } from "react-native-gesture-handler";
import ContactList from "./components/ContactList";

const Stack = createStackNavigator();

export default class App extends Component {
  state = {
    isLoggedIn: false,
    currentUser: {},
  };

  handleLogIn = () => {
    const uid = firebase.auth().currentUser.uid;
    Promise.resolve(getUserInfo(uid)).then((userInfo) => {
      this.setState({ isLoggedIn: true, currentUser: { uid, ...userInfo } });
    });
  };

  handleLogOut = () => {
    loggingOut();
    this.setState({ isLoggedIn: false, user: "" });
  };

  render() {

    return (
      <NavigationContainer>

      {/* Default header on all screens unless overwritten lower down*/}
        <Stack.Navigator screenOptions={
        ({navigation})=>({
          headerStyle: { backgroundColor: '#33e4ff', borderBottomColor: 'grey', borderBottomWidth: 1},
          headerLeft: () => 
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} >
            <Image style={styles.backImage} source={require('./my-app/assets/back-button.png')} />
            </TouchableOpacity>,
          headerTitle: () => 
            <TouchableOpacity onPress={() => navigation.navigate("Events")} style={styles.logoOpacity}>
              <Image style={styles.miniLogo} source={require('./my-app/assets/mini-logo.png')}/>
            </TouchableOpacity>,
          headerTitleAlign: 'center',
          headerRight: () => (
          <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("ContactList")}>
            <View style={styles.navButton}>
            <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>Messages</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.navButton}>
            <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>Profile</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => { 
            navigation.navigate("Home")
            this.handleLogOut()
            }}
          >
            <View style={styles.navButton}>
            <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>Log Out</Text>
            </View>
          </TouchableOpacity> 
          </View>
          ),
          headerRightContainerStyle: {flexDirection: "row", marginBottom: 15, justifyContent: 'space-evenly'},
          headerMode: 'screen'
        })}>

          {/* No header on home screen*/}
          <Stack.Screen name={"Home"} options={{headerShown: false}}>
            {(props) => (
              <SignInUp
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          {/* Disables back button onPress on events screen to prevent user accidentally logging out */}
          <Stack.Screen name={"Events"} options={
            {headerLeft: () => 
            <TouchableOpacity>
            <Image style={styles.backImage} source={require('./my-app/assets/back-button.png')} />
            </TouchableOpacity>,}}
            >
            {(props) => (
              <EventList
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={"Event Details"}
            options={({ route }) => ({ title: route.params.name })}
          >
            {(props) => (
              <EventPage
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name={"Profile"}>
            {(props) => (  
              <Profile
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name={"GroupChat"} component={GroupChat}></Stack.Screen>

          <Stack.Screen name={"ContactList"}>
            {(props) => (
              <ContactList {...props} user={this.state.currentUser} />
            )}
          </Stack.Screen>
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
    backButton: {
      paddingBottom: 10,
      paddingLeft: 5
    },
    backImage: {
      height: 60,
      width: 60
    },
    miniLogo: {
      height: 70,
      width: 70,
      resizeMode: 'contain'
    },
    logoOpacity: {
      paddingBottom: 110
    },
    headerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: Dimensions.get('window').width - 55
    },
    navButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 10,
      borderColor: '#991400',
      borderWidth: 1,
      width: 100
    }
})
