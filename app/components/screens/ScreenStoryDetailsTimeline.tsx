import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import { TouchableRipple, Text} from "react-native-paper";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import InterruptionType from "../../enums/InterruptionType";
import {asDate } from "../util/DateUtil";
import BarActionButtons from "../bars/BarActionButtons";
import ButtonSquare from "../bars/buttons/ButtonSquare";
import ActionType from "../../enums/ActionType";
import {  MenuOptionProps } from "react-native-popup-menu";
import WithOverflowMenu, { WithOverflowMenu_RequiredFunctions } from "../../hocs/WithOverflowMenu";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import ActionStartInspectStory from "../../redux/actions/inspection/ActionStartInspectStory";
import { Dispatch } from "redux";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import ReduxStory, { StoryLifecycle } from "../../dtos/redux/ReduxStory";
import ListInterruptions, { InterruptionModelType } from "../list/instances/interruptions/ListInterruptions";
import WithLoading, { WithLoadingProps } from "../../hocs/WithLoading";
import DocumentInterruptions from "../../dtos/firebase/firestore/documents/DocumentInterruptions";
import EntityInterruption from "../../dtos/firebase/firestore/entities/EntityInterruption";
import DialogPreferenceDateTime, { DialogPreferenceDateTime_StorageValue } from "../dialog/preferences/DialogPreferenceDateTime";
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from "../dialog/instances/DialogConfirmation";
import ModelInterruption from "../list/instances/interruptions/models/ModelInterruption";
import DialogInterruptionEdit, { DialogInterruptionEdit_StorageValue } from "../dialog/custom/interruptions/DialogInterruptionEdit";
import ModelStart from "../list/instances/interruptions/models/ModelStart";
import ModelFinish from "../list/instances/interruptions/models/ModelFinish";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";
import Color from "../../dtos/color/Color";
import { AbstractListCollapsible_SectionType } from "../list/abstractions/collapsible/AbstractListCollapsible";
import ModelProductive from "../list/instances/interruptions/models/ModelProductive";
import ActionOption from "../../dtos/options/ActionOption";
import { AdjustedCallbackReference } from "../../render_props/CallbackReference";
import AbstractDialog from "../dialog/AbstractDialog";
import UtilityObject from "../../utilities/UtilityObject";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";

const isEqual = require("react-fast-compare");


const styles = StyleSheet.create({
    loading_wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
    },
    unstarted_wrapper:
    {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    unstarted_backgroundWrapper:
    {
        borderRadius: 75,
        width: 150,
        height: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    },
    unstarted_buttonStart: {
        borderRadius: 75,
        width: "100%",
        height: "100%",
        backgroundColor: Theme.colors.accent,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    unstarted_buttonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
    wrapper:
    {
        display: "flex",
        flexGrow: 1,
        height: "100%"
    },
    fab:
    {
        marginBottom: 56
    }
});


interface ReduxStateProps
{
    user: ReduxUser,
    inspecting: ReduxInspecting
}

interface ReduxDispatchProps
{
    onInspectStoryStart: (storyId: string) => ActionStartInspectStory,
}

type Props = ReduxStateProps & ReduxDispatchProps & WithLoadingProps & WithDatabaseProps & WithDialogContainerProps &
{
    navigation: HiEfficiencyNavigator
}

type State =  
{
    lifecycle: StoryLifecycle | "Loading",
    sections: Array<AbstractListCollapsible_SectionType<InterruptionModelType>>,
    open: boolean,
    user: ReduxUser
}

const mapStateToProps = (state: ReduxState): ReduxStateProps =>
{
    return {
        user: state.user!,
        inspecting: state.inspecting
    }
}

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatchProps =>
{
    return {
        onInspectStoryStart: (storyId: string) => dispatch(new ActionStartInspectStory(storyId)),
    }
} 

class ScreenStoryDetailsTimeline extends Component<Props, State> implements WithOverflowMenu_RequiredFunctions
{
    static displayName = "Story Details Interruptions";

    private story: ReduxStory
    private currentlyEditingInterruptionIndex?: number;

    private dialogInterruptionEdit: DialogInterruptionEdit | null = null;
    private dialogEditTimeFinish: DialogPreferenceDateTime | null = null;
    private dialogEditTimeStart: DialogPreferenceDateTime | null = null;

    constructor(props: Props)
    {
        super(props);

        this.story = props.user.teams[props.inspecting.team!].stories[props.inspecting.story!];

        this.state = 
        {
            user: props.user,
            lifecycle: this.getLifecycleFromStory(this.story),
            sections: this.getSectionsFromStory(this.story),
            open: false,
        }

        this.setLoading(props);
    }
    
    componentWillReceiveProps = (props: Props) =>
    {
        //console.log("WILL RECEIVE PROPS: " + UtilityObject.stringify(props.user.teams[props.inspecting.team!].stories[props.inspecting.story!]));
        const teamId = props.inspecting.team;
        if(teamId == undefined)
        {   return;}

        if(isEqual(this.state.user, props.user))
        {   return;}

        const team = props.user.teams[teamId];
        if(team == undefined)
        {   return;}

        const story = team.stories[this.story.document.id!];
        if(story == undefined)
        {   return;}

        if(this.story != story)
        {
            if((this.story == undefined && story != undefined) || isEqual(this.story.document.data.name, story.document.data.name) == false)
            {   this.props.navigation.setParams({ subtitle: story.document.data.name });}

            const sections = this.getSectionsFromStory(story);
            const lifecycle = this.getLifecycleFromStory(story);
            
            this.setState({sections: sections, lifecycle: lifecycle});
            this.story = story;
        }

        this.setLoading(props);
    }

    setLoading = (_props: Props) =>
    {   
        //console.log("SET LOADING: this.story.loaded: " + this.story.loaded);
        this.props.setLoading(this.story == undefined || this.story.interruptions == undefined || this.story.loaded == false);
    }

    componentDidMount() 
    {   this.props.onInspectStoryStart(this.story.document.id!);}

    getOverflowMenuItems = (): Array<MenuOptionProps & {key: string}> =>
    {
        return [
            {text: "Unstart Story", onSelect: () => this.onOverflowMenuItemSelected(ActionType.UNSTART), key: "Unstart Story"}
        ];
    }

    shouldShowOverflowMenu = () =>
    {   
        var shouldShow = false;
        if(this.state.lifecycle == "Uninterrupted")
        {
            if(this.story == undefined || this.story.interruptions == undefined)
            {   shouldShow = true;}
            else
            {
                const keys = Object.keys(this.story.interruptions);
                if(keys.length == 0)
                {   shouldShow = true;}
                else
                {
                    const foundOneWithInterruptions = keys.some(key => 
                    {
                        const value = this.story.interruptions[key];
                        return value.document.data.interruptions.length > 0;
                    });

                    shouldShow = ! foundOneWithInterruptions;
                }
            }
        }

        return shouldShow;
    }

    onStartStory = async () => 
    {   
        if(this.story == undefined)
        {   return;}

        await this.props.database.inDialog("dialog-starting-story", this.props.addDialog, this.props.removeDialog, "Starting Story", async (execute) => 
        {
            const update = this.props.database.updateStory(this.props.inspecting.team!, this.story.document.id!, this.story.document.data, {startedOn: {$set: new Date()}});
            await execute(update, false);
        });
    }

    addInterruption = async (category: InterruptionType, timestamp: Date) => 
    {
        if(this.story == undefined)
        {   return;}

        if(timestamp == undefined)
        {   timestamp = new Date();}

        const interruption: EntityInterruption = EntityInterruption.create(category.dbId, timestamp);
        const inspecting = this.props.inspecting;
        
        await this.props.database.inDialog("dialog-adding-interruption", this.props.addDialog, this.props.removeDialog, "Adding Interruption", async (execute) => 
        {
            const interruptions = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
            const creation = this.props.database.createInterruption(inspecting.team!, inspecting.story!, this.props.user.document.id!, interruptions, interruption);
            await execute(creation, false);
        });
    } 
    
    getFirstInterruption = () =>
    {
        if(this.story == undefined || this.story.interruptions == undefined || Object.keys(this.story.interruptions).length == 0)
        {   return undefined;}

        const interruptions = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
        return interruptions.interruptions[0];
    }

    getLastInterruption = () =>
    {
        if(this.story == undefined || this.story.interruptions == undefined || Object.keys(this.story.interruptions).length == 0)
        {   return undefined;}

        const interruptions = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
        return interruptions.interruptions[interruptions.interruptions.length - 1];
    }

    getFabGroupActions = () =>
    {
      var actions = [];

      switch(this.state.lifecycle)
      {
          case "Uninterrupted":
          case "Interrupted":
            actions.push({ icon: "done", label: "Finish Story",  onPress: () => this.onFabMenuItemSelected(ActionType.FINISH) });
            break;

        case "Finished":
            actions.push({ icon: "lock-open", label: "Reopen Story", onPress: () => this.onFabMenuItemSelected(ActionType.REOPEN)});
            break;
      }
  
      return actions;
    }

    onFabMenuItemSelected = async (action: ActionType) =>
    {
        switch(action) 
        {
            case ActionType.FINISH:

                if(this.story == undefined)
                {   return;}

                const now = new Date();
                if(this.story.document.data.startedOn == undefined || this.story.document.data.startedOn > now)
                {
                    alert("The story cannot be finished while the start time is in the future.");
                    return;
                }

                const keys = Object.keys(this.story.interruptions);
                const usersWithFutureInterruptions: Array<string> = [];
                const users = await DocumentUser.getAllAsMap(this.story);
                keys.forEach(key => 
                {
                    const interruptionsOfUser = this.story.interruptions[key];
                    interruptionsOfUser.document.data.interruptions.forEach(interruption => 
                    {
                       if(interruption.timestamp > now || (interruption.duration && new Date(interruption.timestamp.getTime() + interruption.duration) > now))
                       {    
                           const user = users.get(key);
                           if(user)
                           {    usersWithFutureInterruptions.push(user.name);}
                       }
                    });
                });

                if(usersWithFutureInterruptions.length > 0)
                {
                    alert("The following users have interruptions that lie in the future. This means the story cannot be finished:\n\n" + usersWithFutureInterruptions.join(", ") + ".");
                    return;
                }

                this.showConfirmationDialog("Finish Story", "Are you sure you want to finish this story?", "Finish", async() => 
                {
                    const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
                    await this.props.database.inDialog("dialog-finishing-story", this.props.addDialog, this.props.removeDialog, "Finishing Story", async (execute) => 
                    {
                        var last = document.getLastInterruption();
                        if(last && last.duration == undefined)
                        {
                            const inspecting = this.props.inspecting;
                            const updates = {duration: {$set: now.getTime() - last.timestamp.getTime()}};

                            const update =  this.props.database.updateInterruption(inspecting.team!, inspecting.story!, this.props.user.document.id!, document, last, updates);
                            const result = await execute(update, true);;
                            if(result.successful == false)
                            {   return; }
                        }
        
                        const inspecting = this.props.inspecting;
                        const finish = this.props.database.updateStory(inspecting.team!, inspecting.story!, this.story.document.data, {finishedOn: {$set: new Date()}});
                        await execute(finish, false);
                    });
                });

                break;

            case ActionType.REOPEN:

                this.showConfirmationDialog("Reopen Story", "Are you sure you want to re-open this story?", "Reopen", async() => 
                {
                    const inspecting = this.props.inspecting;
                    await this.props.database.inDialog("dialog-reopening-story", this.props.addDialog, this.props.removeDialog, "Reopening Story", async (execute) => 
                    {
                        const update = this.props.database.updateStory(inspecting.team!, inspecting.story!, this.story.document.data, {finishedOn: {$set: undefined}});
                        await execute(update, false);
                    });
                });
                break;
        }
    }

    onInterruptionSelected = (type: InterruptionType) =>
    {   this.addInterruption(type, new Date());}

    onResumeFromInterruption = async () =>
    {
        if(this.story == undefined)
        {   return;}

        const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
        const last = document.getLastInterruption();
        if(last && last.duration == undefined)
        {
            const inspecting = this.props.inspecting;
            const updates = {duration: {$set: new Date().getTime() - last.timestamp.getTime()}};
            
            await this.props.database.inDialog("dialog-resuming-work", this.props.addDialog, this.props.removeDialog, "Resuming Work", async (execute) => 
            {
                const update = this.props.database.updateInterruption(inspecting.team!, inspecting.story!, this.props.user.document.id!, document, last, updates);
                await execute(update, false);
            });
        }
    }

    validateTimeStarted = (storageValue: DialogPreferenceDateTime_StorageValue) =>
    {
        if(storageValue.timestamp == undefined)
        {   return "Please enter a start time first.";}
        
        const first = this.getFirstInterruption();
        if(first)
        {   
            if(storageValue.timestamp > first.timestamp)
            {   return "The start time of a story can not be after the start time of the first interruption.";}
        }
        else 
        {   
            if(this.story == undefined)
            {   return "Something went wrong, please try again.";}

            const finishedOn = this.story.document.data.finishedOn;
            if(finishedOn != undefined && storageValue.timestamp > finishedOn)
            {   return "The start time of a story can not be after the finish time of the story.";}           
        }

        return undefined;
    }
    
    validateTimeFinished = (storageValue: DialogPreferenceDateTime_StorageValue) =>
    {
        if(storageValue.timestamp == undefined)
        {   return "Please enter a start time first.";}
        
        const last = this.getLastInterruption();
        if(last)
        {   
            const end = new Date(last.timestamp.getTime() + (last.duration || 0));
            if(storageValue.timestamp < end)
            {   return "The finish time of a story can not be before the end time of the previous interruption.";}
        }
        else if(this.story == undefined)
        {   return "Something went wrong, please try again.";}
        else if(storageValue.timestamp < this.story.document.data.startedOn!)
        {   return "The finish time of a story can not be before the start time of the story.";}

        return undefined;
    }
    
    onEditTimeStart = async (storageValue: DialogPreferenceDateTime_StorageValue | null) =>
    {
        if(this.story == undefined || storageValue == null || storageValue.timestamp == undefined || storageValue.timestamp == this.story.document.data.startedOn)
        {   return false;}

        const inspecting = this.props.inspecting;

        await this.props.database.inDialog("dialog-updating-story-start", this.props.addDialog, this.props.removeDialog, "Updating Start Story", async (execute) => 
        {
            const update = this.props.database.updateStory(inspecting.team!, inspecting.story!, this.story.document.data, {startedOn: {$set: storageValue.timestamp}});
            await execute(update, false);
        });

        return true;
    }

    onEditTimeFinish = async (storageValue: DialogPreferenceDateTime_StorageValue | null) =>
    {
        if(this.story == undefined || storageValue == null || storageValue.timestamp == undefined || storageValue == this.story.document.data.finishedOn)
        {   return false;}

        const inspecting = this.props.inspecting;

        await this.props.database.inDialog("dialog-updating-story-finish", this.props.addDialog, this.props.removeDialog, "Updating Finish Time", async (execute) => 
        {
            const update = this.props.database.updateStory(inspecting.team!, inspecting.story!, this.story.document.data, {finishedOn: {$set: storageValue.timestamp}});
            await execute(update, false);
        });

        return true;
    }

    onOverflowMenuItemSelected = async (action: ActionType) => 
    {
        switch(action)
        {
            case ActionType.UNSTART:
                if(this.story == undefined)
                {   return;}

                const inspecting = this.props.inspecting;

                this.showConfirmationDialog("Unstart Story", "Are you sure you want to unstart this story?", "Unstart", async() => 
                {
                    await this.props.database.inDialog("dialog-unstarting-story", this.props.addDialog, this.props.removeDialog, "Unstarting Story", async (execute) => 
                    {
                        const update = this.props.database.updateStory(inspecting.team!, inspecting.story!, this.story.document.data, {startedOn: {$set: undefined}});
                        await execute(update, false);
                    });
                });
                break;
        }
    }


    showConfirmationDialog = (title: string, message: string, positiveText: string, onConfirm: () => any) =>
    {
        const listener = async (_baseComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) => 
        {
            if(action != "Positive")
            {   return ;}

            onConfirm();
        };

        const id = "confirmation-dialog";
        const removeDialog = () =>
        {
            this.props.removeDialog(id);
        }

        const addDialog = (ref: AdjustedCallbackReference<AbstractDialog>) => 
        {   
            return <DialogConfirmation key={id} visible={true} baseRef={ref} title={title} message={message} textPositive={positiveText} onActionClickListener={listener} onClose={removeDialog} />
        };

        this.props.addDialog(addDialog, id);
    }

    onContextMenuItemSelected = async (item: InterruptionModelType, _index: number, action: ActionOption) =>
    { 
        if(ModelInterruption.is(item))
        {
            switch(action.id) 
            {
                case ActionType.DELETE:
                
                    if(this.story == undefined)
                    {   return;}
                    const inspecting = this.props.inspecting;

                    this.showConfirmationDialog("Delete Interruption", "Are you sure you want to delete this interruption?", "Delete", async () => 
                    {
                        await this.props.database.inDialog("dialog-deleting-interruption", this.props.addDialog, this.props.removeDialog, "Deleting Interruption", async (execute) => 
                        {
                            const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);

                            const del = this.props.database.deleteInterruption(inspecting.team!, inspecting.story!, this.props.user.document.id!, document, item.index);
                            await execute(del, false);
                        });
                    });
                    break; 
    
                case ActionType.EDIT:
                
                    if(this.story == undefined)
                    {   return;}

                    if(this.dialogInterruptionEdit)
                    {
                        const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
                        var next = document.interruptions[item.index + 1];
                        var previous = document.interruptions[item.index - 1];
                        
                        if(next == undefined && this.story.document.data.finishedOn != undefined)
                        {   next = EntityInterruption.create(0, new Date(this.story.document.data.finishedOn));}
    
                        if(previous == undefined && this.story.document.data.startedOn != undefined)
                        {   previous = EntityInterruption.create(0, new Date(this.story.document.data.startedOn));}
                        
                        this.currentlyEditingInterruptionIndex = item.index;
                        if(this.dialogInterruptionEdit.base)
                        {  
                            var storageValue: DialogInterruptionEdit_StorageValue = 
                            {
                                type: item.type, 
                                start: item.timestamp, 
                                end: new Date(item.timestamp.getTime() + (item.duration || 0)), 
                                next: next, 
                                previous: previous
                            }       

                            this.dialogInterruptionEdit.base.setStorageValue(storageValue);
                            if(this.dialogInterruptionEdit.base.base)
                            {   this.dialogInterruptionEdit.base.base.setVisible(true);}
                        }
                        
                    }
                break;
            }
        }
        else if(ModelStart.is(item))
        {
            switch(action.id)
            {
                case ActionType.EDIT:
                if(this.dialogEditTimeStart && this.dialogEditTimeStart.base && this.dialogEditTimeStart.base.base)
                {   this.dialogEditTimeStart.base.base.setVisible(true);}
                break;
            }
        }
        else if(ModelFinish.is(item))
        {
            switch(action.id)
            {
                case ActionType.EDIT:
                if(this.dialogEditTimeFinish && this.dialogEditTimeFinish.base && this.dialogEditTimeFinish.base.base)
                {   this.dialogEditTimeFinish.base.base.setVisible(true);}
                break;
            }
        }
    }

    onInterruptionEdited = async (storageValue: DialogInterruptionEdit_StorageValue | null) =>
    {
        if(this.story == undefined || storageValue == null)
        {
            this.log("onInterruptionEdited", "Early exit due to undefined storage value or story.");
            return false;
        }

        if(storageValue.end == undefined || storageValue.start == undefined)
        {
            this.log("onInterruptionEdited", "Early exit due to empty storage value fields.");
            return false;
        }

        const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
        const current = document.interruptions[this.currentlyEditingInterruptionIndex!];
        const inspecting = this.props.inspecting;
        const updates = {timestamp: {$set: storageValue.start}, duration: {$set: storageValue.end!.getTime() - storageValue.start!.getTime()}, category: {$set: storageValue.type.dbId}};
        
        await this.props.database.inDialog("dialog-updating-interruption", this.props.addDialog, this.props.removeDialog, "Updating Interruption", async (execute) => 
        {
            const document = DocumentInterruptions.fromReduxInterruptions(this.story.interruptions, this.props.user.document.id!);
            const update = this.props.database.updateInterruption(inspecting.team!, inspecting.story!, this.props.user.document.id!, document, current, updates);
            await execute(update, false);
        });

        return true;
    }

    getListComponent = () => 
    {   
        return (
            <ListInterruptions containerHasFab={true} sections={this.state.sections} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        );

    }


    getDialogComponent = () =>
    {  
        var start = new Date();
        var end = new Date();

        if(this.story != undefined)
        {   
            start = this.story.document.data.startedOn || new Date();
            end = this.story.document.data.finishedOn || new Date();
        }

        return (
             <View> 
                <DialogInterruptionEdit storageValue={{type: InterruptionType.Values[0]}} title="Edit Interruption" visible={false} onSubmit={this.onInterruptionEdited} ref={instance => this.dialogInterruptionEdit = instance} />
                <DialogPreferenceDateTime onValueValidation={this.validateTimeStarted}  storageValue={{timestamp: start}} ref={i => this.dialogEditTimeStart = i}  mode={"datetime-separate"} title="Edit Start"  visible={false} onSubmit={this.onEditTimeStart}  />
                <DialogPreferenceDateTime onValueValidation={this.validateTimeFinished} storageValue={{timestamp: end}} ref={i => this.dialogEditTimeFinish = i} mode={"datetime-separate"} title="Edit Finish" visible={false} onSubmit={this.onEditTimeFinish} />
             </View>
         );
    }

    getFabComponent = (icon: string, action: ActionType, shouldHaveBottomMargin: boolean) =>
    {
        return <InputFloatingActionButton enabled={true} shouldHaveBottomMargin={shouldHaveBottomMargin} icon={icon} onPress={() => this.onFabMenuItemSelected(action)} />
    }

    render()
    {
        switch(this.state.lifecycle)
        {
            case "Loading":
                return ( 
                    <View style={styles.loading_wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} borderWidth={3} />
                    </View>);
                break;

            case "Unstarted":
                return (
                    <View style={styles.unstarted_wrapper}>
                        {this.getDialogComponent()}
                        <View style={styles.unstarted_backgroundWrapper}>
                            <TouchableRipple style={styles.unstarted_buttonStart} theme={Theme} onPress={this.onStartStory} borderless={true}>
                                <Text style={styles.unstarted_buttonText}>START</Text>
                            </TouchableRipple>
                        </View>
                    </View>);
                break;

            case "Uninterrupted":
                return( 
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}

                        <View>
                            <BarActionButtons>
                                {InterruptionType.Values.map((type, _index) => {
                                    return <ButtonSquare key={type.dbId} iconName={type.iconName} iconColor={Color.fromHexadecimal("#FFFFFF")} title={type.title} onPress={() => this.onInterruptionSelected(type)}/>
                                })}
                            </BarActionButtons>
                        </View>
                        {this.getFabComponent("done", ActionType.FINISH, true)}
                    </View>);
                break;

            case "Interrupted":
                return (
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}

                        <View>
                            <BarActionButtons>
                                <ButtonSquare key={"resume"} iconName="play-arrow" iconColor={Color.fromHexadecimal("#FFFFFF")} title="Resume Work" onPress={this.onResumeFromInterruption}/>
                            </BarActionButtons>
                        </View>
                        {this.getFabComponent("done", ActionType.FINISH, true)}
                    </View>);
                break;
 
            case "Finished":
                //console.log(new Date().getTime() + " - START RENDER");
                const v = 
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}
                        {this.getFabComponent("lock-open", ActionType.REOPEN, false)}
                    </View>;
                    //console.log(new Date().getTime() + " - END RENDER");

                    return v;
                break;

            default: 
                return null; 
        } 
    }

    getLifecycleFromStory = (story: ReduxStory | undefined) =>
    {
        if(story == undefined)
        {   return "Loading";}
        
        const data = story.document.data;
        if(data.startedOn == undefined)
        {   return "Unstarted";}
        else if (data.finishedOn != undefined)
        {   return "Finished";}
        else 
        {
            console.log("GET LIFECYCLE: " + UtilityObject.stringify(story.interruptions));
            const document = DocumentInterruptions.fromReduxInterruptions(story.interruptions, this.props.user.document.id!);
            if(document.interruptions.length == 0)
            {   return "Uninterrupted";}

            const last = document.getLastInterruption();
            if(last == undefined || last.duration != undefined)
            {   return "Uninterrupted";}
            else
            {   return "Interrupted";}
        }
    }

    getSectionsFromStory = (story: ReduxStory | undefined): Array<AbstractListCollapsible_SectionType<InterruptionModelType>> =>
    {        
        if(story == undefined)
        {   return [];}


        const data = story.document.data;
        const document = DocumentInterruptions.fromReduxInterruptions(story.interruptions, this.props.user.document.id!);


        var sections: Array<AbstractListCollapsible_SectionType<InterruptionModelType>> = [];
        var previousDate = null;
        var section: AbstractListCollapsible_SectionType<InterruptionModelType> | null = null;

        //Add the "started" item.
        if(data.startedOn)
        {
            previousDate = asDate(data.startedOn);

            const startItem: ModelStart = new ModelStart(data.startedOn);
            section =  
            {
                title: previousDate,
                items:[startItem],
            };

            sections.push(section);
        }

        for(var index = 0 ; index < document.interruptions.length ; index++)
        { 
            const interruption = document.interruptions[index];
            const type = InterruptionType.fromDatabaseId(interruption.category);

            const date = asDate(interruption.timestamp);
            const item: ModelInterruption = new ModelInterruption(interruption.timestamp, interruption.duration, type.title, type.iconName, index, type); 

            if(previousDate == null || previousDate != date)
            {    
                section = 
                {
                    title: date,
                    items: [item] 
                };
                sections.push(section);
            }
            else
            {   section!.items.push(item);} 

            previousDate = date;
        }
    
        //Add the productivity items in between the interruptions.
        for(var index = 0 ; index < sections.length ; index ++)
        {
            section = sections[index];
            if(section.items.length == 0)
            {   continue;}

            var previousInterruption = section.items[0];
            var newItems: Array<InterruptionModelType> = [previousInterruption];
            for(var inner = 1 ; inner < section.items.length; inner ++) 
            {
                var currentInterruption = section.items[inner];
                const productiveTimestamp: number = previousInterruption.timestamp.getTime() + (previousInterruption.duration || 0);
                
                const productive = new ModelProductive(new Date(productiveTimestamp), currentInterruption.timestamp.getTime() - productiveTimestamp,);

                if(productive.duration && productive.duration > 0)
                {   newItems.push(productive);}

                newItems.push(currentInterruption);
                previousInterruption = currentInterruption;
            }

            section.items = newItems;
            sections.splice(index, 1, section);
        }

        //Add the "finished" item.
        if(data.finishedOn)
        {
            var date = asDate(new Date(data.finishedOn));

            const finishItem = new ModelFinish(data.finishedOn);
            if(previousDate != date)
            {
                section = 
                {
                    title: date,
                    items: [finishItem]
                };
                sections.push(section);
            }
            else
            {   
                const lastInterruption = section!.items[section!.items.length - 1];
                const productiveTimestamp = new Date(lastInterruption.timestamp.getTime() + lastInterruption.duration!);
                const productiveDuration = data.finishedOn.getTime() - productiveTimestamp.getTime();

                const productive: ModelProductive = new ModelProductive(productiveTimestamp, productiveDuration);

                section!.items.push(productive);
                section!.items.push(finishItem);
            }
        }

        var last = sections[sections.length - 1]
        if(last)
        {   last.open = true;}

        return sections;
    }

    private log = (method:string,  message: string) =>
    {   console.log(ScreenStoryDetailsTimeline.displayName + " - " + method + " - " + message);}
} 

const hoc1 = WithReduxSubscription<ScreenStoryDetailsTimeline, ScreenStoryDetailsTimeline, Props, ReduxStateProps, ReduxDispatchProps>(mapStateToProps, mapDispatchToProps)(ScreenStoryDetailsTimeline);
const hoc2 = WithOverflowMenu(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = WithDialogContainer(hoc3);
const hoc5 = WithLoading(hoc4);

export default hoc5;