import * as api from "../config/ticketmaster";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
  Image
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

export default class EventList extends Component {

  state = {
    events: [],
    defaultRegion:
      Platform.OS === "android"
        ? {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 250,
            longitudeDelta: 250,
          }
        : {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
          },
    newRegion: {},
    errMsg: "",
    userInput: "",
    userLocation: {},
    radius: ""
  };

  componentDidMount() {
    api.getEvents().then((events) => {
      if (events.length) {
        const filteredEvents = this.filterEvents(events);

        const newRegion = {
          longitude: +filteredEvents[0].location.longitude,
          latitude: +filteredEvents[0].location.latitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        this.setState({ events: filteredEvents, newRegion });
      } else {
        this.setState({ errMsg: events.errMsg });
      }
    });
  }

  render() {
    const {
      events,
      defaultRegion,
      newRegion,
      errMsg,
      userInput,
      userLocation,
      radius
    } = this.state;

    return (
      <SafeAreaView style={styles.page}>

        <View style={styles.search}>

        <View style={styles.inputArea}>

        <TextInput
          style={styles.textInput}
          value={radius}
          placeholder='Search Radius (miles)'
          placeholderTextColor='black'
          onChangeText={(text) => this.setState({ radius: text })}
        />

        <TextInput
          style={styles.textInput}
          value={userInput}
          placeholder='City'
          placeholderTextColor='black'
          onChangeText={(text) => this.setState({ userInput: text })}
        />
        </View>

        <View style={styles.touchableArea}>
        <TouchableHighlight onPress={this.handleLocationSearch}>
          <View style={styles.nearMe}>
            <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>Events Near Me</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.handleSearch}>
          <View style={styles.nearMe}>
            <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>Manual Search</Text>
          </View>
        </TouchableHighlight>
        </View>

        </View>

        <MapView
          style={styles.map}
          region={newRegion.latitude ? newRegion : defaultRegion}
        >
          {userLocation.latitude ? (
            <Marker
              title="Your location"
              key="user"
              coordinate={userLocation}
              image={require("../assets/user-loc-pin.png")}
            />
          ) : null}
          {events.map((event) => {
            if (!event.location) return null
            else return (
              <Marker
                title={event.name}
                description={`${event.date}`}
                image={require("../assets/mini-stratocaster.png")}
                key={event.id}
                coordinate={{
                  latitude: +event.location.latitude,
                  longitude: +event.location.longitude,
                }}
                onCalloutPress={() => {
                  this.props.navigation.navigate(
                    "Event Details",
                    event,
                    this.props.navigation.navigate
                  );
                }}
              />
            );
          })}
        </MapView>
        <View style={{justifyContent: 'center', flex: 0.3, borderColor: 'grey', borderBottomWidth: 1, borderTopWidth: 1}}>
            <Image source={require('../assets/events-title.png')} style={styles.eventTitle} />
        </View>
        <ScrollView style={styles.container}>
          {errMsg ? (
            <View style={styles.eventText}>
              <Text>{errMsg}</Text>
            </View>
          ) : (
            events.map((event) => {
              return (
                <View key={event.id} style={styles.eventText}>
                  <Text style={{textAlign: 'center', fontSize: 16}}>
                    <Text style={styles.eventName}>{event.name}</Text> {"\n"}
                    <Text style={{fontWeight: 'bold'}}>Date: </Text>{event.date} {"\t"} <Text style={{fontWeight: 'bold'}}>Start Time: </Text>{event.time}
                    {"\n"}
                    <Text style={{fontWeight: 'bold'}}>Venue: </Text>{event.venue}
                  </Text>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Event Details", event)}>
                    <View style={styles.findBuddy}>
                      <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 17}}>Find A Gig Buddy!</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  handleLocationSearch = () => {
    this.getUserLocation().then(() => {
      const { latitude, longitude } = this.state.userLocation;

      api.getEventsNearUser(latitude, longitude).then((events) => {
        if (events.length) {
          const filteredEvents = this.filterEvents(events);

          const newRegion = {
            longitude: +filteredEvents[0].location.longitude,
            latitude: +filteredEvents[0].location.latitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          };
          this.setState({ events: filteredEvents, newRegion, radius: ''});
        } else {
          this.setState({ errMsg: events.errMsg, radius: ''});
        }
      });
    });
  };

  handleSearch = () => {
    const { userInput } = this.state;

    api.getEvents(userInput).then((events) => {
      if (events.length) {
        const filteredEvents = this.filterEvents(events);

        const newRegion = {
          longitude: +filteredEvents[0].location.longitude,
          latitude: +filteredEvents[0].location.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        this.setState({ events: filteredEvents, newRegion, userInput: "" });
      } else {
        this.setState({ errMsg: events.errMsg, userInput: "" });
      }
    });
  };

  filterEvents = (events) => {
    const noPrime = events.filter((event) => !event.name.includes("Prime"));
    const noVip = noPrime.filter((event) => !event.name.includes("VIP"));
    const extraNoVip = noVip.filter((event) => !event.name.includes("Vip"));
    const noHotels = extraNoVip.filter(
      (event) => !event.name.includes("Hotel")
    );
    const filteredEvents = noHotels.filter(
      (event) => !event.name.includes("Premium")
    );

    return filteredEvents;
  };

  getUserLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== "granted") {
        Alert.alert("You must grant permission to use this feature");
      } else {
        const location = await Location.getCurrentPositionAsync();

        this.setState({
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    } catch (err) {
      const status = Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        Alert.alert("Please enable location services to use this feature");
      } else {
        Alert.alert("Problem getting location", err.message);
      }
    }
  };
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: '#33e4ff',
  },
  container: {
    flex: 1,
    zIndex: 0
  },
  map: {
    flex: 1,
  },
  eventText: {
    marginBottom: 25,
    flex: 1,
    width: "100%",
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 25,
  },
  search: {
    flexDirection: 'column',
    padding: 5,
    margin: 5,
    justifyContent: 'space-evenly',
    marginLeft: 15,
    marginRight: 15
  },
  nearMe: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
    height: 50,
    justifyContent: 'center'
  },
  textInput: {
    backgroundColor: '#b3f5ff',
    width: 150,
    textAlign: 'center',
    borderRadius: 10,
    height: 50
  },
  touchableArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4
  },
  eventTitle: {
    position: 'absolute',
    top: -15,
    left: 115,
    height: 100,
    width: 150,
    resizeMode: 'contain',
    zIndex: 500
  },
  findBuddy: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
    height: 38,
    alignSelf: 'center'
  }
});
