import firebase from 'react-native-firebase';


export default class FirebaseAdapter 
{
  //Firestore
  static getFireStore = () =>
  {
    var store = firebase.firestore();
    store.settings({timestampsInSnapshots: true});

    return store;
  }

  static getUsers = () =>
  {   return FirebaseAdapter.getRootCollection("users");}

  static getTeams = () =>
  {   return FirebaseAdapter.getRootCollection("teams");}

  static getStories = (teamId) =>
  {   return FirebaseAdapter.getTeams().doc(teamId).collection("stories");}

  static getRootCollection = (name) =>
  {   return FirebaseAdapter.getFireStore().collection(name);}

  static getInterruptionsFromTeam = (teamId, storyId) =>
  {  
    const story = FirebaseAdapter.getStories(teamId).doc(storyId);
    return FirebaseAdapter.getInterruptionsFromStoryRef(story);
  }

  static getInterruptionsFromStoryRef = (story) =>
  {   return story.collection("interruptionsPerUser");}

  //Auth
  static logout = () =>
  {   return firebase.auth().signOut();}
  
  static signUpWithEmailAndPassword = (email, password) => 
  {
     return firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
    .then(userCredential => 
    {  
      getUsers().doc(userCredential.user.uid).set({
        name: email,
        teams: [],
      });

      userCredential.user.sendEmailVerification();
      FirebaseAdapter.signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) 
    {   alert(error.code + ': ' + error.message)});
  }
  
  static signInWithEmailAndPassword = (email, password) => 
  {
    return firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
    .catch(function (error) 
    {   alert(error.code + ': ' + error.message)});
  }
}