import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { firestore } from "../config/firebase";
import ChatRoom from "../components/ChatRoom";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ContactList(props) {
  //we only get the uid from props
  const uid = props.user.uid;

  //sets contacts in state to the contacts in the current user object
  //sets currentUser is state to the freshest data possible to make sure we display the updated contact list
  useEffect(() => {
    async function getUserData() {
      const doc = await firestore.collection("users").doc(uid).get();
      const currentUser = doc.data();
      setContacts(currentUser.contacts);
      SetCurrentUser(currentUser);
    }
    getUserData();
  }, []);

  //array of user's contacts + currentUser object.
  const [userContacts, setContacts] = useState([]);
  const [currentUser, SetCurrentUser] = useState({});
  const { navigation } = props;

  //Creates a list of contacts with a message me button to access/create chatroom
  const renderUser = ({ item }) => {
    return (
      <View style={styles.row}>

        <TouchableOpacity style={styles.opacity} onPress={() => navigation.navigate("Profile", item.uid)}>
        <Image style={styles.avatar} source={{uri:item.userAvatar}} />
        <Text style={styles.name}>{item.firstName}</Text>      
        </TouchableOpacity>

        <ChatRoom style={styles.addUser}
         sizeChange={true}
         currentUser={{
            firstName: currentUser.firstName,
            _id: uid,
            contacts: userContacts,
          }}
          secondUserObject={item}
          navigation={navigation}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor:"#33e4ff"}}>
      <Text style={{alignSelf:"center", fontSize: 36, fontWeight: "bold", textDecorationLine: "underline"}}>Messages</Text>
      <FlatList
        data={userContacts}
        renderItem={renderUser}
        keyExtractor={(item) => item.uid.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 65,
    height: 65,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 100
  },
  row: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#cacaca",
    borderBottomWidth: 1,
    justifyContent: "space-between",
    paddingLeft: "10%",
    paddingRight: "10%",
    paddingBottom: 30,
    paddingTop: 30,

  },
  input: {
    backgroundColor: "#cacaca",
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
  opacity: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    marginLeft: 20
  },
  name: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
    marginLeft: 10
  }
});
