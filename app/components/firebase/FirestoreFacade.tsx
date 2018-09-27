import FirebaseAdapter from "./FirebaseAdapter";
import TeamJoin from "./crud/TeamJoin";
import TeamLeave from "./crud/TeamLeave";
import TeamCreate from "./crud/TeamCreate";
import TeamDelete from "./crud/TeamDelete";
import UserUpdate from "./crud/UserUpdate";
import TeamUpdate from "./crud/TeamUpdate";
import StoryUpdate from "./crud/StoryUpdate";
import StoryCreate from "./crud/StoryCreate";
import StoryDelete from "./crud/StoryDelete";
import InterruptionDelete from "./crud/InterruptionDelete";
import InterruptionUpdate from "./crud/InterruptionUpdate";
import InterruptionCreate from "./crud/InterruptionCreate";
import AbstractCrudOperation, { SECTION_CONNECTING } from "./crud/AbstractCrudOperation";
import DialogLoading from "../dialog/instances/DialogLoading";
import UserLogin from "./crud/UserLogin";
import UserRegister from "./crud/UserRegister";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";
import { Spec } from "immutability-helper";
import DocumentTeam from "../../dtos/firebase/firestore/documents/DocumentTeam";
import DocumentStory from "../../dtos/firebase/firestore/documents/DocumentStory";
import DocumentInterruptions from "../../dtos/firebase/firestore/documents/DocumentInterruptions";
import EntityInterruption from "../../dtos/firebase/firestore/entities/EntityInterruption";
import React from "react";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export type InDialogResult = 
{
    successful: boolean,
    dialogOpened: boolean
}

export type InDialogExecutor = (crud: AbstractCrudOperation) => Promise<InDialogResult>;

export default class FirestoreFacade
{
    static Instance = new FirestoreFacade(EnforcerInstance);

    public readonly adapter: FirebaseAdapter;

    constructor(enforcer: SingletonEnforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirestoreFacade singleton.");}

        this.adapter = FirebaseAdapter;
    }

    updateUser = (userId: string, oldUser: DocumentUser, updates: Spec<DocumentUser, never>) : UserUpdate =>
    {   return new UserUpdate(userId, oldUser, updates );}

    loginUser = (email: string, password: string) : UserLogin =>
    {   return new UserLogin(email, password);}

    registerUser = (email: string, password: string) : UserRegister =>
    {   return new UserRegister(email, password);}

    deleteTeam = (teamId: string, userId: string, currentTeams: Array<string>): TeamDelete =>
    {   return new TeamDelete(teamId, userId, currentTeams);}

    leaveTeam = (teamId: string, userId: string, currentTeams: Array<string>): TeamLeave =>
    {   return new TeamLeave(teamId, userId, currentTeams );}

    joinTeam = (name: string, code: string, userId: string, currentTeams: Array<string>) : TeamJoin =>
    {   return new TeamJoin(name, code, userId, currentTeams);}

    createTeam = (team: DocumentTeam, userId: string, currentTeams: Array<string>): TeamCreate =>
    {   return new TeamCreate(team, userId, currentTeams);}

    updateTeam = (teamId: string, oldTeam: DocumentTeam, updates: Spec<DocumentTeam, never>): TeamUpdate =>
    {   return new TeamUpdate(teamId, oldTeam, updates);}

    updateStory = (teamId: string, storyId: string, oldStory: DocumentStory, updates: Spec<DocumentStory, never>) =>
    {   return new StoryUpdate(teamId, storyId, oldStory, updates);}

    createStory = (teamId: string, story: DocumentStory): StoryCreate =>
    {   return new StoryCreate(teamId, story);}
    
    deleteStory = (teamId: string, storyId: string): StoryDelete =>
    {   return new StoryDelete(teamId, storyId);}

    createInterruption = (teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, newInterruption: EntityInterruption): InterruptionCreate  =>
    {   return new InterruptionCreate(teamId, storyId, userId, currentInterruptions, newInterruption);}

    updateInterruption = (teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, oldInterruption: EntityInterruption, updates: Spec<EntityInterruption, never>): InterruptionUpdate =>
    {   return new InterruptionUpdate(teamId, storyId, userId, currentInterruptions, oldInterruption, updates);}

    deleteInterruption = (teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, indexToDelete: number): InterruptionDelete =>
    {   return new InterruptionDelete(teamId, storyId, userId, currentInterruptions, indexToDelete);}



    inDialog = (addDialogCallback: (dialog: DialogLoading) => void, removeDialogCallback: (dialog: DialogLoading) => void, title: string, closure: (execute: InDialogExecutor) => void, showDelay: number = 3000) => 
    {
        const execute = (dialog: DialogLoading, hasNextOperation: boolean = false) => async (crud: AbstractCrudOperation): Promise<InDialogResult> =>
        {   
            var resolved: boolean = false;
            setTimeout(() => 
            {
                if(resolved == false)
                {   dialog.setVisible(true);}
            }, showDelay);
            const successful = await crud.execute(dialog);
            resolved = true;

            if(hasNextOperation == false)
            {
                if(successful == false)
                {   
                    if(dialog.state.visible == false)
                    {   dialog.setVisible(true);}
                }

                dialog.setCompleted();
            }

            return {successful: successful, dialogOpened: dialog.state.visible};
        }

        const onReference = (ref: DialogLoading | null) => 
        {
            if(ref != null)
            {
                const executor: InDialogExecutor = execute(ref);
                closure(executor);
            }
        }

        const component:JSX.Element = <DialogLoading 
            ref = {x => onReference(x)}
            title={title}
            key={title} 
            section={SECTION_CONNECTING}
            isComplete={false}
            timeout={30000} 
            visible={false} 
            cancelable={false}
            warning={undefined} 
            onClose={() => {removeDialogCallback(component); resolve();}} />
    }
    /*inDialog = (addDialogCallback: (dialog: DialogLoading) => void, removeDialogCallback: (dialog: DialogLoading) => void, title: string, closure: () => void, showDelay: number = 3000) => 
    {
        
        return new Promise((resolve, reject) => 
        {
            const execute = (dialog, hasNextOperation) => async (crud) =>
            {   
                var resolved = false;
                setTimeout(() => 
                {
                    if(resolved == false)
                    {   dialog.setVisible(true);}
                }, showDelay);
                const successful = await crud.execute(dialog);
                resolved = true;

                if(hasNextOperation == false || hasNextOperation == undefined)
                {
                    if(successful == false)
                    {   
                        if(dialog.state.visible == false)
                        {   dialog.setVisible(true);}
                    }

                    dialog.setCompleted();
                }

                return {successful: successful, dialogOpened: dialog.state.visible};
            }

            const onReference = (ref) => 
            {
                if(ref)
                {   closure(execute(ref));}
            }
    
            const component = <DialogLoading 
                ref = {onReference}
                title={title}
                key={title} 
                section={SECTION_CONNECTING}
                isComplete={false}
                timeout={30000} 
                visible={false} 
                cancelable={false}
                warning={undefined} 
                onClose={() => {removeDialogCallback(component); resolve();}} />
    
            addDialogCallback(component);
        });
    } */
}