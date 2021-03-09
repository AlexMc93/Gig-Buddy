import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { firestore } from "../config/firebase";

export default function ChatRoom(props) {
  const { navigation } = props;
  const { currentUser } = props;
  const {sizeChange} = props;
  const firstName = currentUser.firstName;
  const _id = currentUser._id;
  const { secondUserObject } = props;
  const secondUserUid = secondUserObject.uid;
  const currentUserContacts = currentUser.contacts;
  const secondUserContacts = secondUserObject.contacts;

  //chatrooms of the connected user and of the second User
  const [chatRoomsCurrentUser, setChatroomsCurrentUser] = useState([]);
  const [chatroomsSecondUser, setChatroomsSecondUser] = useState([]);
  //Room in common or not of the two users
  const [Room, setRoom] = useState("room not found");
  //Objects to add in contacts arrays
  const [currentUserObj, setCurrentUserObj] = useState({
    uid: _id,
    firstName: currentUser.firstName,
    userAvatar: ""
  });
  const [secondUserObj, setSecondUserObj] = useState({
    uid: secondUserUid,
    firstName: secondUserObject.firstName,
    userAvatar: ""
  });
  //avatar url held in state to pass down as props
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    //we get all the chatrooms of the connected user
    async function getUserData() {
      let doc = await firestore.collection("users").doc(currentUser._id).get();

      let dataObj = doc.data();
      setChatroomsCurrentUser(dataObj.chatrooms);
      setAvatar(dataObj.userAvatar);
      setCurrentUserObj({uid: _id,
        firstName: currentUser.firstName, userAvatar : dataObj.userAvatar});
    }
    //we get all the chatrooms of the second user
    async function getSecondUserData() {
      let doc = await firestore.collection("users").doc(secondUserUid).get();
      let dataObj = doc.data();
      setChatroomsSecondUser(dataObj.chatrooms);
      setSecondUserObj({uid: secondUserUid,
        firstName: secondUserObject.firstName, userAvatar : dataObj.userAvatar});
    }
    getUserData();
    getSecondUserData();
  }, []);

   //Function matching the shared chatroom between the two users if it exists. 
  //If so, it updates the Room key in state - if not, it remains "room not found"
  const matchUsersRooms = (chatRoomsCurrentUser, chatroomsSecondUser) => {
    for (let i = 0; i < chatRoomsCurrentUser.length; i++) {
      if (Room === "room not found" && chatRoomsCurrentUser.length) {
        for (let j = 0; j < chatroomsSecondUser.length; j++) {
          if (chatRoomsCurrentUser[i] === chatroomsSecondUser[j]) {
            const room = chatRoomsCurrentUser[i];
            setRoom(room);
          }
        }
      } else {
        break;
      }
    }
    return;
  };

  matchUsersRooms(chatRoomsCurrentUser, chatroomsSecondUser);

  //handles event when button "message me!" is pressed. 
  //Conditional logic: 
  //either there is a shared room, and it takes the user to that room
  //or there is no room and it creates it then navigates there.
  const handlePress = () => {
        //sets the reference inside of the firestore database
    const chatsRef = firestore.collection("chats");

    if (Room === "room not found") { 
      //add two users ids together  and save it as room-name ;
      const newRoom = _id + secondUserUid;

      //updates the users chatrooms array with a new chatroom, and their contact list with a new contact.
      async function updateUsers(
        chatRoomsCurrentUser,
        secondUserUid,
        currentUserContacts,
        secondUserContacts,
        chatroomsSecondUser
      ) {
        //copying existing chatrooms and contacts
        const updatedChatRoomsCurrentUser = [...chatRoomsCurrentUser];
        const updatedChatRoomsSecondUser = [...chatroomsSecondUser];
        const updatedUserContacts = [...currentUserContacts];
        const updatedSecondUserContacts = [...secondUserContacts];

         //pushing the newRoom inside of those arrays
        updatedChatRoomsCurrentUser.push(newRoom);
        updatedChatRoomsSecondUser.push(newRoom);
        //pushing the new contact inside of those arrays
        updatedUserContacts.push(secondUserObj);
        updatedSecondUserContacts.push(currentUserObj);

        const currentUserRef = firestore.collection("users").doc(_id);
        const res1 = await currentUserRef.update({
          chatrooms: updatedChatRoomsCurrentUser,
          contacts: updatedUserContacts,
        });
        const secondUserRef = firestore.collection("users").doc(secondUserUid);
        const res2 = await secondUserRef.update({
          chatrooms: updatedChatRoomsSecondUser,
          contacts: updatedSecondUserContacts,
        });
      }
      updateUsers(
        chatRoomsCurrentUser,
        secondUserUid,
        currentUserContacts,
        secondUserContacts,
        chatroomsSecondUser
      );
      
      //creating and navigating to the appropriate room 
      chatsRef.doc(newRoom).set({});
      const chatsRefPassed = firestore.collection("chats").doc(newRoom);
      navigation.navigate("GroupChat", {
        user: { name: firstName, _id, avatar },
        chatsRef: chatsRefPassed,
      });
    } else {
      //navigating to the appropriate room.
      chatsRef.doc(Room).set({});
      const chatsRefPassed = firestore.collection("chats").doc(Room);
      navigation.navigate("GroupChat", {
        user: { name: firstName, _id, avatar },
        chatsRef: chatsRefPassed,
      });
    }
  };

  return (
      <TouchableHighlight onPress={handlePress}>
        <View style={sizeChange ? styles.bigButton :styles.chatButton}>
          <Text style={sizeChange ? styles.bigText :styles.text}>Chat</Text>
        </View>
      </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
  },
  bigButton:{
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
  
  },
  text:{
    fontWeight: 'bold', color: 'white', fontSize: 14
  },
  bigText:{
    fontWeight: 'bold', color: 'white', fontSize: 25, paddingLeft: 10,paddingRight: 10,
  }
})
