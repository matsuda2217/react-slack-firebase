import firebase from 'firebase';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyAhz_9LJ4bwDYQrxV78VnrS1aJL8ghAAu8",
  authDomain: "react-slack-clone-3fb21.firebaseapp.com",
  databaseURL: "https://react-slack-clone-3fb21.firebaseio.com",
  projectId: "react-slack-clone-3fb21",
  storageBucket: "react-slack-clone-3fb21.appspot.com",
  messagingSenderId: "319495010561"
};
firebase.initializeApp(config);

export default firebase;