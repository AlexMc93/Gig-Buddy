import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Image,
  Platform,
  Dimensions,
  SafeAreaView
} from "react-native";
import { registration, signIn } from "../config/fireBaseMethods";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function App({ navigation, login }) {
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(true);

  const handlePressSignIn = () => {
    if (!email) {
      Alert.alert("E-mail field is required");
    }
    if (!password) {
      Alert.alert("Password field is required");
    }
    signIn(email, password).then((err) => {
      if (err) {
        Alert.alert("There is something wrong!", err.message);
      }
      if (!err) {
        login();
        setEmail("");
        setPassword("");
        navigation.navigate("Events");
      }
    });
  };

  const handlePressSignUp = () => {
    if (!email) {
      Alert.alert("E-mail field is required");
    }
    if (!password) {
      Alert.alert("Password field is required");
    }
    if (!firstName) {
      Alert.alert("First Name field is required");
    }
    if (!familyName) {
      Alert.alert("Family Name field is required");
    }
    if (firstName && familyName) {
      registration(firstName, familyName, email, password).then((err) => {
        if (!err) {
          setFirstName("");
          setFamilyName("");
          setEmail("");
          setPassword("");
          setSignUp(true);
        }
        if (err) {
          Alert.alert("There is something wrong!!!!", err.message);
        }
      });
    }
  };

  const handleClick = () => {
    signUp ? setSignUp(false) : setSignUp(true);
  };

  return signUp ? (
    <SafeAreaView style={styles.container}>

      <View style={styles.topSection}>
      <Image
        style={styles.image}
        source={require("../assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      </View>

      <View style={styles.inputSection}>
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />

      <TouchableOpacity onPress={handlePressSignIn}>
        <View style={styles.signButton}>
          <Text style={styles.signText}>Sign In</Text>
        </View>
      </TouchableOpacity>
 
      <Text style={styles.swapText}>Don't have an account yet? <Text onPress={handleClick} style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign Up Here!</Text></Text>
      </View>
      
      <View style={styles.bottomSection}>
      <Image style={styles.bottomImage} source={require("../assets/landing-page-bottom.png")} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>

      <View style={styles.topSection}>
      <Image
        style={styles.image}
        source={require("../assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      </View>

      <View style={styles.inputSection}>
      <TextInput
        placeholder="First Name"
        placeholderTextColor="#fff"
        value={firstName}
        onChangeText={(firstName) => {
          setFirstName(firstName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#fff"
        value={familyName}
        onChangeText={(familyName) => {
          setFamilyName(familyName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />

      <TouchableOpacity onPress={handlePressSignUp}>
        <View style={styles.signButton}>
        <Text style={styles.signText}>Sign Up</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.swapText} onPress={handleClick}>Already have an account? <Text style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign In Here!</Text></Text>

      </View>

      <View style={styles.bottomSection}>
      <Image style={styles.bottomImage} source={require("../assets/landing-page-bottom.png")} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33e4ff",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    height: Dimensions.get('window').height
  },
  subTitle: {
    color: '#FF2400',
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "notoserif" : "Times New Roman",
    fontStyle: "italic",
    fontWeight: "bold",
    alignSelf: 'center'
  },
  inputbox: {
    alignSelf: 'center',
    borderWidth: 2,
    width: 180,
    height: 38,
    marginBottom: 10,
    textAlign: "center",
    borderColor: '#991400',
    borderRadius: 10,
    backgroundColor: '#FF2400',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    height: 175,
    width: '105%',
    alignSelf: 'center'
  },
  bottomImage: {
    alignSelf: 'flex-end',
    height: 330,
    width: 300,
    zIndex: -1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
    paddingRight: 10,
    width: Dimensions.get('window').width - 10
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60
  },
  bottomSection: {
    flex: 0.6,
    justifyContent: 'center',
    paddingBottom: 120
  },
  signButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    width: 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderColor: '#991400',
    borderWidth: 1,
  },
  swapText: {
    fontSize: 18,
    paddingBottom: 10
  },
  signText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 22
  }
});
