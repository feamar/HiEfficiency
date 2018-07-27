import { AsyncStorage } from "react-native";
import firebase from 'firebase';
import 'firebase/auth';

export const USER_KEY = "auth-demo-key";

export const signUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
      userCredential.user.sendEmailVerification();
      signInWithEmailAndPassword(email, password);
  }).catch(function(error) {
    alert(error.code + ': ' + error.message)
  });
}

export const signInWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      alert(error.code + ': ' + error.message)
    });
}

export const signOut = () => {
  return firebase.auth().signOut();
}
