import firebaseConfig from "./firebaseConfig";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database"

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function presence() {
  var uid = firebase?.auth()?.currentUser?.uid;
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  firebase
    .database()
    .ref(".info/connected")
    .on("value", function (snapshot) {
      if (!snapshot.val()) {
        return;
      }
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });
}

export { firebaseApp, firebaseAppAuth, providers, presence };
