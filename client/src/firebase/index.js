import firebase from "firebase/app";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO7AEXDEVNuDVXj9gpVBTCpEdbKNnruIQ",
  authDomain: "betcha-alpha.firebaseapp.com",
  projectId: "betcha-alpha",
  storageBucket: "betcha-alpha.appspot.com",
  messagingSenderId: "685758492547",
  appId: "1:685758492547:web:0cd0ce9efb369f0b46d0b6",
  measurementId: "G-8VZCLKW1PP"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };