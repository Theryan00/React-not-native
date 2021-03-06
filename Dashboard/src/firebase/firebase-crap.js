import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTNN2xnU_gpm4AdlriXjfhQWhWGs206pk",
  authDomain: "hexoft-rms.firebaseapp.com",
  databaseURL: "https://hexoft-rms.firebaseio.com",
  projectId: "hexoft-rms",
  storageBucket: "hexoft-rms.appspot.com",
  messagingSenderId: "390077080883",
  appId: "1:390077080883:web:0ade8f2d9bb98fc970ca46",
  measurementId: "G-F57PD63ZKB",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const app = firebase.initializeApp(firebaseConfig);
export const ordersDb = app.database().ref().child("orders");

export default firebase;
