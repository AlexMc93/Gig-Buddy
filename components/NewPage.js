import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { firebase } from "firebase";
import { auth, firestore } from "../my-app/config/firbase";
import { loggingOut } from "../my-app/config/fireBaseMethods";
import ChatRoom from "../components/ChatRoom";
import ContactList from "../components/ContactList"


export default function NewPage({ navigation }) {
  let currentUserUID = auth.currentUser?.uid;
  
  const [firstName, setFirstName] = useState("");

  const handleLogOut = () => {
    loggingOut();
    navigation.navigate("Home");
  };
  useEffect(() => {
  
    async function getUserInfo() {
      let doc = await firestore
        .collection("users")
        .doc(currentUserUID)
        .get();

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
      }
    }
    getUserInfo();
  },[]);
  
  const chatsRef = firestore.collection("chats").doc("7COD5MpThDQB1XtBs6JOywn59h32");
  return (
    <View style={styles.container}>
      <Text>Hello {firstName}</Text>
      <Button title="log out" onPress={handleLogOut} />
      <Button title="Group Chat" onPress={()=>{
        navigation.navigate("GroupChat",{name:firstName,_id:currentUserUID})
      }} />
      <Button title="Join New Room" onPress={() => { navigation.navigate("GroupChat", {user: {name:firstName,_id:currentUserUID}, chatsRef})}} />
      <Button title="Contact List" onPress={() => {
         navigation.navigate("ContactList",{user:{name:firstName,_id:currentUserUID}})
      }}/>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    padding: 5,
    backgroundColor: "#ff9999",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 15,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#3FC5AB",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontStyle: "italic",
    marginTop: "2%",
    marginBottom: "10%",
    fontWeight: "bold",
    color: "black",
  },
  titleText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E6194",
  },
});
