import firebase from 'react-native-firebase';


//TODO: Discuss with Frank whether this refactor is allright.
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
    return FirebaseAdapter.getInterruptionsFromStory(story);
  }

  static getInterruptionsFromStory = (story) =>
  {   return story.ref.collection("interruptionsPerUser");}

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

  static getCurrentUser = (userSignedInSuccesfullyCallback, userNotSignedInCallback) => 
  {
    return firebase.auth().onAuthStateChanged((user) => 
    {
      if (user) 
      {   userSignedInSuccesfullyCallback(user);} 
      else 
      {   userNotSignedInCallback();}
    });
  }

  static getCurrentUserOrThrow = (callback) =>
  {
    return firebase.auth().onAuthStateChanged(user => 
      {
        if(user)
        {   callback(user);}
        else
        {   FirebaseAdapter.logout();}
      });
  }
}