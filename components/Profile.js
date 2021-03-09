import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import DialogInput from "react-native-dialog-input";
import { firestore } from "../config/firebase";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { getUserInfo } from '../config/fireBaseMethods';

export default function App(props) {
  const { app } = props;
  const [avatar, setAvatar] = useState(
    "https://image.freepik.com/free-vector/sitting-man-playing-guitar_24877-62236.jpg"
  );
  const [addBio, setAddBio] = useState(true);
  const [bio, onChangeText] = useState("");
  const [haveBio, setHaveBio] = useState(false);
  const [dialogVisible, isDialogVisible] = useState(false);
  const [imageChange, setImageSave] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const userUid = firebase.auth().currentUser.uid;

  let readOnlyProfile;

  if (app.currentUser.uid === props.route.params) {
    readOnlyProfile = false;
  } else {
    readOnlyProfile = true;
  }
 
  const user = { userAvatar: avatar, userBio: bio };

  const handlePress = () => {
    setAddBio(false);
    setHaveBio(true);
    const res = firestore.collection("users").doc(userUid).update(user);
  };
  const handleEdit = () => {
    setAddBio(true);
    setHaveBio(false);
  };

  const handleImageChange = () => {
    isDialogVisible(true);
    setImageSave(true);
  };

  const handleImageConfirm = () => {
    const res = firestore.collection("users").doc(userUid).update(user);
    setImageSave(false);
  };

  useEffect(() => {

    Promise.resolve(getUserInfo(props.route.params))
      .then(({userData}) => {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);

        if (userData.userAvatar && userData.userBio !== undefined) {
          setAvatar(userData.userAvatar);
          onChangeText(userData.userBio);
          setHaveBio(true);
          setAddBio(false);
        }
      })
  }, []);

  return !readOnlyProfile ? (
    <View style={styles.container}>

      <View style={{alignItems: 'center'}} >
      <Image
        style={styles.avatar}
        source={{ height: 180, width: 180, uri: avatar }}
      />
      <TouchableHighlight
        onPress={handleImageChange}  
      >
        <View style={styles.button}>
          <Text  style={styles.buttonText}>Change Image</Text>
        </View>
      </TouchableHighlight>

      {imageChange === true && (
        <>
        <Text>{"\n"}</Text>
        <TouchableHighlight
          onPress={handleImageConfirm}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirm Image</Text>
          </View>
        </TouchableHighlight>
        </>
      )}
      </View>
        
      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>
      {addBio && (
        <>
          <TextInput
            style={styles.inputbox}
            multiline
            numberOfLines={10}
            onChangeText={(text) => onChangeText(text)}
            value={bio}
          />
          {bio.length > 1 && (
            <TouchableHighlight
              onPress={handlePress}
              style={styles.buttonBioContainer}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Submit Bio</Text>
              </View>
            </TouchableHighlight>
          )}
        </>
      )}
      {haveBio && (
        <>
          <View style={styles.aboutMeContainer}>
            <Text style={styles.aboutMeTitle}>About Me</Text>
            <Text style={styles.aboutMe}>{bio}</Text>
          </View>
          <TouchableHighlight onPress={handleEdit}  style={styles.buttonBioContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Edit Bio</Text>
            </View>

          </TouchableHighlight>
          <View>
            <Text style={styles.previousGigTitle}>Previous Gigs</Text>
            <Text style={styles.gigTitles}>Miley Cyrus</Text>
            <Text style={styles.textGigs}>
              May 28th 2019 Leeds Direct Arena{"\n"}
            </Text>
            <Text style={styles.gigTitles}>Slipknot</Text>
            <Text style={styles.textGigs}>
              March 1st 2019 Leeds Direct Arena{"\n"}
            </Text>
            <Text style={styles.gigTitles}>Beatles HoloGram Tour</Text>
            <Text style={styles.textGigs}>
              December 15th 2017 Las Vegas MGM hotel
            </Text>
          </View>
          
        </>
      )}
      <DialogInput
        isDialogVisible={dialogVisible}
        title={"Please Add Avatar URL"}
        submitInput={(inputText) => {
          setAvatar(inputText);
          isDialogVisible(false);
        }}
        closeDialog={() => {
          isDialogVisible(false);
        }}
      ></DialogInput>
      <Text>
        {"\n"}
        {"\n"}
        {"\n"}
        {"\n"}
        {"\n"}
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      {avatar ? (
        <Image
          style={styles.avatar}
          source={{
            height: 180,
            width: 180,
            uri: avatar,
          }}
        />
      ) : (
        <Image
          style={styles.avatar}
          source={{
            height: 180,
            width: 180,
            uri: "https://image.freepik.com/free-vector/sitting-man-playing-guitar_24877-62236.jpg",
          }}
        />
      )}
      <Text style={styles.name}>
        {firstName} {lastName}
        {"\n"}
      </Text>
      <View style={styles.aboutMeContainer}>
        <Text style={styles.aboutMeTitle}>About Me</Text>
        {bio ? (
          <Text style={styles.aboutMe}>{bio}</Text>
        ) : (
          <Text style={styles.noBio}>{firstName} has not written a bio yet</Text>
        )}
      </View>
      <View>
        <Text style={styles.previousGigTitle}>Previous Gigs</Text>
        <Text style={styles.gigTitles}>Miley Cyrus</Text>
        <Text style={styles.textGigs}>
          May 28th 2019 Leeds Direct Arena{"\n"}
        </Text>
        <Text style={styles.gigTitles}>Slipknot</Text>
        <Text style={styles.textGigs}>
          March 1st 2019 Leeds Direct Arena{"\n"}
        </Text>
        <Text style={styles.gigTitles}>Beatles HoloGram Tour</Text>
        <Text style={styles.textGigs}>
          December 15th 2017 Las Vegas MGM hotel
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    backgroundColor: "#33e4ff",
    alignItems: "center",
    flexDirection: 'column'
  },
  avatar: {
    borderRadius: 100,
    marginLeft: 5,
    marginBottom: 10
  },
  inputbox: {
    borderWidth: 1,
    width: "70%",
    height: 100,
    marginLeft: 5,
    paddingLeft: 5,
    backgroundColor: "white",
  },
  bioTitle: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 20,
  },
  aboutMeContainer: {
    marginLeft: 5,
    marginRight: 5,
    width: "75%",
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
  },
  buttonText: {
    color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16
  },
  buttonImageContainer: {
    marginTop: 5,
    marginLeft: 30,
    alignSelf: 'center'
  },
  buttonBioContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  name: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10
  },
  aboutMeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  ImageButtonText: {
    fontSize: 15,
    textAlign: "center",
  },
  previousGigTitle: {
    marginTop: 20,
    fontSize: 25,
    marginLeft: 5,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  textGigs: {
    marginLeft: 5,
  },
  gigTitles: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 17,
  },
  aboutMe:{
    fontSize: 17,
    textAlign: 'center'
  },
  noBio: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 17
  }
});
