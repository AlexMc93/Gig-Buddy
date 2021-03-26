# Gig Buddy :guitar:

Gig Buddy is a cross-platform mobile app designed to help music fans connect with each other based on a mutual interest in upcoming concerts, so they can avoid having to "go solo" to a gig ever again!

Users can create a profile, browse through thousands of events based on their location or a city of their choice, let others know they are looking for someone to attend a specific gig with and message potential new buddies through the in-app chat.

[See a demonstration of the app here](https://www.youtube.com/watch?v=vSuypinMyuo)

## Collaborators

This project was built during the project phase of my time on the [Northcoders](https://northcoders.com/) full-stack bootcamp, on a two-week long sprint in collaboration with a fantastic team - [Kieran Cookson](https://github.com/kieran170), [Claire Castanet](https://github.com/ClaireAdele), [Ola Al-Droubi](https://github.com/Ola-A-Aldroubi) and [Abdalla Warsame](https://github.com/warsameabdalla). Special thanks must also go to the amazing tutors at Northcoders for their expertise, guidance and patience!

## Tech

The code is written in JavaScript and utilizes the following:

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.io/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Axios](https://www.npmjs.com/package/axios)

In addition we used extra components [React Native Maps](https://github.com/react-native-maps/react-native-maps) & [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat), and [Android Studio](https://developer.android.com/studio) and [Xcode](https://developer.apple.com/xcode/) to ensure cross-platform consistency during development.
All event data is sourced from the [Ticketmaster API](https://developer.ticketmaster.com/), fully adhering to their terms & conditions as set out [here](https://developer.ticketmaster.com/support/terms-of-use/).

## Set-up

If you wish to run this project locally, there are quite a few requirements beforehand - the main one being a Firebase config file. If this is something you are interested in, please [contact me](https://github.com/AlexMc93) and I will be happy to help (particularly if you are a prospective employer...). Then you will be able to follow the steps below:

Firstly, you will need [Node.js](https://nodejs.org/en/) (v14.14.0 or later), which can be checked by running `node -v` in your terminal. Secondly, you will need an editor to run the code; [VS Code](https://code.visualstudio.com/download) is a popular choice and the one I would recommend. Finally, [Expo CLI](https://docs.expo.io/get-started/installation/) is what allows us to open the app either on a device or a simulator/emulator. This can be installed by running `npm install --global expo-cli`. An account is not required in order to view this app, so there is no need to register or log in.

Now you can clone this repo: `git clone https://github.com/AlexMc93/Gig-Buddy` and run `npm i` to install the dependencies.
From here, there are a couple of options to use the app. The easiest is to download the Expo Go app on your iOS or Android device. Alternatively, you can set up an [iOS simulator](https://docs.expo.io/workflow/ios-simulator/) (macOS only) or [Android emulator](https://docs.expo.io/workflow/android-studio-emulator/).

By running the command `npm start` or `expo start`, the Expo CLI will start "Metro Bundler", an HTTP server that compiles the JavaScript code using [Babel](https://babeljs.io/) and serves it to Expo. From either the GUI that appears in the browser or your terminal, you can either scan the QR code with your device's camera (via the default camera app on Apple or the Expo Go "Projects" tab on Android) or select to run on simulator/emulator as necessary.

Feel free to create an account and chat to other users!

## To-do List

We are excited to see how this app could be improved even further given some more time to work on it. Extra features could include:

- Past gigs automatically added to a user's profile, as well as a list of events they are attending or looking for a buddy for
- Improved gig search functionality (by venue, artist, genre etc.)
- Notification upon receiving a chat message
- User preferences (different themes, default location)
- Pagination / infinite scroll for the list of gigs

### Thanks for reading!
