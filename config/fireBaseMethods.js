import { Alert } from "react-native";
import { firebaseApp, auth, firestore } from "./firebase";

export async function registration(firstName, familyName, email, password) {

  console.log('trying to register...')

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    const currentUser = auth.currentUser;
    const currentUserUID = auth.currentUser.uid;

    const db = firestore;
    db.collection("users").doc(currentUser.uid).set({
      email: currentUser.email,
      lastName: familyName,
      
      firstName: firstName,
      chatrooms: [currentUserUID],
      contacts: [],
      userAvatar: "https://image.freepik.com/free-vector/sitting-man-playing-guitar_24877-62236.jpg"
    });
    Alert.alert("Sign Up Successful");
  } catch (err) {
    if (err) return err;
  }
}

export async function signIn(email, password) {

  console.log('trying to sign in...')

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    if (err) return err;
  }
}

export async function loggingOut() {

  console.log('trying to log out...')

  try {
    await auth.signOut();
  } catch (err) {
    Alert.alert("Problem logging out", err.message);
  }
}

export async function getEventUsers(eventID) {

  console.log('getting buddy seekers...')

  try {

    const db = firestore;
    const eventRef = db.collection('events').doc(eventID);
    const doc = await eventRef.get();

    return doc.data();

  } catch (err) {
    Alert.alert("There is something wrong!", err.message)
  }
}

export async function getUserInfo(uid) {

  console.log('getting user info...')

  try {

    const doc = await firebaseApp
    .firestore()
    .collection("users")
    .doc(uid)
    .get();

    return {userData: doc.data(), uid};

  } catch (err) {
    Alert.alert("Problem getting user info", err.message)
  }
}

export async function toggleUserAtEvent(eventID, newArr, list) {

  console.log('toggling user...')

  try {

    const db = firestore;
    const eventRef = db.collection('events').doc(eventID)

    const res = await eventRef.set({
      [list]: newArr
    }, {
      merge: true
    })
  } catch (err) {
    Alert.alert("Error adding user to list", err.message)
  }
}

export async function eventDocExists(eventID) {

  console.log('checking event doc exists...')

  const db = firestore;
  const eventRef = db.collection('events').doc(eventID)
  const doc = await eventRef.get();

  return doc.exists
}

export async function createUserArrays(eventID) {

  console.log('setting up event arrays...')

  try {

    const db = firestore;
    const eventRef = db.collection('events').doc(eventID)
    
    const res = await eventRef.set({
      attendees: [],
      buddySeekers: []
    })

  } catch (err) {
    Alert.alert("Error creating user arrays in db", err.message)
  }
}
