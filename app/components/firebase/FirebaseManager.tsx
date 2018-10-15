import FirebaseAdapter from "./FirebaseAdapter";
import firebase, { RNFirebase } from 'react-native-firebase';
import UtilityObject from "../../utilities/UtilityObject";
import update from "immutability-helper";
import { ReduxState } from "../../redux/ReduxState";
import { Store, AnyAction } from "redux";
import equal from "deep-equal";
import ActionUserLoggedOut from "../../redux/actions/user/ActionUserLoggedOut";
import ActionUserLoggedIn from "../../redux/actions/user/ActionUserLoggedIn";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";
import ReduxUser from "../../dtos/redux/ReduxUser";
import ActionUserDataChanged from "../../redux/actions/user/ActionUserDataChanged";
import ActionUserLeftTeam from "../../redux/actions/user/ActionUserLeftTeam";
import ActionUserJoinedTeam from "../../redux/actions/user/ActionUserJoinedTeam";
import DocumentTeam from "../../dtos/firebase/firestore/documents/DocumentTeam";
import ActionTeamDeleted from "../../redux/actions/user/ActionTeamDeleted";
import ActionInterruptionsOfStoryLoaded from "../../redux/actions/user/ActionInterruptionsOfStoryLoaded";
import DocumentInterruptions from "../../dtos/firebase/firestore/documents/DocumentInterruptions";
import ActionStoriesOfTeamLoaded from "../../redux/actions/user/ActionStoriesOfTeamLoaded";
import DocumentStory from "../../dtos/firebase/firestore/documents/DocumentStory";
import ActionStoryDeleted from "../../redux/actions/user/ActionStoryDeleted";
import ActionTeamDataChanged from "../../redux/actions/user/ActionTeamDataChanged";
import UtilityArray from "../../utilities/UtilityArray";
import Migration_2018_10_11_WeekSchema from "../../migrations/Migration_2018_10_11_WeekSchema";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export default class FirebaseManager 
{
    static Instance = new FirebaseManager(EnforcerInstance);

    private unsubscribers: Array<() => void>;
    private teamUnsubscribers: {[index: string] :() => void};
    private state?: ReduxState;
    public loginHasBeenCanceled: boolean;
    private store?: Store<ReduxState, AnyAction>
    private storyUnsubscriber?: () => void;
    private interruptionUnsubscriber?: () => void;

    constructor(enforcer: SingletonEnforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirebaseManager singleton.");}

        this.unsubscribers = [];
        this.teamUnsubscribers = {};
        this.loginHasBeenCanceled = false;
    }

    onReduxStateChanged = async () =>
    {
        if(this.store == undefined)
        {   return;}


        const newState = this.store.getState();
        if(this.state)

        if(equal(this.state, newState))
        {   return;}


        if(newState.inspecting != undefined)
        {
        if(this.state == undefined || this.state.inspecting == undefined || newState.inspecting.team != this.state.inspecting.team)
            {
                if(newState.inspecting.team == undefined)
                {   this.onUserInspectingTeamEnd();}
                else
                {   this.onUserInspectingTeamStart(newState.inspecting.team);}
            }
            if(this.state == undefined || this.state.inspecting == undefined || newState.inspecting.story != this.state.inspecting.story)
            {
                if(newState.inspecting.story == undefined)
                {   this.onUserInspectingStoryEnd();}
                else
                {   this.onUserInspectingStoryStart(newState.inspecting.team!, newState.inspecting.story);}
            }
        }            

        this.state = newState;
    }


    attach = async (store: Store<ReduxState, AnyAction>) => 
    {
        this.store = store;
        this.store.subscribe(this.onReduxStateChanged);

        const unsubscriber = firebase.auth().onAuthStateChanged(async (user: RNFirebase.User) => 
        {
            if(user) 
            {
                await new Migration_2018_10_11_WeekSchema(user.uid).perform();

                if(this.loginHasBeenCanceled == false)
                {
                    const userDocument: RNFirebase.firestore.DocumentSnapshot = await FirebaseAdapter.getUsers().doc(user.uid).get();
                    //Dispatch onUserLoggedIn.
                    const fd = new AbstractFirestoreDocument<DocumentUser>(DocumentUser.fromSnapshot(userDocument)!, user.uid);
                    store.dispatch(new ActionUserLoggedIn(fd));
    
                    //Subscribe to user changes.
                    this.unsubscribers.push(userDocument.ref.onSnapshot(this.onUserDocumentChanged, this.onSnapshotError));
    
                    //Join the teams.
                    (userDocument.data() as any).teams.forEach((teamId: string) => 
                    {
                        this.onUserJoinedTeam(teamId)
                    });
                }
            }
            else
            {   store.dispatch(new ActionUserLoggedOut());}
        });
        this.unsubscribers.push(unsubscriber);
    }

    reset = async () => 
    {
        if(this.store)
        {
            const state = this.store.getState();
            this.detach();

            if(state.user)
            {
                const user = FirebaseAdapter.getUsers().doc(state.user.document.id);
                this.unsubscribers.push(user.onSnapshot(this.onUserDocumentChanged, this.onSnapshotError));
            }
        }
    }

    detach = () =>
    {
        //Remove all current snapshot watchers.
        this.unsubscribers.forEach(unsubscriber => unsubscriber());
        const keys = Object.keys(this.teamUnsubscribers);

        for(var i = 0 ;i < keys.length ; i ++)
        {
            const key = keys[i];
            const unsubscriber = this.teamUnsubscribers[key];

            unsubscriber();
        }
    }

    onSnapshotError = (...args: Array<any>) =>
    {
        console.log("!!!!!!! ON SNAPSHOT ERROR !!!!!!!!");
        console.log(UtilityObject.stringify(args));
    }

    onUserDocumentChanged = async (snapshot: RNFirebase.firestore.DocumentSnapshot) =>
    {
        //Get the differences between the snapshot and the state BEFORE dispatching the changed event to the store.
        if(this.store == undefined)
        {   return;}

        const user: ReduxUser | null = this.store.getState().user;
        if(user == null)
        {   return;}

        const original = user.document.data.teams;
        const next: Array<string> = (snapshot.data() as any).teams;
        
        //Dispatch the change event to the Redux store.
        const document = DocumentUser.fromSnapshot(snapshot);
        if(document)
        {   this.store.dispatch(new ActionUserDataChanged(new AbstractFirestoreDocument<DocumentUser>(document, snapshot.id)));}


        //Dispatch leave events for each team that was removed.
        const removed = UtilityArray.getRemoved(original, next);
        removed.forEach(teamId => this.onUserLeftTeam(teamId));

        //Dispatch join events for each team that was added.
        const added = UtilityArray.getAdded(original, next);
        added.forEach(teamId => this.onUserJoinedTeam(teamId));
    }


    onTeamDocumentChanged = async (snapshot: RNFirebase.firestore.DocumentSnapshot) =>
    {
        if(snapshot.exists)
        {
            const document = DocumentTeam.fromSnapshot(snapshot);
            const afd = new AbstractFirestoreDocument(document!, snapshot.id!);
            this.store!.dispatch(new ActionTeamDataChanged(afd));
        }
        else
        {   this.onTeamDeleted(snapshot);           }
    }

  
    onStoryDocumentsChanged = (teamId: string) => async (snapshot: RNFirebase.firestore.QuerySnapshot) =>
    {   
        var documents: Array<AbstractFirestoreDocument<DocumentStory>> = [];

        for(var i = 0 ;i < snapshot.docChanges.length ; i ++)
        {
          const current = snapshot.docChanges[i];
          switch(current.type)
          { 
            case "removed":
                this.store!.dispatch(new ActionStoryDeleted(teamId, current.doc.id!));
                break;
  
            case "added":
            case "modified":
                const document = DocumentStory.fromSnapshot(current.doc);
                documents.push(new AbstractFirestoreDocument(document!, current.doc.id!));
                break; 
          } 
        } 

        this.store!.dispatch(new ActionStoriesOfTeamLoaded(teamId, documents));
    }

    onInterruptionsDocumentChanged = (teamId: string, storyId: string) => async (snapshot: RNFirebase.firestore.QuerySnapshot) =>
    {   
        const documents: Array<AbstractFirestoreDocument<DocumentInterruptions>> = snapshot.docs.map(row => 
        {   
            const document = DocumentInterruptions.fromSnapshot(row)!;
            return new AbstractFirestoreDocument<DocumentInterruptions>(document, row.id!);
        });

        this.store!.dispatch(new ActionInterruptionsOfStoryLoaded(teamId, storyId, documents));
    }

    onUserInspectingStoryStart = async (teamId: string, storyId: string) =>
    {
        const state = this.store!.getState();
        
        if(this.interruptionUnsubscriber)
        {   this.interruptionUnsubscriber();}

        const user = state.user;
        if(user)
        {   this.interruptionUnsubscriber = FirebaseAdapter.getInterruptionsFromTeam(teamId, storyId).onSnapshot(this.onInterruptionsDocumentChanged(teamId, storyId), this.onSnapshotError);}
    }

    onUserInspectingStoryEnd = async () =>
    {
        if(this.interruptionUnsubscriber)
        {   this.interruptionUnsubscriber();}
    }
    
    onUserInspectingTeamStart = async (teamId: string) =>
    {
        if(this.interruptionUnsubscriber)
        {   this.interruptionUnsubscriber();}

        const state = this.store!.getState();
        const user = state.user;
        
        if(user)
        {
            const team = user.teams[teamId];

            if(team)
            {
                const stories = team.stories;
                if(Object.keys(stories).length == 0)
                {
                    const query = FirebaseAdapter.getStories(teamId).orderBy("upvotes", "desc");
                    
                    if(this.storyUnsubscriber)
                    {   this.storyUnsubscriber();}
        
                    this.storyUnsubscriber = query.onSnapshot(this.onStoryDocumentsChanged(teamId), this.onSnapshotError);
                }
            }
        }
    }

    onUserInspectingTeamEnd = async () =>
    {   
        if(this.storyUnsubscriber)
        {   this.storyUnsubscriber();}
    }

    onTeamDeleted = async (snapshot: RNFirebase.firestore.DocumentSnapshot) =>
    {
        const state = this.store!.getState();
        var user = state.user;

        if(user)
        {
            const index = user.document.data.teams.indexOf(snapshot.id!);
            if(index > -1)
            {
                const newTeams = update(user.document.data.teams, {$splice: [[index, 1]]});
                await FirebaseAdapter.getUsers().doc(user.document.id!).update({teams: newTeams});
            }

            this.store!.dispatch(new ActionTeamDeleted(snapshot.id!));
        }

        
        const unsubscriber = this.teamUnsubscribers[snapshot.id!];
        if(unsubscriber)
        {   unsubscriber();}  
    }

    onUserJoinedTeam = async (teamId: string) =>
    {
        const snapshot = await FirebaseAdapter.getTeams().doc(teamId).get();
        const document = DocumentTeam.fromSnapshot(snapshot);
        if(document)
        {
            this.store!.dispatch(new ActionUserJoinedTeam(new AbstractFirestoreDocument<DocumentTeam>(document, teamId)));
            this.teamUnsubscribers[teamId] = snapshot.ref.onSnapshot(this.onTeamDocumentChanged, this.onSnapshotError);
        }
    }

    onUserLeftTeam = async (teamId: string) =>
    {   this.store!.dispatch(new ActionUserLeftTeam(teamId));}
}