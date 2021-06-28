import * as firebase from "firebase";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTNN2xnU_gpm4AdlriXjfhQWhWGs206pk",
    authDomain: "hexoft-rms.firebaseapp.com",
    databaseURL: "https://hexoft-rms.firebaseio.com",
    projectId: "hexoft-rms",
    storageBucket: "hexoft-rms.appspot.com",
    messagingSenderId: "390077080883",
    appId: "1:390077080883:web:0ade8f2d9bb98fc970ca46",
    measurementId: "G-F57PD63ZKB"
  };

firebase.initializeApp(firebaseConfig);

export default firebase.database();