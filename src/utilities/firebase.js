import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA1VUCT_XvcggL0oJeM0GVFCcc2e1X4i2s",
    authDomain: "hardware-37301.firebaseapp.com",
    databaseURL: "https://hardware-37301.firebaseio.com",
    projectId: "hardware-37301",
    storageBucket: "hardware-37301.appspot.com",
    messagingSenderId: "789140374767",
    appId: "1:789140374767:web:9e2a163b05b542dce7471a",
    measurementId: "G-CBM5BJSF0T"
  };

  var fire =  firebase.initializeApp(firebaseConfig);
  export var auth =  fire.auth();
  export var firestore = fire.firestore();