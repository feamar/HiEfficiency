import React, {Component} from "react";
import {View, TouchableNativeFeedback} from "react-native";
import { TouchableRipple, Text, Dimensions } from "react-native-paper";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import ListInterruptions from "../lists/instances/interruptions/ListInterruptions";
import InterruptionType from "../../enums/InterruptionType";
import {asDate } from "../util/DateUtil";
import { FABGroup } from "react-native-paper";
import BarActionButtons from "../bars/BarActionButtons";
import Color from 'react-native-material-color';
import ButtonSquare from "../bars/buttons/ButtonSquare";
import { ACTION_DELETE_INTERRUPTION, ACTION_EDIT_INTERRUPTION } from "../lists/instances/interruptions/ListItemInterruption";
import UtilityTime from "../../utilities/UtilityTime";
import DialogInterruptionEdit from "../dialogs/interruptions/DialogInterruptionEdit";

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
        flexGrow: 1
    },
    fab:
    {
        marginBottom: 56
    }
}    

export default class ScreenStoryDetails extends Component
{
    constructor(props)
    {
        super(props);

        this.unsubscribers = [];
        this.story = props.navigation.getParam('story');
        const data = this.story.data();
        
     
        this.state = 
        {
            lifecycle: this.getLifecycleFromStory(this.story),
            sections: this.getSectionsFromStory(this.story),
            open: false,
            shouldFabGroupRender: true
        }

    }

    onStoryDocumentChanged = (story) =>
    { 
        this.story = story;
        const sections = this.getSectionsFromStory(story);
        const lifecycle = this.getLifecycleFromStory(story);

        this.setState({
            sections: sections,
            lifecycle: lifecycle
        })
    }
 
    componentWillMount = () =>
    {
        var unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.setState({shouldFabGroupRender: true})});
        this.unsubscribers.push(unsubscriber);

        unsubscriber = this.props.navigation.addListener('willBlur', (payload) => {this.setState({shouldFabGroupRender: false})});
        this.unsubscribers.push(unsubscriber);

        unsubscriber = this.story.ref.onSnapshot(this.onStoryDocumentChanged);
        this.unsubscribers.push(unsubscriber);
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
        this.story.ref.update({startedOn: new Date()});
        this.setLifecycleTo(LIFECYCLE_UNINTERRUPTED);
    }

    setLifecycleTo = (lifecycle) =>
    {   this.setState({lifecycle: lifecycle});}  

    addInterruption = (category, date) => 
    {
        if(date == false)
        {   date = new Date();}

        const data = this.story.data();
        let newInterrupts = data.interruptions !== undefined ? data.interruptions : [];
        newInterrupts.push(date);
 
        let newInterruptCats = data.interruptionCategories !== undefined ? data.interruptionCategories : [];
        if (category !== undefined) 
        {   newInterruptCats.push(category.dbId);}

        this.story.ref.update({ 
            interruptions: newInterrupts, 
            interruptionCategories: newInterruptCats
        });
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
                const interruptions = this.story.data().interruptions;
                if(interruptions.length % 2 != 0)
                {   interruptions.push(new Date());}

                this.story.ref.update({finishedOn: new Date(), interruptions: interruptions});
                this.setLifecycleTo(LIFECYCLE_FINISHED);
                break;

            case ACTION_REOPEN_STORY:
                this.story.ref.update({finishedOn: null}); 
                this.setLifecycleTo(this.getLifecycleFromStory(this.story));
                break;
        }
    }

    onInterruptionSelected = (type) =>
    {
        this.addInterruption(type, new Date());
    }

    onResumeFromInterruption = () =>
    {
        const data = this.story.data();
        let newInterrupts = data.interruptions !== undefined ? data.interruptions : [];
        newInterrupts.push(new Date());

        this.story.ref.update({ 
            interruptions: newInterrupts
        });
    }

    onContextMenuItemSelected = (item, index, action) =>
    { 
        switch(action) 
        {
            case ACTION_DELETE_INTERRUPTION:
                const newInterruptions = this.story.data().interruptions;
                newInterruptions.splice(item.id, 1);
                this.story.ref.update({interruptions: newInterruptions});
                break; 

            case ACTION_EDIT_INTERRUPTION:
                if(this.dialogInterruptionEdit)
                {
                    const interruptions = this.story.data().interruptions;
                    const next = interruptions[item.id + 2];
                    const previous = interruptions[item.id - 1];
                    this.currentlyEditingInterruptionIndex = item.id;
                    this.dialogInterruptionEdit.onValueChange({start: item.timestamp, end: new Date(item.timestamp.getTime() + item.duration), next: next, previous: previous});
                    this.dialogInterruptionEdit.setVisible(true);
                }
            break;
        }

    }

    onInterruptionEdited = (storageValue) =>
    {
        const interruptions = this.story.data().interruptions;
        interruptions[this.currentlyEditingInterruptionIndex] = storageValue.start;
        interruptions[this.currentlyEditingInterruptionIndex + 1] = storageValue.end;

        this.story.ref.update({interruptions: interruptions});
    }

    getListComponent = () => 
    {   return <ListInterruptions style={styles.list} containerHasFab={true} sections={this.state.sections} onContextMenuItemSelected={this.onContextMenuItemSelected} />}

    getDialogComponent = () =>
    {   return <DialogInterruptionEdit title="Edit Interruption" visible={false} onDialogSubmitted={this.onInterruptionEdited} ref={instance => this.dialogInterruptionEdit = instance} />}

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
                        {this.state.shouldFabGroupRender && <FABGroup style={styles.fab} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
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
                        {this.state.shouldFabGroupRender && <FABGroup style={styles.fab} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
                    </View>);
                break;
 
            case LIFECYCLE_FINISHED:
                return (
                    <View style={styles.wrapper}>
                        {this.getListComponent()}
                        {this.getDialogComponent()}
                        {this.state.shouldFabGroupRender && <FABGroup color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
                    </View>);
                break;

            default: 
                return null; 
        } 
    }

    getLifecycleFromStory = (story) =>
    {
        const data = story.data();
        if(data.startedOn === undefined)
        {   return LIFECYCLE_UNSTARTED;}
        else if (data.finishedOn !== undefined)
        {   return LIFECYCLE_FINISHED;}
        else if(data.interruptions === undefined || data.interruptions.length % 2 == 0)
        {   return LIFECYCLE_UNINTERRUPTED;}
        else
        {   return LIFECYCLE_INTERRUPTED;}
    }

    getSectionsFromStory = (story) =>
    {
        const data = story.data();
        
        const interruptions = data.interruptions !== undefined ? story.data().interruptions : [];
        const categories = data.interruptionCategories !== undefined ? story.data().interruptionCategories : [];

        var sections = [];
        var previousDate = null;
        var section = null;

        if(data.startedOn)
        {
            //previousDate = asDate(new Date(data.startedOn));
            previousDate = asDate(new Date(1535545424000));

            const startItem = {
                iconName: "location-on",
                title: "Started",
                timestamp: data.startedOn,
                id: -1
            }
            
            section = {
                title: previousDate,
                items:[startItem]
            };
            sections.push(section);
        }


        for(var outer = 0 ; outer < interruptions.length ; outer += 2)
        { 
            const interruption = interruptions[outer];
            const endOfInterruption = interruptions[outer + 1];
            const category = categories[outer/2];
            const type = InterruptionType.fromDatabaseId(category);

            const date = asDate(new Date(interruption));
            const timestamp = new Date(interruption).getTime();
            const duration = endOfInterruption ? endOfInterruption - timestamp : undefined;

            const item = {
                iconName: type.iconName,
                iconColor: type.iconColor,
                title: type.title,
                timestamp: interruption,
                id: outer,
                editable: endOfInterruption !== undefined,
                deletable: endOfInterruption !== undefined,
                selectable: true,
                duration: duration,
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

            previousTimestamp = timestamp; 
            previousDate = date;
        }
    
        for(var outer = 0 ; outer < sections.length ; outer ++)
        {
            if(sections[outer].items.length == 0)
            {   continue;}

            section = sections[outer];
            var previousItem = section.items[0];
            var newItems = [previousItem];

            for(var inner = 1 ; inner < section.items.length; inner ++) 
            {
                item = section.items[inner];
                const productiveTimestamp = new Date(previousItem.timestamp.getTime() + previousItem.duration);
                
                var productive =  {
                    iconName: "build",  
                    iconColor: "white",
                    title: "Productive",
                    timestamp: productiveTimestamp,
                    id: outer + "." + inner,
                    duration: item.timestamp.getTime() - productiveTimestamp.getTime()
                };

                if(productive.duration > 0)
                {   newItems.push(productive);}

                newItems.push(item);
                previousItem = item;
            }

            section.items = newItems;
            sections.splice(outer, 1, section);
        }

        if(data.finishedOn)
        {
            //var date = asDate(new Date(data.finishedOn));
            var date = asDate(new Date(1535795302000));

            const finishItem = {
                iconName: "location-on",
                title: "Finished",
                timestamp: data.finishedOn,
                id: -2
            }

            if(previousDate != date)
            {
                section = {
                    title: date,
                    items: [finishItem]
                }
                sections.push(section);
            }
            else
            {   section.items.push(finishItem);}
        }

        var last = sections[sections.length - 1]
        if(last)
        {   last.open = true;}

        return sections;
    }
} 

/*import React from 'react';
import { View } from 'react-native';
import {
    Button,
    Container,
    Content,
    Header,
    Icon,
    Input,
    Item,
    List,
    ListItem,
    Text,
} from 'native-base';
import ModalInterruptionEdit from '../modals/ModalInterruptionEdit';
import ListInterruption from '../lists/ListInterruption';
import { styles } from '../../styles/Styles';
import InterruptionType from '../../enums/InterruptionType';
import InterruptionButton from '../interruptions/InterruptionButton';
import { asDate, asTime, difference } from '../util/DateUtil';

export default class ScreenStoryDetails extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Details for story: ' + navigation.getParam('story').data().name,
            headerTitleStyle: { flex: 1 }
        }
    }

    constructor(props) {
        super(props);
        this.editInterruption = this.editInterruption.bind(this);
        this.addInterrupt = this.addInterrupt.bind(this);
        this.story = props.navigation.getParam('story');
        this.state = {
            modalVisible: false,
            modalItemSelected: -1,
            started: this.story.data().startedOn !== undefined,
            startedOn: this.story.data().startedOn !== undefined ? this.story.data().startedOn.seconds : undefined,
            finished: this.story.data().finishedOn !== undefined,
            finishedOn: this.story.data().finishedOn !== undefined ? this.story.data().finishedOn.seconds : undefined,
            interruptions: this.story.data().interruptions !== undefined ? this.story.data().interruptions : [],
            interruptionCategories: this.story.data().interruptionCategories !== undefined ? this.story.data().interruptionCategories : [],
        };
    }

    closeModal() {
        this.setState({ modalVisible: false, modalItemSelected: -1 });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        let _this = this;
        this.story.ref.onSnapshot(function (doc) {
            let data = doc.data();
            if(data == undefined)
            {   return;}

            _this.setState({
                started: data.startedOn !== undefined,
                startedOn: data.startedOn ,
                finished: data.finishedOn !== undefined,
                finishedOn: data.finishedOn,
                interruptions: data.interruptions !== undefined ? data.interruptions : [],
                interruptionCategories: data.interruptionCategories !== undefined ? data.interruptionCategories : []
            })
        });

    }

    addInterrupt = (category) => {
        let newInterrupts = this.state.interruptions
        newInterrupts.push(new Date());
        let newInterruptCats = this.state.interruptionCategories
        if (category !== undefined) {
            newInterruptCats.push(category);
        }

        this.props.navigation.getParam('story').ref.update({
            interruptions: newInterrupts,
            interruptionCategories: newInterruptCats
        });
    }

    updateInterruptionAtIndex(indexOfChangedInterrupt, newInterruptionDateTime) {
        let newInterrupts = this.state.interruptions;
        newInterrupts.splice(indexOfChangedInterrupt, 1, newInterruptionDateTime);

        this.props.navigation.getParam('story').ref.update({
            interruptions: newInterrupts,
        });
    }

    deleteInterruptionAtIndex(indexOfChangedInterrupt) {
        let newInterrupts = this.state.interruptions;
        newInterrupts.splice(indexOfChangedInterrupt, indexOfChangedInterrupt == this.state.interruptions.length - 1 ? 1 : 2);

        let newInterruptCategories = this.state.interruptionCategories;
        newInterruptCategories.splice(indexOfChangedInterrupt / 2, 1);

        this.props.navigation.getParam('story').ref.update({
            interruptions: newInterrupts,
            interruptionCategories: newInterruptCategories
        });
    }

    addStartedOn = () => {
        this.props.navigation.getParam('story').ref.update({
            startedOn: new Date()
        });
    }

    addFinishedOn = () => {
        this.props.navigation.getParam('story').ref.update({
            finishedOn: new Date()
        });
    }

    finishInterruptedStory = () => {
        this.addInterrupt(undefined);
        this.addFinishedOn();
    }

    convertInterruptionTimesToIntervals()
    {
        var result = [];
        var i;
        var start;
        var end;
        var previous = undefined;

        for (i = 0; i + 1 < this.state.interruptions.length; i += 2)
        {
          start = this.state.interruptions[i];
          end = this.state.interruptions[i + 1];

          result.push({
              interruptionType: InterruptionType.fromDatabaseId(this.state.interruptionCategories[i / 2]),
              title: "At " + asDate(start) + " on " + asTime(start) + ", lasted " + difference(start, end),
              subtitle: previous !== undefined ? "Productive for: " + difference(previous, start) : undefined
            }
          );

          previous = end;
        }

        if (this.state.interruptions.length % 2 == 1)
        {
          var start = this.state.interruptions[this.state.interruptions.length - 1];

          result.push({
            interruptionType: InterruptionType.fromDatabaseId(this.state.interruptionCategories[i / 2]),
            title: 'Currently interrupted, started on ' + asTime(start),
            subtitle: "Interruption in progress for " + difference(start, new Date())
          });
        }

        return result;
    }

    editInterruption = (index) => {
        return () => {
            this.setState({ modalItemSelected: index });
            this.setModalVisible(true);
        }
    }


    render() {
        let interruptionList = <ListInterruption data={this.convertInterruptionTimesToIntervals().reverse()} extraData={this.state} keyExtractor={(item, index) => index + ' ' + item.seconds} editFnc={this.editInterruption} />;
        let element;
        if (!this.state.started) {
            element =
                <Button onPress={this.addStartedOn}>
                    <Text>Start story</Text>
                </Button>;
        }
        else if (!this.state.finished) {
            if (this.state.interruptions.length % 2 == 0) {
                element =
                    <View style={styles.container}>
                        <FinishButton onPress={this.addFinishedOn} />
                        {interruptionList}
                        <StartedOn start={this.state.startedOn} />
                        <View style={styles.buttonContainer}>
                            <InterruptionButton type={InterruptionType.Meeting} onPress={this.addInterrupt} />
                            <InterruptionButton type={InterruptionType.WaitingForOthers} onPress={this.addInterrupt} />
                            <InterruptionButton type={InterruptionType.Other} onPress={this.addInterrupt} />
                        </View>
                    </View>;
            }
            else {
                element =
                    <View style={styles.container}>
                        <FinishButton onPress={this.finishInterruptedStory} />
                        <View style={styles.interruptionList}>
                            {interruptionList}
                            <StartedOn start={this.state.startedOn} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => this.addInterrupt(undefined)}>
                                <Icon active style={styles.buttonIcon} name="refresh" />
                                <Text>Resume Progress</Text>
                            </Button>
                        </View>
                    </View>;
            }
        }
        else {
            element =
                <View>
                    <Text>Started on {this.state.startedOn.toLocaleString()}</Text>
                    <Text>Finished on {this.state.finishedOn.toLocaleString()}</Text>
                    <Text>Total time: {difference(this.state.startedOn, this.state.finishedOn)}</Text>
                    <Text>The times that the team was interrupted were:</Text>
                    {interruptionList}
                </View>
        }

        return (
            <View style={styles.container}>
                <ModalInterruptionEdit
                    parent={this}
                    modalVisible={this.state.modalVisible}
                    modalItemSelected={this.state.modalItemSelected}
                    interruptions={this.state.interruptions} />
                {element}
            </View>
        );
    }
}

const StartedOn = (props) => {
    let date = new Date(props.start);
    return (
        <View style={{ flexDirection: 'row', marginRight: 5, alignItems: 'center' }}>
            <Icon active name='power' />
            <Text>Started on {date.toLocaleDateString()} at {date.toLocaleTimeString()}</Text>
        </View>
    );
}

const FinishButton = (props) => {
    return (
        <Button style={styles.finishButton} onPress={props.onPress}>
            <Icon active style={styles.buttonIcon} name="checkmark" />
            <Text>Finish story</Text>
        </Button>
    );
}

const dateAsString = (seconds) => {
    var asDate = new Date(seconds * 1000);
    return asDate.toDateString() + ' ' + asDate.toLocaleTimeString();
}
*/

