import React, {Component} from "react";
import {View} from "react-native";
import { TouchableRipple, Text, FAB} from "react-native-paper";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import ListInterruptions from "../lists/instances/interruptions/ListInterruptions";
import InterruptionType from "../../enums/InterruptionType";
import {asDate } from "../util/DateUtil";
import BarActionButtons from "../bars/BarActionButtons";
import ButtonSquare from "../bars/buttons/ButtonSquare";
import DialogInterruptionEdit from "../dialogs/interruptions/DialogInterruptionEdit";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import { MODE_DATETIME_SEPARATE } from "../dialogs/preferences/DialogPreferenceDateTime";
import ActionType from "../../enums/ActionType";
import ListItemStart from "../lists/instances/interruptions/ListItemStart";
import ListItemInterruption from "../lists/instances/interruptions/ListItemInterruption";
import ListItemProductive from "../lists/instances/interruptions/ListItemProductive";
import ListItemFinish from "../lists/instances/interruptions/ListItemFinish";
import DialogPreferenceDateTime from "../dialogs/preferences/DialogPreferenceDateTime";
import WithReduxListener from "../../hocs/WithReduxListener";
import * as Reducer from "../../redux/reducers/ReducerInspecting";
import update from "immutability-helper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import WithOverflowMenu from "../../hocs/WithOverflowMenu";
import {PARAM_NAME_INITIAL_ROUTE_NAME} from "../routing/Router";
import UtilityObject from "../../utilities/UtilityObject";
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from "../../enums/ResolveType";
import WithDialogContainer from "../../hocs/WithDialogContainer";

const isEqual = require("react-fast-compare");

const LIFECYCLE_LOADING = 0;
const LIFECYCLE_UNSTARTED = 1;
const LIFECYCLE_UNINTERRUPTED = 2;
const LIFECYCLE_INTERRUPTED = 3;
const LIFECYCLE_FINISHED = 4;

const styles = {
    loading: {
        wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
        },
        loader: {

        }
    },
    unstarted:
    {
        wrapper:
        {
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        backgroundWrapper:
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
        buttonStart: {
            borderRadius: 75,
            width: "100%",
            height: "100%",
            backgroundColor: Theme.colors.accent,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        buttonText: {
            color: "white",
            fontSize: 30,
            fontWeight: "bold"
        }
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
}    

const mapStateToProps = (state, props) =>
{
    return {
        user: state.user,
        inspecting: state.inspecting
    }
}

const mapDispatchToProps = (dispatch, props) =>
{
    return {
        onInspectStoryStart: (storyId) => dispatch(Reducer.onInspectStoryStart(storyId)),
        onInspectStoryEnd: () => dispatch(Reducer.onInspectStoryEnd())
    }
} 

class ScreenStoryDetailsInterruptions extends Component
{
    static displayName = "Story Details Interruptions";
    constructor(props)
    {
        super(props);

        this.unsubscribers = [];
        this.story = props.user.teams[this.props.inspecting.team].stories[this.props.inspecting.story];
        this.dialogs = [];

        console.log("CONSTRUCTOR STORY: " + UtilityObject.stringify(this.story));
        this.state = 
        {
            lifecycle: this.story == undefined ? LIFECYCLE_LOADING : this.getLifecycleFromStory(this.story),
            sections: this.getSectionsFromStory(this.story),
            open: false,
            shouldFabGroupRender: true
        }

        this.props.navigation.setParams({ subtitle: this.story.data.name })
        this.setLoading(props);
    }

    onReduxStateChanged = (props) =>
    {
        if(isEqual(this.state.user, props.user))
        {   return;}

        const team = props.inspecting.team;
        const story = props.user.teams[team].stories[this.story.id];
        
        if(isEqual(this.story, story) == false)
        {
            console.log(new Date().getTime() + " - ON REDUX STATE CHANGED");
            if(isEqual(this.story.data.name, story.data.name) == false)
            {   this.props.navigation.setParams({ subtitle: story.data.name })}

            const sections = this.getSectionsFromStory(story);
            const lifecycle = this.getLifecycleFromStory(story);
            
            this.setState({sections: sections, lifecycle: lifecycle});
            this.story = story;
        }

        this.setLoading(props);
    }

    setLoading = (props) =>
    {   
        console.log("SET LOADING: this.story.loaded: " + this.story.loaded);
        this.props.setLoading(this.story == undefined || this.story.interruptions == undefined || this.story.loaded == false);
    }

    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

    componentDidMount() 
    {   this.props.onInspectStoryStart(this.story.id);}

    componentWillUnmount = () =>
    {   this.props.onInspectStoryEnd();}

    getOverflowMenuItems = () =>
    {
        return [
            <MenuOption key={ActionType.UNSTART} text={"Unstart Story"} onSelect={() => this.onOverflowMenuItemSelected(ActionType.UNSTART)} />
        ];
    }

    shouldShowOverflowMenu = () =>
    {   return this.state.lifecycle != LIFECYCLE_FINISHED && this.state.lifecycle != LIFECYCLE_UNSTARTED && this.story.interruptions.length == 0}

    onStartIssue = async () => 
    {   
        if(this.confirmationDialog)
        {
            this.confirmationDialog.setTitle("Start Issue");
            this.confirmationDialog.setMessage("Are you sure you want to start working on this issue?");
            this.confirmationDialog.setActionTextPositive("Start");
            this.confirmationDialog.setOnDialogActionPressedListener(async (action) => 
            {
                if(action != ActionType.POSITIVE)
                {   return;}

                await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Starting Story", async (execute) => 
                {
                    const update = this.props.database.updateStory(this.props.inspecting.team, this.story.id, this.story.data, {startedOn: {$set: new Date()}});
                    await execute(update);
                });
            });
            this.confirmationDialog.setVisible(true);
        }
    }

    addInterruption = async (category, timestamp) => 
    {
        if(timestamp == undefined)
        {   timestamp = new Date();}

        const interruption = this.createInterruptionObject(timestamp, undefined, category.dbId);
        const inspecting = this.props.inspecting;
        
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Adding Interruption", async (execute) => 
        {
            const creation = this.props.database.createInterruption(inspecting.team, inspecting.story, this.props.user.uid, this.story.interruptions, interruption);
            await execute(creation);
        });
    } 

    createInterruptionObject = (timestamp, duration, categoryId) =>
    {
        return {
            timestamp: timestamp,
            duration: duration,
            category: categoryId
        }
    }
    
    getFirstInterruption = () =>
    {
        if(this.story.interruptions.length == 0)
        {   return undefined;}

        return this.story.interruptions[0];
    }

    getLastInterruption = () =>
    {
        if(this.story.interruptions.length == 0)
        {   return undefined;}

        return this.story.interruptions[this.story.interruptions.length - 1];
    }

    getFabGroupActions = () =>
    {
      var actions = [];

      switch(this.state.lifecycle)
      {
          case LIFECYCLE_UNINTERRUPTED:
          case LIFECYCLE_INTERRUPTED:
            actions.push({ icon: "done", label: "Finish Story",  onPress: () => this.onFabMenuItemSelected(ActionType.FINISH) });
            break;

        case LIFECYCLE_FINISHED:
            actions.push({ icon: "lock-open", label: "Reopen Story", onPress: () => this.onFabMenuItemSelected(ActionType.REOPEN)});
            break;
      }
  
      return actions;
    }

    onFabMenuItemSelected = async (action) =>
    {
        switch(action) 
        {
            case ActionType.FINISH:

                if(this.confirmationDialog)
                {
                    this.confirmationDialog.setTitle("Finish Story");
                    this.confirmationDialog.setMessage("Are you sure you want to finish this story?");
                    this.confirmationDialog.setOnDialogActionPressedListener(async (action) => 
                    {
                        if(action != ActionType.POSITIVE)
                        {   return; }

                        var interruptions = this.story.interruptions;
                        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Finishing Story", async (execute) => 
                        {
                            if(interruptions.length > 0)
                            {
                                var last = interruptions[interruptions.length - 1];
                                if(last.duration == undefined)
                                {   
                                    const inspecting = this.props.inspecting;
                                    const updates = {duration: {$set: new Date().getTime() - last.timestamp.getTime()}};

                                    const update =  this.props.database.updateInterruption(inspecting.team, inspecting.story, this.props.user.uid, this.story.interruptions, last, updates);
                                    await execute(update, true);
                                }
                            }
            
                            const inspecting = this.props.inspecting;
                            const finish = this.props.database.updateStory(inspecting.team, inspecting.story, this.story.data, {finishedOn: {$set: new Date()}});
                            await execute(finish);
                        });
                    }); 
                    this.confirmationDialog.setVisible(true);
                }
                break;

            case ActionType.REOPEN:
                if(this.confirmationDialog)
                {
                    this.confirmationDialog.setTitle("Reopen Story");
                    this.confirmationDialog.setMessage("Are you sure you want to re-open this story?");
                    this.confirmationDialog.setOnDialogActionPressedListener(async (action) => 
                    {
                        if(action != ActionType.POSITIVE)
                        {   return;}
    
                        const inspecting = this.props.inspecting;
                        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Reopening Story", async (execute) => 
                        {
                            const update = this.props.database.updateStory(inspecting.team, inspecting.story, this.story.data, {finishedOn: {$set: null}});
                            await execute(update);
                        });
                    });
                    this.confirmationDialog.setVisible(true);
                }
                break;
        }
    }

    onInterruptionSelected = (type) =>
    {
        this.addInterruption(type);
    }

    onResumeFromInterruption = async () =>
    {
        var interruptions = this.story.interruptions;
        if(interruptions.length > 0)
        {
            var last = interruptions[interruptions.length - 1];
            if(last.duration == undefined)
            {   
                const inspecting = this.props.inspecting;
                const updates = {duration: {$set: new Date().getTime() - last.timestamp.getTime()}};
                
                await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Resuming Work", async (execute) => 
                {
                    const update = this.props.database.updateInterruption(inspecting.team, inspecting.story, this.props.user.uid, this.story.interruptions, last, updates);
                    await execute(update);
                });
            }
        }
    }

    validateTimeStarted = (storageValue) =>
    {
        const first = this.getFirstInterruption();
        if(first)
        {   
            if(storageValue > first.timestamp)
            {return "The start time of a story can not be after the start time of the first interruption.";}
        }
        else 
        {   
            const finishedOn = this.story.data.finishedOn;
            if(finishedOn != undefined && storageValue > finishedOn)
            {   return "The start time of a story can not be after the finish time of the story.";}           
        }
    }
    
    validateTimeFinished = (storageValue) =>
    {
        const last = this.getLastInterruption();
        if(last)
        {   
            if(storageValue < last.timestamp)
            {   return "The finish time of an story can not be before the end time of the previous interruption.";}
        }
        else if(storageValue < this.story.data.startedOn)
        {   return "The finish time of a story can not be before the start time of the story.";}
    }
    
    onEditTimeStart = async (storageValue) =>
    {
        if(storageValue == this.story.data.startedOn)
        {   return;}

        const inspecting = this.props.inspecting;

        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Start Story", async (execute) => 
        {
            const update = this.props.database.updateStory(inspecting.team, inspecting.story, this.story.data, {startedOn: {$set: storageValue}});
            await execute(update);
        });
    }

    onEditTimeFinish = async (storageValue) =>
    {
        if(storageValue == this.story.data.finishedOn)
        {   return;}

        const inspecting = this.props.inspecting;

        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Finish Time", async (execute) => 
        {
            const update = this.props.database.updateStory(inspecting.team, inspecting.story, this.story.data, {finishedOn: {$set: storageValue}});
            await execute(update);
        });
    }

    onOverflowMenuItemSelected = async (action) => 
    {
        switch(action)
        {
            case ActionType.UNSTART:
                const inspecting = this.props.inspecting;

                await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Unstarting Story", async (execute) => 
                {
                    const update = this.props.database.updateStory(inspecting.team, inspecting.story, this.story.data, {startedOn: {$set: null}});
                    await execute(update);
                });

                break;
        }
    }

    onContextMenuItemSelected = async (item, index, action) =>
    { 
        switch(item.ListItemType)
        {
            //For interruption items.
            case ListItemInterruption:
                switch(action) 
                {
                    case ActionType.DELETE:
                        const inspecting = this.props.inspecting;

                        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Deleting Interruption", async (execute) => 
                        {
                            const del = this.props.database.deleteInterruption(inspecting.team, inspecting.story, this.props.user.uid, this.story.interruptions, item.id);
                            await execute(del);
                        });
                        break; 
        
                    case ActionType.EDIT:
                        if(this.dialogInterruptionEdit)
                        {
                            const interruptions = this.story.interruptions;
                            var next = interruptions[item.id + 1];
                            var previous = interruptions[item.id - 1];
                            
                            if(next == undefined && this.story.data.finishedOn != undefined)
                            {   next = this.createInterruptionObject(new Date(this.story.data.finishedOn), 0, undefined);}
        
                            if(previous == undefined && this.story.data.startedOn != undefined)
                            {   previous = this.createInterruptionObject(new Date(this.story.data.startedOn), 0, undefined);}
                            
                            this.currentlyEditingInterruptionIndex = item.id;
                            this.dialogInterruptionEdit.onValueChange({type: item.type, start: item.timestamp, end: new Date(item.timestamp.getTime() + item.duration), next: next, previous: previous});
                            this.dialogInterruptionEdit.setVisible(true);
                        }
                    break;
                }
                break;

            //For start items.
            case ListItemStart:
                switch(action)
                {
                    case ActionType.EDIT:
                    if(this.dialogEditTimeStart)
                    {   this.dialogEditTimeStart.setVisible(true);}
                    break;
                }
                break;

            //For start items.
            case ListItemFinish:
                switch(action)
                {
                    case ActionType.EDIT:
                    if(this.dialogEditTimeFinish)
                    {   this.dialogEditTimeFinish.setVisible(true);}
                    break;
                }
        }
    }

    onInterruptionEdited = async (storageValue) =>
    {
        const current = this.story.interruptions[this.currentlyEditingInterruptionIndex];
        const inspecting = this.props.inspecting;
        const updates = {timestamp: {$set: storageValue.start}, duration: {$set: storageValue.end - storageValue.start}, category: {$set: storageValue.type}};
        
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Interruption", async (execute) => 
        {
            const update = this.props.database.updateInterruption(inspecting.team, inspecting.story, this.props.user.uid, this.story.interruptions, current, updates);
            await execute(update);
        });
    }

    getListComponent = () => 
    {   
        return (
            <ListInterruptions style={styles.list} containerHasFab={true} sections={this.state.sections} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        );
    }

    getDialogComponent = () =>
    {  
         return (
             <View>
                <DialogInterruptionEdit title="Edit Interruption" visible={false} onDialogSubmitted={this.onInterruptionEdited} ref={instance => this.dialogInterruptionEdit = instance} />
                <DialogPreferenceDateTime onValueValidation={this.validateTimeStarted}  storageValue={this.story.data.startedOn} ref={i => this.dialogEditTimeStart = i}  mode={MODE_DATETIME_SEPARATE} title="Edit Start"  visible={false} onDialogSubmitted={this.onEditTimeStart}  />
                <DialogPreferenceDateTime onValueValidation={this.validateTimeFinished} storageValue={this.story.data.finishedOn} ref={i => this.dialogEditTimeFinish = i} mode={MODE_DATETIME_SEPARATE} title="Edit Finish" visible={false} onDialogSubmitted={this.onEditTimeFinish} />
                <DialogConfirmation ref={i => this.confirmationDialog = i}/>

                {this.dialogs.map((dialog, index) => dialog)}
             </View>
         );
    }

    getFabComponent = (icon, action, shouldHaveBottomMargin) =>
    {
        if(this.state.shouldFabGroupRender == false)
        {   return null;}

        var style = {};
        if(shouldHaveBottomMargin)
        {   
            style = {
                marginBottom: 56
            }
        }
    
        return <FAB.Group style={style} color="white" icon={icon} onPress={() => this.onFabMenuItemSelected(action)} open={false} actions={[]} onStateChange={(open) => {}} />
    }

    render()
    {

        switch(this.state.lifecycle)
        {
            case LIFECYCLE_LOADING:
                return ( 
                    <View style={styles.loading.wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
                    </View>);
                break;

            case LIFECYCLE_UNSTARTED:
                return (
                    <View style={styles.unstarted.wrapper}>
                        {this.getDialogComponent()}
                        <View style={styles.unstarted.backgroundWrapper}>
                            <TouchableRipple style={styles.unstarted.buttonStart} theme={Theme} onPress={this.onStartIssue} borderless={true}>
                                <Text style={styles.unstarted.buttonText}>START</Text>
                            </TouchableRipple>
                        </View>
                    </View>);
                break;

            case LIFECYCLE_UNINTERRUPTED:
                return( 
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}

                        <View style={styles.bar}>
                            <BarActionButtons>
                                {InterruptionType.Values.map((type, index) => {
                                    return <ButtonSquare key={type.dbId} iconName={type.iconName} iconColor="white" title={type.title} onPress={() => this.onInterruptionSelected(type)}/>
                                })}
                            </BarActionButtons>
                        </View>
                        {this.getFabComponent("done", ActionType.FINISH, true)}
                    </View>);
                break;

            case LIFECYCLE_INTERRUPTED:
                return (
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}

                        <View style={styles.bar}>
                            <BarActionButtons>
                                <ButtonSquare key={"resume"} iconName="play-arrow" iconColor="white" title="Resume Work" onPress={this.onResumeFromInterruption}/>
                            </BarActionButtons>
                        </View>
                        {this.getFabComponent("done", ActionType.FINISH, true)}
                    </View>);
                break;
 
            case LIFECYCLE_FINISHED:
                console.log(new Date().getTime() + " - START RENDER");
                const v = 
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}
                        {this.getFabComponent("lock-open", ActionType.REOPEN)}
                    </View>;
                    console.log(new Date().getTime() + " - END RENDER");

                    return v;
                break;

            default: 
                return null; 
        } 
    }

    getLifecycleFromStory = (story) =>
    {
        const data = story.data;
        if(data.startedOn == undefined)
        {   return LIFECYCLE_UNSTARTED;}
        else if (data.finishedOn != undefined)
        {   return LIFECYCLE_FINISHED;}
        else 
        {
            var interruptions = story.interruptions;
            if(interruptions.length == 0)
            {   return LIFECYCLE_UNINTERRUPTED;}

            const last = interruptions[interruptions.length - 1];
            if(last == undefined || last.duration != undefined)
            {   return LIFECYCLE_UNINTERRUPTED;}
            else
            {   return LIFECYCLE_INTERRUPTED;}
        }
    }

    getSectionsFromStory = (story) =>
    {        
        console.log(new Date().getTime() + " - START GET SECTIONS");

        const data = story.data;
        const interruptions = story.interruptions;

        //console.log("Interruptions: " + UtilityObject.stringify(story));
        var sections = [];
        var previousDate = null;
        var section = null;

        //Add the "started" item.
        if(data.startedOn)
        {
            previousDate = asDate(data.startedOn);
           
            //const startItem = <ListItemStart timestamp={data.startedOn} key={-1} />
            const startItem = { timestamp: data.startedOn, id: -1, ListItemType: ListItemStart, duration: 0}
            section = {
                title: previousDate,
                items:[startItem]
            };

            sections.push(section);
        }

        //Add the interruptions.
        for(var index = 0 ; index < interruptions.length ; index++)
        { 
            //console.log("HERE 1");
            const interruption = interruptions[index];
            const type = InterruptionType.fromDatabaseId(interruption.category);

            const date = asDate(interruption.timestamp);
            const item = {
                iconName: type.iconName,
                title: type.title,
                timestamp: interruption.timestamp,
                id: index,
                duration: interruption.duration,
                type: interruption.category,
                ListItemType: ListItemInterruption
            }

            if(previousDate == null || previousDate != date)
            {    
            //console.log("HERE 1.1");

                section = {
                    title: date,
                    items: [item] 
                };
                sections.push(section);
            }
            else
            {   
                //console.log("HERE 1.2");
                section.items.push(item);} 

            previousDate = date;
        }
    
        //Add the productivity items in between the interruptions.
        for(var index = 0 ; index < sections.length ; index ++)
        {
            section = sections[index];
            if(section.items.length == 0)
            {   continue;}

            var previousInterruption = section.items[0];
            var newItems = [previousInterruption];
            for(var inner = 1 ; inner < section.items.length; inner ++) 
            {
                var currentInterruption = section.items[inner];
                const productiveTimestamp = previousInterruption.timestamp.getTime() + previousInterruption.duration;
                
                //const productive = <ListItemProductive key={index + "." + inner} duration={currentInterruption.props.timestamp - productiveTimestamp} />
                const productive = {
                    id: index + "." + inner,
                    duration: currentInterruption.timestamp.getTime() - productiveTimestamp,
                    ListItemType: ListItemProductive,
                }

                if(productive.duration > 0)
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

            //const finishItem = <ListItemFinish timestamp={data.finishedOn} key={-2} />
            const finishItem = {timestamp: data.finishedOn, id: -2, ListItemType: ListItemFinish, duration: 0}
            if(previousDate != date)
            {
                section = {
                    title: date,
                    items: [finishItem]
                };
                sections.push(section);
            }
            else
            {   
                lastInterruption = section.items[section.items.length - 1];
                const productiveTimestamp = lastInterruption.timestamp.getTime() + lastInterruption.duration;
                const productive =  {
                    id: 999999,
                    duration: data.finishedOn - productiveTimestamp,
                    ListItemType: ListItemProductive,
                };
                section.items.push(productive);
                section.items.push(finishItem);
            }
        }

        var last = sections[sections.length - 1]
        if(last)
        {   last.open = true;}

        console.log(new Date().getTime() + " - END GET SECTIONS");


        return sections;
    }
} 
const hoc1 = WithOverflowMenu(ScreenStoryDetailsInterruptions);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);

export default WithReduxListener(mapStateToProps, mapDispatchToProps, hoc3);