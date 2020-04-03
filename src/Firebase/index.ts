import firebaseConfig from "./firebaseConfig";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

export { firebaseApp, firebaseAppAuth, providers };
