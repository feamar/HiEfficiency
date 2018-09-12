import FirebaseAdapter from "./FirebaseAdapter";
import firebase from 'react-native-firebase';
import * as ReducerUser from "../../redux/reducers/ReducerUser";
import * as ReducerInspecting from "../../redux/reducers/ReducerInspecting";
import UtilityArray from "../../utilities/UtilityArray";
import UtilityObject from "../../utilities/UtilityObject";
import update from "immutability-helper";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export default class FirebaseManager 
{
    static Instance = new FirebaseManager(EnforcerInstance);

    constructor(enforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirebaseManager singleton.");}

        this.unsubscribers = [];
        this.teamUnsubscribers = {};

        this.state = {};
    }

    onReduxStateChanged = () =>
    {
        const newState = this.store.getState();
        if(this.state != newState)
        {
            if(newState.inspecting != undefined)
            {
                if(this.state.inspecting == undefined || newState.inspecting.team != this.state.inspecting.team)
                {
                    if(newState.inspecting.team == undefined)
                    {   this.onUserInspectingTeamEnd();}
                    else
                    {   this.onUserInspectingTeamStart(newState.inspecting.team);}
                }

                if(this.state.inspecting == undefined || newState.inspecting.story != this.state.inspecting.story)
                {
                    if(newState.inspecting.story == undefined)
                    {   this.onUserInspectingStoryEnd();}
                    else
                    {   this.onUserInspectingStoryStart(newState.inspecting.team, newState.inspecting.story);}
                }
            }            

            this.state = newState;
        }
    }

    attach = (store) => 
    {
        this.store = store;
        this.store.subscribe(this.onReduxStateChanged);

        const unsubscriber = firebase.auth().onAuthStateChanged((user) => 
        {
            if(user) 
            {
              FirebaseAdapter.getUsers().doc(user.uid).get().then(doc => 
              {
                //Dispatch onUserLoggedIn.
                store.dispatch(ReducerUser.onUserLoggedIn(user.uid, doc));
  
                //Subscribe to user changes.
                this.unsubscribers.push(doc.ref.onSnapshot(this.onUserDocumentChanged));

                //Join the teams.
                doc.data().teams.forEach(teamId => this.onUserJoinedTeam(teamId));
              });
            }
            else
            {   store.dispatch(ReducerUser.onUserLoggedOut());}
        });
        this.unsubscribers.push(unsubscriber);
    }

    onUserDocumentChanged = (snapshot) =>
    {
        //Get the differences between the snapshot and the state BEFORE dispatching the changed event to the store.
        const original = this.store.getState().user.data.teams;
        const next = snapshot.data().teams;

        this.store.dispatch(ReducerUser.onUserDataChanged(snapshot));

        const removed = UtilityArray.getRemoved(original, next);
        removed.forEach(teamId => this.onUserLeftTeam(teamId));

        const added = UtilityArray.getAdded(original, next);
        added.forEach(teamId => this.onUserJoinedTeam(teamId));
    }

    onTeamDocumentChanged = (snapshot) =>
    {
        if(snapshot.exists)
        {   this.store.dispatch(ReducerUser.onTeamDataChanged(snapshot));}
        else
        {   
            const state = this.store.getState();
            const index = state.user.data.teams.indexOf(snapshot.id);
            if(index >= 0)
            {
                const newTeams = update(state.user.data.teams, {$splice: [[index, 1]]});
                FirebaseAdapter.getUsers().doc(state.user.uid).update({teams: newTeams});
            }
        }
    }

  
    onStoryDocumentsChanged = (teamId) => (snapshot) =>
    {   
        const added = snapshot.docChanges.filter(d => d.type == "added");
        if(added.length > 0)
        {   this.store.dispatch(ReducerUser.onStoriesLoaded(teamId, added));}

        for(var i = 0 ;i < snapshot.docChanges.length ; i ++)
        {
          const current = snapshot.docChanges[i];
          switch(current.type)
          { 
              case "removed":
                this.store.dispatch(ReducerUser.onStoryDeleted(teamId, current));
                break;
  
              case "modified":
                this.store.dispatch(ReducerUser.onStoryDataChanged(teamId, current));
                break; 
          } 
        } 
    }

    onInterruptionsDocumentChanged = (teamId, storyId) => (snapshot) =>
    {   
        //console.log("SNAPSHOT! Exists: " + snapshot.exists);
        var interruptions;
        if(snapshot.exists)
        {   interruptions = snapshot.data().interruptions;}
        else
        {   interruptions = [];}
        
        this.store.dispatch(ReducerUser.onInterruptionsLoaded(teamId, storyId, interruptions));
    }

    onUserInspectingStoryStart = (teamId, storyId) =>
    {
        const state = this.store.getState();
        
        if(this.interruptionUnsubscriber)
        {   this.interruptionUnsubscriber();}
        this.interruptionUnsubscriber = FirebaseAdapter.getInterruptionsFromTeam(teamId, storyId).doc(state.user.uid).onSnapshot(this.onInterruptionsDocumentChanged(teamId, storyId));
    }

    onUserInspectingStoryEnd = () =>
    {
        if(this.interruptionUnsubscriber)
        {   this.interruptionUnsubscriber();}
    }


    onUserInspectingTeamStart = (teamId) =>
    {
        const state = this.store.getState();
        const stories = state.user.teams[teamId].stories;
        if(Object.keys(stories).length === 0 && stories.constructor === Object)
        {
            const query = FirebaseAdapter.getStories(teamId).orderBy("upvotes", "desc");
            
            if(this.storyUnsubscriber)
            {   this.storyUnsubscriber();}

            this.storyUnsubscriber = query.onSnapshot(this.onStoryDocumentsChanged(teamId));
        }
    }

    onUserInspectingTeamEnd = () =>
    {   
        if(this.storyUnsubscriber)
        {   this.storyUnsubscriber();}
    }

    onUserJoinedTeam = (teamId) =>
    {
        FirebaseAdapter.getTeams().doc(teamId).get().then(team => 
        {
            this.store.dispatch(ReducerUser.onUserJoinedTeam(team));
            this.teamUnsubscribers[teamId] = team.ref.onSnapshot(this.onTeamDocumentChanged);
        });
    }

    onUserLeftTeam = (teamId) =>
    {
        this.store.dispatch(ReducerUser.onUserLeftTeam(teamId));
        this.teamUnsubscribers[teamId]();
    }

    detach = () =>
    {   this.unsubscribers.forEach(unsubscriber => unsubscriber());}
}