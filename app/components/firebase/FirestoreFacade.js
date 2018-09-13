import FirebaseAdapter from "./FirebaseAdapter";
import ResolveType from "../../enums/ResolveType";
import {ToastAndroid, NetInfo} from 'react-native';
import DatabaseActionType from "../../enums/DatabaseActionType";
import UtilityString from "../../utilities/UtilityString";
import update from "immutability-helper";
import UtilityObject from "../../utilities/UtilityObject";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export default class FirestoreFacade
{
    static Instance = new FirestoreFacade(EnforcerInstance);
    constructor(enforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirestoreFacade singleton.");}

        this.adapter = FirebaseAdapter;
        this.state = {};
    }

    updateUser = (userId, updates, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getUsers().doc(userId).update(updates);
        return this.process(resolveSuccess, resolveError, "profile", DatabaseActionType.Update, promise);
    }

    deleteTeam = (teamId, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getTeams().doc(teamId).delete();
        return this.process(resolveSuccess, resolveError, "team", DatabaseActionType.Delete, promise);
    }

    leaveTeam = (teamId, currentTeams, userId, resolveSuccess, resolveError) =>
    {
        var index = currentTeams.indexOf(teamId);
        if(index > -1)
        {
            currentTeams = update(currentTeams, {$splice: [[index, 1]]})
            const promise = FirebaseAdapter.getUsers().doc(userId).update({ teams: currentTeams });
            return this.process(resolveSuccess, resolveError, "team", DatabaseActionType.Leave, promise);
        }
        else
        {   this.resolveError(resolveSuccess, resolveError, "team", DatabaseActionType.Leave);}
    }

    joinTeam = (name, code, currentTeams, userId, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getTeams().where("name", "==", name.toString()).get().then(teams => 
        {
            for(var i = 0 ; i < teams.docs.length ; i ++)
            { 
                const team = teams.docs[i];
                if(team.data().code.toString() == code.toString())
                {
                    var newData = currentTeams;
                    if(newData.indexOf(team.id) > -1)
                    {   continue;}
        
                    newData = update(newData, {$push: [team.id]});
                    FirebaseAdapter.getUsers().doc(userId).update({teams: newData});
        
                    return null;
                }
            }
    
            if(teams.docs.length <= 0)
            {   alert("No team called '" + name + "' could be found.");}
            else
            {   alert("A team called '" + name + "' could be found, but the security code was incorrect.");}
        });

        return this.process(resolveSuccess, resolveError, "team", DatabaseActionType.Join, promise).then(error => 
        {
           //if(error != undefined)
           //{    this.resolveError(ResolveType.DIALOG, "team", DatabaseActionType.Join, error);} 
        });
    }

    createTeam = (name, code, currentTeams, userId) =>
    {
        const promise = FirebaseAdapter.getTeams().add({name: name, code: code});
        const resultPromise = this.process(ResolveType.TOAST, ResolveType.TOAST, "team", DatabaseActionType.CREATE, promise)
        .then((doc) =>
        {
            this.joinTeam(name, code, currentTeams, userId, ResolveType.TOAST);
            return doc;
        });

        return resultPromise;
    }

    updateTeam = (teamId, updates, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getTeams().doc(teamId).update(updates);
        return this.process(resolveSuccess, resolveError, "team", DatabaseActionType.Update, promise);
    }

    updateStory = (teamId, storyId, updates, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getStories(teamId).doc(storyId).update(updates);
        return this.process(resolveSuccess, resolveError, "story", DatabaseActionType.Update, promise);
    }

    createStory = (teamId, story, resolveSuccess, resolveError) =>
    {
        const promise = FirebaseAdapter.getStories(teamId).add(story);
        return this.process(resolveSuccess, resolveError, "story", DatabaseActionType.Create, promise);
    }
    
    deleteStory = (teamId, storyId, resolveSuccess, resolveError) =>
    {
        const document = FirebaseAdapter.getStories(teamId).doc(storyId);

        const promise = document.collection("interruptionsPerUser").get().then(interruptions => 
        {
          interruptions.docs.forEach(doc => {doc.ref.delete()});
          document.delete();
        });

        return this.process(resolveSuccess, resolveError, "story", DatabaseActionType.Delete, promise);
    }

    createInterruption = (teamId, storyId, userId, currentInterruptions, interruption, resolveSuccess, resolveError) =>
    {
        const document = FirebaseAdapter.getInterruptionsFromTeam(teamId, storyId).doc(userId);

        const newInterruptions = update(currentInterruptions, {$push: [interruption]});

        var keys = Object.keys(newInterruptions);
        var values = keys.map(v => newInterruptions[v]);


        var promise = undefined;
        if(values.length == 1)
        {   promise = document.set({interruptions: values});}
        else
        {   promise = document.update({interruptions: values});}

        return this.process(resolveSuccess, resolveError, "interruption", DatabaseActionType.Create, promise);
    }

    updateInterruption = (teamId, storyId, userId, updates, resolveSuccess, resolveError) =>
    {
        const document = FirebaseAdapter.getInterruptionsFromTeam(teamId, storyId).doc(userId);
        const promise = document.update(updates);

        return this.process(resolveSuccess, resolveError, "interruptions", DatabaseActionType.Update, promise);
    }

    deleteInterruption = (teamId, storyId, userId, updates, resolveSuccess, resolveError) =>
    {
        const document = FirebaseAdapter.getInterruptionsFromTeam(teamId, storyId).doc(userId);
        const promise = document.delete();

        return this.process(resolveSuccess, resolveError, "interruption", DatabaseActionType.Delete, promise);
    }

    process = (resolveSuccess, resolveError, entityType, actionType, promise) =>
    {
        var resolved = false;
        const newPromise = promise.then((...args) => {
            resolved = true;
            this.resolveSuccess(resolveSuccess, entityType, actionType)

            return args;
        }, 
        (...args) => {
            resolved = true;
            this.resolveError(resolveError, entityType, actionType, undefined)

            return args;
        })
        .catch(error => () => {
            resolved = true; 
            this.resolveError(resolveError, entityType, actionType, error)

            return error;
        });

        NetInfo.isConnected.fetch().then(isConnected => 
        {
            if(isConnected)
            {
                setTimeout(() => {
                    if(resolved == false)
                    {
                        const message = UtilityString.capitalizeFirstLetter(actionType.presentContinuous) + " the " + entityType + " is taking longer than expected, please be patient..";
                        ToastAndroid.show(message, ToastAndroid.LONG);
                    }
                }, 1000);
            }
            else
            {
                const message = "No internet connection available. The command will be sent once the connection is re-established."
                ToastAndroid.show(message, 5000);
            }
        });

        return newPromise;
    }

    resolveSuccess = (resolve, entityName, actionType) => 
    {
        const message = "Successfully " + actionType.pastTense + " " + entityName + "!";
        this.resolveForMessage(resolve, message);
    }

    resolveError = (resolve, entityName, actionType, error) => 
    {
        const message = "Could not " + actionType.presentTense + " " + entityName + ", please try again later.";
        this.resolveForMessage(resolve, message);
    }

    resolveForMessage = (resolveType, message) =>
    {
        if(resolveType == undefined)
        {   resolveType = ResolveType.NONE;}
        
        switch(resolveType)
        {
            case ResolveType.TOAST:
                ToastAndroid.show(message, ToastAndroid.LONG);
                break;

            case ResolveType.DIALOG:
                alert(message);
                break;

            case ResolveType.NONE:
                //Do nothing.
                break;
        }
    }
}