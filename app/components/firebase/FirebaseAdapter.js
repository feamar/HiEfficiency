import firebase from 'react-native-firebase';


export const initFirebase = () => {
  //This is no longer necessary in Firebase RN.
  //var firebaseConfig = require('./firebase.config.json');
  //!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
}

export const getFireStore = () => {
  //initFirebase();
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

export const getStories = (teamId) => {
  return getTeams().doc(teamId).collection('stories');
}

export const getRootCollection = (name) => {
  return getFireStore().collection(name);
}

// Authorisation handled by firebase

export const signOut = () => {
  return firebase.auth().signOut();
}

export const createUserUnderUsers = (uid, displayName) => {
  console.log('Adding user: ' + displayName + ' with uid: ' + uid);
  getUsers().doc(uid).set({
    name: displayName,
    teams: [],
  });
}

export const signUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
      createUserUnderUsers(userCredential.user.uid, email);
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
