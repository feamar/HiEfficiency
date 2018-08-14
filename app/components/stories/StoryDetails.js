import React from 'react';
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
import UtilityTime from '../../utilities/UtilityTime';

export default class StoryDetails extends React.Component {

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
        //console.log("The story: " + JSON.stringify(JSON.decycle(this.story)));
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

    secondsDifferenceAsString(start, finish) {
        difference = finish - start; 
        seconds = difference % 60;
        difference -= seconds;
        difference /= 60;
        minutes = difference % 60;
        difference -= minutes;
        difference /= 60;
        hours = difference % 24;
        difference -= hours;
        difference /= 24;
        days = difference;

        result = '';
        if (days > 0) {
            result += days + 'd';
        }
        if (hours > 0) {
            if (result !== '') { result += ' ' }
            result += hours + 'h';
        }
        if (minutes > 0) {
            if (result !== '') { result += ' ' }
            result += minutes + 'm';
        }

        if (result == '') {
            result += ((seconds - (seconds % 1))) + 's';
        }

        return result;
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

        for (i = 0; i + 1 < this.state.interruptions.length; i += 2) 
        {
            start = this.state.interruptions[i];
            end = this.state.interruptions[i + 1];

            if (i == 0) 
            {   previous = this.state.startedOn;} 
            else 
            {   previous = this.state.interruptions[i - 1];}

            //console.log(JSON.stringify("The start: " + start + " and the end: " + end + "."));
            //console.log(JSON.stringify(JSON.decycle(this.state)));

            result.push(
                { 
                    interruptionType: InterruptionType.fromDatabaseId(this.state.interruptionCategories[i / 2]),
                    title: "At " + UtilityTime.dateToString(start) + " on " + UtilityTime.millisecondsSinceEpochToTimeOfDay(start) + ", lasted " + UtilityTime.millisecondsToHHMMSS(end - start),
                    subtitle: "Productive for: " + this.secondsDifferenceAsString(previous, start)
                }
            );  
        }

        if (this.state.interruptions.length % 2 == 1)  
        {
            console.log("length: " + this.state.interruptions.length  + " modulus: " + this.state.interruptions.length % 2);
            var start = this.state.interruptions[this.state.interruptions.length - 1]; 
            var now = new Date();
            var difference = now - start;

            result.push({
                interruptionType: InterruptionType.fromDatabaseId(this.state.interruptionCategories[i / 2]),
                title: 'Currently interrupted, started on ' + UtilityTime.millisecondsSinceEpochToTimeOfDay(start),
                subtitle: "Interruption in progress for " + UtilityTime.millisecondsToHHMMSS(difference)
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
        console.log("The state: " + JSON.stringify(JSON.decycle(this.state)));

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
                    <Text>Total time: {UtilityTime.millisecondsToHHMMSS(this.state.finishedOn - this.state.startedOn)}</Text>
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
