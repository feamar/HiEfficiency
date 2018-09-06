import React, {Component} from "react";
import {View, TouchableNativeFeedback} from "react-native";
import { TouchableRipple, Text, Dimensions, FAB, Portal} from "react-native-paper";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import ListInterruptions from "../lists/instances/interruptions/ListInterruptions";
import InterruptionType from "../../enums/InterruptionType";
import {asDate } from "../util/DateUtil";
import BarActionButtons from "../bars/BarActionButtons";
import Color from 'react-native-material-color';
import ButtonSquare from "../bars/buttons/ButtonSquare";
import { ACTION_DELETE_INTERRUPTION, ACTION_EDIT_INTERRUPTION } from "../lists/instances/interruptions/ListItemInterruption";
import UtilityTime from "../../utilities/UtilityTime";
import DialogInterruptionEdit from "../dialogs/interruptions/DialogInterruptionEdit";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import UtilityObject from "../../utilities/UtilityObject";
import UtilityScreen from "../../utilities/UtilityScreen";
import DialogConfirmation, {DIALOG_ACTION_POSITIVE, DIALOG_ACTION_NEGATIVE} from "../dialogs/instances/DialogConfirmation";
import withFloatingActionButton from "../../hocs/WithFloatingActionButton";

const LIFECYCLE_LOADING = 0;
const LIFECYCLE_UNSTARTED = 1;
const LIFECYCLE_UNINTERRUPTED = 2;
const LIFECYCLE_INTERRUPTED = 3;
const LIFECYCLE_FINISHED = 4;

const ACTION_FINISH_STORY = 0;
const ACTION_REOPEN_STORY = 1;

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

class ScreenStoryDetailsInterruptions extends Component
{
    static displayName = "Story Details Interruptions";
    static navigationOptions = ({navigation}) => 
    {
        const options =  {
            title: "Story Details",
            subtitle: navigation.state.params.subtitle
        };

        const parent = navigation.dangerouslyGetParent();
        if(parent)
        {
               parent.navigationOptions = options;
               parent.setParams(options);
        }
        
        return options;
    }

    constructor(props)
    {
        super(props);

        this.unsubscribers = [];
        this.story = props.navigation.getParam('story');

        this.state = 
        {
            lifecycle: this.getLifecycleFromDocuments(this.story, this.interruptionsOfUser),
            sections: this.getSectionsFromDocuments(this.story, this.interruptionsOfUser),
            open: false,
            shouldFabGroupRender: true
        }

        this.props.navigation.setParams({ subtitle: this.story.data().name })
    }

    onStoryDocumentChanged = (story) =>
    { 
        this.story = story;

        const sections = this.getSectionsFromDocuments(this.story, this.interruptionsOfUser);
        const lifecycle = this.getLifecycleFromDocuments(this.story, this.interruptionsOfUser);

        this.setState({
            sections: sections,
            lifecycle: lifecycle
        })
    }

    onInterruptionsOfUserChanged = (document) =>
    {
        this.interruptionsOfUser = document;

        const sections = this.getSectionsFromDocuments(this.story, this.interruptionsOfUser);
        const lifecycle = this.getLifecycleFromDocuments(this.story, this.interruptionsOfUser);

        this.setState({
            sections: sections,
            lifecycle: lifecycle
        })
    }
 
    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

    setLifecycleTo = (lifecycle) =>
    {   this.setState({lifecycle: lifecycle});}  

    componentWillMount = () =>
    {
        unsubscriber = this.story.ref.onSnapshot(this.onStoryDocumentChanged);
        this.unsubscribers.push(unsubscriber);

        FirebaseAdapter.getCurrentUserOrThrow(user => 
        {  
            const documentReference = FirebaseAdapter.getInterruptionsFromStory(this.story).doc(user.uid);
            if(documentReference != undefined)
            {
                var unsubscriber = documentReference.onSnapshot(this.onInterruptionsOfUserChanged);
                this.unsubscribers.push(unsubscriber);
            }
        });
    }

    componentWillUnmount = () =>
    {
      for(var i = 0 ; i < this.unsubscribers.length ; i ++)
      {
        const unsubscriber = this.unsubscribers[i];
        if(unsubscriber && unsubscriber instanceof Function)
        {   unsubscriber();}  
      }
    }

    onStartIssue = () => 
    {   
        if(this.confirmationDialog)
        {
            this.confirmationDialog.setTitle("Start Issue");
            this.confirmationDialog.setMessage("Are you sure you want to start working on this issue?");
            this.confirmationDialog.setActionTextPositive("Start");
            this.confirmationDialog.setOnDialogActionPressedListener((action) => 
            {
                if(action != DIALOG_ACTION_POSITIVE)
                {   return;}

                this.story.ref.update({startedOn: new Date()});
                this.setLifecycleTo(LIFECYCLE_UNINTERRUPTED);
            });
            this.confirmationDialog.setVisible(true);
        }
    }

    addInterruption = (category, timestamp) => 
    {
        if(timestamp == undefined)
        {   timestamp = new Date().getTime();}

        const interruption = this.createInterruption(timestamp, undefined, category.dbId);
        const interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
        interruptions.push(interruption);

        if(interruptions.length == 1)
        {   this.interruptionsOfUser.ref.set({interruptions: interruptions});}
        else
        {   this.interruptionsOfUser.ref.update({interruptions: interruptions});}
    } 

    createInterruption = (timestamp, duration, categoryId) =>
    {
        return {
            timestamp: timestamp,
            duration: duration,
            category: categoryId
        }
    }

    getInterruptionsFromDocument = (document) =>
    {
        if(document == undefined)
        {   return [];}

        const data = document.data();
        if(data == undefined)
        {   return [];}

        return data.interruptions;
    }

    getFabGroupActions = () =>
    {
      var actions = [];

      switch(this.state.lifecycle)
      {
          case LIFECYCLE_UNINTERRUPTED:
          case LIFECYCLE_INTERRUPTED:
            actions.push({ icon: "done", label: "Finish Story",  onPress: () => this.onFabMenuItemSelected(ACTION_FINISH_STORY) });
            break;

        case LIFECYCLE_FINISHED:
            actions.push({ icon: "lock-open", label: "Reopen Story", onPress: () => this.onFabMenuItemSelected(ACTION_REOPEN_STORY)});
            break;
      }
  
      return actions;
    }

    onFabMenuItemSelected = (action) =>
    {
        switch(action) 
        {
            case ACTION_FINISH_STORY:

                if(this.confirmationDialog)
                {
                    this.confirmationDialog.setTitle("Finish Story");
                    this.confirmationDialog.setMessage("Are you sure you want to finish this story?");
                    this.confirmationDialog.setOnDialogActionPressedListener((action) => 
                    {
                        if(action != DIALOG_ACTION_POSITIVE)
                        {   return; }

                        const interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
                        if(interruptions.length > 0)
                        {
                            const last = interruptions[interruptions.length - 1];
                            if(last.duration == undefined)
                            {   last.duration = new Date().getTime() - last.timestamp;}
        
                            this.interruptionsOfUser.ref.update({interruptions: interruptions});
                        }
        
                        this.story.ref.update({finishedOn: new Date()});
        
                        this.setLifecycleTo(LIFECYCLE_FINISHED);
                    }); 
                    this.confirmationDialog.setVisible(true);
                }
                break;

            case ACTION_REOPEN_STORY:
                if(this.confirmationDialog)
                {
                    this.confirmationDialog.setTitle("Reopen Story");
                    this.confirmationDialog.setMessage("Are you sure you want to re-open this story?");
                    this.confirmationDialog.setOnDialogActionPressedListener((action) => 
                    {
                        if(action != DIALOG_ACTION_POSITIVE)
                        {   return;}

                        this.story.ref.update({finishedOn: null}); 
                        this.setLifecycleTo(this.getLifecycleFromDocuments(this.story));
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

    onResumeFromInterruption = () =>
    {
        let interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
        if(interruptions.length > 0)
        {
            const last = interruptions[interruptions.length - 1];
            if(last.duration == undefined)
            {   last.duration = new Date().getTime() - last.timestamp;}
        }

        this.interruptionsOfUser.ref.update({interruptions: interruptions});
    }

    onContextMenuItemSelected = (item, index, action) =>
    { 
        switch(action) 
        {
            case ACTION_DELETE_INTERRUPTION:
                var interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
                interruptions.splice(item.id, 1);
                this.interruptionsOfUser.ref.update({interruptions: interruptions});

                if(interruptions.length == 0)
                {   this.interruptionsOfUser.ref.delete();}
                break; 

            case ACTION_EDIT_INTERRUPTION:
                if(this.dialogInterruptionEdit)
                {
                    const interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
                    var next = interruptions[item.id + 1];
                    var previous = interruptions[item.id - 1];

                    if(next == undefined && this.story.data().finishedOn != undefined)
                    {   next = this.createInterruption(new Date(this.story.data().finishedOn).getTime(), 0, undefined);}

                    if(previous == undefined && this.story.data().startedOn != undefined)
                    {   previous = this.createInterruption(new Date(this.story.data().startedOn).getTime(), 0, undefined);}

                    this.currentlyEditingInterruptionIndex = item.id;
                    this.dialogInterruptionEdit.onValueChange({type: item.type.dbId, start: item.timestamp, end: item.timestamp + item.duration, next: next, previous: previous});
                    this.dialogInterruptionEdit.setVisible(true);
                }
            break;
        }

    }

    onInterruptionEdited = (storageValue) =>
    {
        const interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
        interruptions[this.currentlyEditingInterruptionIndex].timestamp = storageValue.start;
        interruptions[this.currentlyEditingInterruptionIndex].duration = storageValue.end - storageValue.start;
        interruptions[this.currentlyEditingInterruptionIndex].category = storageValue.type;

        console.log("STORAGE VALUE: " + JSON.stringify(JSON.decycle(interruptions[this.currentlyEditingInterruptionIndex])));

        this.interruptionsOfUser.ref.update({interruptions: interruptions});
    }

    getListComponent = () => 
    {   return <ListInterruptions style={styles.list} containerHasFab={true} sections={this.state.sections} onContextMenuItemSelected={this.onContextMenuItemSelected} />}

    getDialogComponent = () =>
    {  
         return (
             <View>
                <DialogInterruptionEdit title="Edit Interruption" visible={false} onDialogSubmitted={this.onInterruptionEdited} ref={instance => this.dialogInterruptionEdit = instance} />
                <DialogConfirmation ref={i => this.confirmationDialog = i}/>
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
                        {this.getFabComponent("done", ACTION_FINISH_STORY, true)}
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
                        {this.getFabComponent("done", ACTION_FINISH_STORY, true)}
                    </View>);
                break;
 
            case LIFECYCLE_FINISHED:
                return (
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}
                        {this.getFabComponent("lock-open", ACTION_REOPEN_STORY)}
                    </View>);
                break;

            default: 
                return null; 
        } 
    }

    getLifecycleFromDocuments = (documentStory, documentInterruptions) =>
    {
        const data = documentStory.data();
        if(data.startedOn == undefined)
        {   return LIFECYCLE_UNSTARTED;}
        else if (data.finishedOn != undefined)
        {   return LIFECYCLE_FINISHED;}
        else 
        {
            var interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);
            if(interruptions.length == 0)
            {   return LIFECYCLE_UNINTERRUPTED;}

            const last = interruptions[interruptions.length - 1];
            if(last.duration == undefined)
            {   return LIFECYCLE_INTERRUPTED;}
            else
            {   return LIFECYCLE_UNINTERRUPTED;}
        }
    }

    getSectionsFromDocuments = (documentStory, documentInterruptions) =>
    {
        const story = documentStory.data();
        const interruptions = this.getInterruptionsFromDocument(this.interruptionsOfUser);

        var sections = [];
        var previousDate = null;
        var section = null;

        //Add the "started" item.
        if(story.startedOn)
        {
            previousDate = asDate(new Date(story.startedOn));
           
            const startItem = {
                iconName: "location-on",
                title: "Started",
                timestamp: story.startedOn.getTime(),
                duration: 0,
                id: -1
            }
            
            section = {
                title: previousDate,
                items:[startItem]
            };

            sections.push(section);
        }

        //Add the interruptions.
        for(var index = 0 ; index < interruptions.length ; index++)
        { 
            const interruption = interruptions[index];
            const type = InterruptionType.fromDatabaseId(interruption.category);

            const date = asDate(new Date(interruption.timestamp));
            const item = {
                iconName: type.iconName,
                title: type.title,
                timestamp: interruption.timestamp,
                id: index,
                editable: interruption.duration != undefined,
                deletable: interruption.duration != undefined,
                selectable: true,
                duration: interruption.duration,
                type: type
            };
            
            if(previousDate == null || previousDate != date)
            {    
                section = {
                    title: date,
                    items: [item] 
                };

                sections.push(section);
            }
            else
            {   section.items.push(item);} 

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
                const productiveTimestamp = previousInterruption.timestamp + previousInterruption.duration;
                
                var productive =  {
                    iconName: "build",  
                    iconColor: "transparent",
                    timestamp: productiveTimestamp,
                    id: index + "." + inner,
                    duration: currentInterruption.timestamp - productiveTimestamp
                };

                if(productive.duration > 0)
                {   newItems.push(productive);}

                newItems.push(currentInterruption);
                previousInterruption = currentInterruption;
            }

            section.items = newItems;
            sections.splice(index, 1, section);
        }

        //Add the "finished" item.
        if(story.finishedOn)
        {
            var date = asDate(new Date(story.finishedOn));

            const finishItem = {
                iconName: "location-on",
                title: "Finished",
                timestamp: story.finishedOn,
                id: -2
            }

            if(previousDate != date)
            {
                section = 
                {
                    title: date,
                    items: [finishItem]
                }
                sections.push(section);
            }
            else
            {   
                lastInterruption = section.items[section.items.length - 1];
                const productiveTimestamp = lastInterruption.timestamp + lastInterruption.duration;
                const productive =  {
                    iconName: "build",  
                    iconColor: "transparent",
                    timestamp: productiveTimestamp,
                    id: index + "." + inner,
                    duration: story.finishedOn.getTime() - productiveTimestamp
                };
                section.items.push(productive);
                section.items.push(finishItem);
            }
        }

        var last = sections[sections.length - 1]
        if(last)
        {   last.open = true;}

        return sections;
    }
} 


export default ScreenStoryDetailsInterruptions;