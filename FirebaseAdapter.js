import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

export const initFirebase = () => {
  var firebaseConfig = require('./firebase.config.json');
  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
}

export const getFireStore = () => {
  initFirebase();
  store = firebase.firestore();
  store.settings({timestampsInSnapshots: true});
  return store;
}

// Specfic getters for collections that are for use with HiEfficiency app

export const getUsers = () => {
  return getRootCollection('users');
}

export const getTeams = () => {
  return getRootCollection('teams');
}

export const getStories = () => {
  return getRootCollection('stories');
}

export const getRootCollection = (name) => {
  return getFireStore().collection(name);
}

// Authorisation handled by firebase

export const signOut = () => {
  return firebase.auth().signOut();
}

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

// Hooks for interacting with firebase

export const hookIntoUserSignin = (userSignedInSuccesfullyCallback, userNotSignedInCallback) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userSignedInSuccesfullyCallback(user);
    } else {
      userNotSignedInCallback();
    }
  });
}
