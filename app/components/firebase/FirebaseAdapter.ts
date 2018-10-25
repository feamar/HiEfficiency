import firebase, { RNFirebase } from 'react-native-firebase';


export default class FirebaseAdapter 
{
  //Firestore
  static getFireStore = () : RNFirebase.firestore.Firestore =>
  {
    const store: RNFirebase.firestore.Firestore  = firebase.firestore();
    store.settings({timestampsInSnapshots: true});

    return store;
  }

  static getUsers = () : RNFirebase.firestore.CollectionReference =>
  {   return FirebaseAdapter.getRootCollection("users");}

  static getTeams = () : RNFirebase.firestore.CollectionReference =>
  {   return FirebaseAdapter.getRootCollection("teams");}

  static getStories = (teamId: string) : RNFirebase.firestore.CollectionReference =>
  {   return FirebaseAdapter.getTeams().doc(teamId).collection("stories");}

  static getRootCollection = (name: string) : RNFirebase.firestore.CollectionReference =>
  {   return FirebaseAdapter.getFireStore().collection(name);}

  static getInterruptionsFromTeam = (teamId: string, storyId: string) : RNFirebase.firestore.CollectionReference =>
  {  
    const story: RNFirebase.firestore.DocumentReference = FirebaseAdapter.getStories(teamId).doc(storyId);
    return FirebaseAdapter.getInterruptionsFromStoryRef(story);
  }

  static getInterruptionsFromStoryRef = (story: RNFirebase.firestore.DocumentReference): RNFirebase.firestore.CollectionReference =>
  {   return story.collection("interruptionsPerUser");}

  //Auth
  static logout = (): Promise<void> =>
  {   return firebase.auth().signOut();}

  static getAuth = (): RNFirebase.auth.Auth =>
  {   return firebase.auth();}
}