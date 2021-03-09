import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Alert,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  getEventUsers,
  getUserInfo,
  toggleUserAtEvent,
  eventDocExists,
  createUserArrays,
} from "../config/fireBaseMethods";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import ChatRoom from "./ChatRoom.js";

export default class EventPage extends Component {
  state = {
    buddySeekers: [],
    attendees: [],
    mapShown: false
  };

  componentDidMount() {
    const { id } = this.props.route.params;

    // checks if the event is already in the db - if not there is no need to get the data as the arrays can stay empty
    Promise.resolve(eventDocExists(id)).then((exists) => {
      if (exists) {
        getEventUsers(id)
          .then((data) => {
            // gets a promise of full user info for the users in each array
            const buddySeekers = data.buddySeekers.map((uid) =>
              getUserInfo(uid)
            );
            const attendees = data.attendees.map((uid) => getUserInfo(uid));

            // lengths needed as we can't be sure how many of each there are
            const buddyLength = buddySeekers.length;
            const attendeesLength = attendees.length;

            // returns lengths and resolved promises with user info
            return Promise.all([
              attendeesLength,
              buddyLength,
              ...attendees,
              ...buddySeekers,
            ]);
          })
          .then((users) => {
            // if the length is zero set to empty array
            // if not use the length to get the right users into the right array
            // buddySeekers first as they are at the end of the users array

            const buddySeekers = users[1] === 0 ? [] : users.splice(-users[1]);
            const attendees = users[0] === 0 ? [] : users.splice(-users[0]);

            this.setState({ buddySeekers, attendees });
          })
          .catch((err) => {
            Alert.alert("Problem fetching data", err.message);
          });
      } else {
        // sets up the attendees and buddySeekers as empty arrays in the DB
        createUserArrays(id);
      }
    });
  }

  handlePress = (event) => {
    const { id } = this.props.route.params;
    const currentUid = this.props.app.currentUser.uid;

    // boolean - true only if user clicks buddy button and they are already in the buddySeekers array
    const isLookingForBuddy =
      event === "buddySeekers" &&
      this.state.buddySeekers.findIndex(
        (buddySeeker) => buddySeeker.uid === currentUid
      ) > -1;

    // boolean - true only if user clicks attending button and they are already in attendees array
    const isAttending =
      event === "attendees" &&
      this.state.attendees.findIndex(
        (attendee) => attendee.uid === currentUid
      ) > -1;

    // to reduce the full user info back down to just the uid
    const uidReducer = (users) => {
      return users.reduce((acc, cur) => {
        acc.push(cur.uid);
        return acc;
      }, []);
    };

    if (isLookingForBuddy || isAttending) {
      // optimistically re-render the list by filtering out the user and setting state
      const removedUser = this.state[event].filter(
        (user) => user.uid !== currentUid
      );
      this.setState({ [event]: removedUser }, () => {
        // use this updated list to update the correct event doc & list in the db
        toggleUserAtEvent(id, uidReducer(this.state[event]), event);
      });
    } else {
      this.setState(
        (currentState) => {
          // optimistically adds the user on to the appropriate list
          return {
            [event]: [...currentState[event], this.props.app.currentUser],
          };
        },
        () => {
          // adds user to the right event doc & list in the db
          toggleUserAtEvent(id, uidReducer(this.state[event]), event);
        }
      );
    }
  };

  handleMap = () => {
    this.setState((currentState) => {
      return {mapShown: !currentState.mapShown}
    })
  }

  render() {
    const {
      name,
      date,
      time,
      venue,
      postCode,
      image,
      location,
      id,
      genre,
      subGenre,
    } = this.props.route.params;
    const { attendees, buddySeekers, mapShown } = this.state;
    const { navigation } = this.props;
    const currentUid = this.props.app.currentUser.uid;

    const ListItem = ({ item }) => (
      <View style={styles.itemView}>
        <Text style={styles.itemText} onPress={() => navigation.navigate("Profile", item.uid)}>
          {item.userData.firstName} {item.userData.lastName.slice(0, 1)}
        </Text>
        {item.uid !== currentUid ? (
          <ChatRoom
            secondUserObject={{
              uid: item.uid,
              firstName: item.userData.firstName,
              contacts: item.userData.contacts,
            }}
            navigation={navigation}
            currentUser={{
              firstName: this.props.app.currentUser.userData.firstName,
              avatar: this.props.app.currentUser.userData.userAvatar,
              _id: currentUid,
              contacts: this.props.app.currentUser.userData.contacts,
            }}
          />
        ) : null}
      </View>
    );

    const buddyText = () => {
     const isClicked = buddySeekers.some((buddy) => buddy.uid === currentUid);

     if (isClicked) {
       return (
         <Text style={styles.buddyButtonText}>Not Looking For Buddy</Text>
       )
     } else {
       return (
         <Text style={styles.buddyButtonText}>Looking For Buddy</Text>
       )
     }
    }

    const attendingText = () => {
      const isClicked = attendees.some((attendee) => attendee.uid === currentUid);

      if (isClicked) {
        return (
          <Text style={styles.buddyButtonText}>I'm Not Attending</Text>
        )
      } else {
        return (
          <Text style={styles.buddyButtonText}>I'm Attending</Text>
        )
      }
    }



    return (
      <SafeAreaView style={styles.eventPage}>
        <View style={{flex: 1}}>
        <Text style={styles.eventName}>{name}</Text>

        <View style={styles.detailsView}>
        <Text style={styles.detailsSection}>
         <Text style={styles.eventDetails}>Venue: </Text> {venue}, {postCode}
        </Text>
        <Text style={styles.detailsSection}>
          <Text style={styles.eventDetails}>Date & Time: </Text>{date}, {time}
        </Text>
        <Text style={styles.detailsSection}> 
          <Text style={styles.eventDetails}>Genre: </Text>{genre} / {subGenre}
        </Text>
        </View>

        <View style={styles.touchableArea}>
          <TouchableHighlight onPress={() => this.handlePress("buddySeekers")}>
            <View style={styles.buddyButtons}>
              {buddyText()}
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.handlePress("attendees")}>
            <View style={styles.buddyButtons}>
              {attendingText()}
            </View>
          </TouchableHighlight>
        </View>
        <Image style={styles.image} source={{ uri: image }} />

        <TouchableHighlight onPress={this.handleMap} style={{alignSelf: 'center', paddingBottom: 5}}>
          <View style={styles.mapButton}>
            <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 17}}>Toggle Map View</Text>
          </View>
        </TouchableHighlight>

        </View>
        {mapShown ? 
          
          !location ? <Text>Sorry, no location data available for this gig</Text>
          : <MapView
          style={styles.map}
          region={{
            longitude: +location.longitude,
            latitude: +location.latitude,
            longitudeDelta: 0.005,
            latitudeDelta: 0.005,
          }}
          >
          <Marker
            image={require("../assets/mini-stratocaster.png")}
            key={id}
            coordinate={{
              latitude: +location.latitude,
              longitude: +location.longitude,
            }}
          />
          </MapView>

          :

          <View style={styles.lists}>

          <View style={styles.listTitles}>
          <Text style={{ fontWeight: "bold", marginRight: 15, fontSize: 18, textDecorationLine: 'underline' }}>Looking for a buddy: </Text>
          <Text style={{ fontWeight: "bold", marginLeft: 15, fontSize: 18, textDecorationLine: 'underline'  }}>Attending this gig: </Text>
          </View>

          <View style={styles.listItems}>

          <View style={styles.buddyList}>
          {buddySeekers.length ? 
          <FlatList
            styles={{ flex: 1 }}
            data={buddySeekers}
            renderItem={ListItem}
            keyExtractor={(item) => item.uid}
          />
          : <View style={styles.itemView}>
              <Text style={styles.itemTextBlank}>.</Text>
            </View>
          }
          </View>

          <View style={styles.attendeeList}>
          {attendees.length ? 
          <FlatList
            styles={{ flex: 1}}
            data={attendees}
            renderItem={ListItem}
            keyExtractor={(item) => item.uid}
          />
          : <View style={styles.itemView}>
              <Text style={styles.itemTextBlank}>.</Text>
            </View>
          }
          </View>

          </View>
          </View>
        
        }

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 224,
    height: 126,
    alignSelf: 'center',
    marginBottom: 10
  },
  map: {
    flex: 0.9,
    width: "100%",
    height: 200,
    marginBottom: 20
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 28,
    alignSelf: 'center'
  },
  eventPage: {
    backgroundColor: "#33e4ff",
    minHeight: Dimensions.get('window').height,
    flex: 1
  },
  eventDetails: {
    fontWeight: 'bold',
  },
  detailsSection: {
    textAlign: 'center',
    fontSize: 18
  },
  buddyButtons: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 178,
  },
  touchableArea: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
    paddingTop: 10
  },
  lists: {
    flex: 0.9,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    alignItems: 'center',
  },
  listTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5
  },
  listItems: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buddyList: {
    marginRight: 40
  },
  attendeeList: {
    marginLeft: 30
  },
  mapButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
  },
  itemView: {
    flexDirection: 'row', 
    paddingBottom: 10, 
    alignItems: 'center', 
    width: 140, 
    justifyContent: 'space-between'
  },
  itemText: {
    marginRight: 10, 
    fontWeight: 'bold', 
    fontSize: 16
  },
  itemTextBlank: {
    marginRight: 10,
    color: "#33e4ff"
  },
  buddyButtonText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16
  },
  detailsView: {
    width: "90%",
    alignSelf: 'center'
  }
});
