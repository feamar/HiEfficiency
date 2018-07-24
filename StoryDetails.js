import React from 'react';
import { AppLoading, Font } from 'expo';
import { FlatList, ListView, View } from 'react-native';
import {
	  Button,
	  Container,
	  Header,
	  Content,
	  Icon,
	  List,
	  ListItem,
	  Text,
	  Input,
	  Item,
	} from 'native-base';
import Timestamp from 'react-timestamp';

export default class StoryDetails extends React.Component {
	
  static navigationOptions = ({ navigation }) => {
	return {
		title: 'Details for story: ' + navigation.getParam('story').data().name,
		headerTitleStyle: {flex: 1}
    }
  }

  constructor(props) {
	  super(props);
	  this.story = props.navigation.getParam('story');
	  
	  this.state = {
		     started: this.story.data().startedOn !== undefined,
		     startedOn: this.story.data().startedOn !== undefined ? this.story.data().startedOn.seconds : undefined,
		     finished: this.story.data().finishedOn !== undefined,
		     finishedOn: this.story.data().finishedOn !== undefined ? this.story.data().finishedOn.seconds : undefined,
		     interruptions: this.story.data().interruptions !== undefined ? this.story.data().interruptions : [],
		   };
  }

  componentDidMount() {
	  let _this = this;
	  this.story.ref.onSnapshot(function(doc) {
		  _this.setState({
					     started: doc.data().startedOn !== undefined,
					     startedOn: doc.data().startedOn !== undefined ? doc.data().startedOn.seconds : undefined,
					     finished: doc.data().finishedOn !== undefined,
					     finishedOn: doc.data().finishedOn !== undefined ? doc.data().finishedOn.seconds : undefined,
					     interruptions: doc.data().interruptions !== undefined ? doc.data().interruptions : [],
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
		  if (result !== '') {result += ' '}
		  result += hours + 'h';
	  }
	  if (minutes > 0) {
		  if (result !== '') {result += ' '}
		  result += minutes + 'm';
	  }
	  
	  if (result == '') {
		  result += ((seconds - (seconds % 1))) + 's';
	  }
	  
	  return result;
  }
  
  dateAsString(seconds) {
	  var asDate = new Date(seconds*1000);
	  return asDate.toDateString() + ' ' + asDate.toLocaleTimeString();
  }

  addInterrupt = () => {
	  let newInterrupts = this.state.interruptions
	  newInterrupts.push(new Date());
	  this.props.navigation.getParam('story').ref.update({
		    interruptions: newInterrupts
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
	  this.addInterruption();
	  this.addFinishedOn();
  }

  convertInterruptionTimesToIntervals() {
	  var result = [];
	  var i;
	  var first;
	  var second;
	  for (i = 0; i + 1 < this.state.interruptions.length; i += 2) {
		  first = this.state.interruptions[i].seconds;
		  second = this.state.interruptions[i+1].seconds;
		  result.push('Interrupt ' + ((i/2)+1) + ': ' + new Date(first*1000).toDateString().slice(4) + ' - ' + new Date(second*1000).toDateString().slice(4) + ' took ' + this.secondsDifferenceAsString(first, second));
	  }
	  if (this.state.interruptions.length % 2 == 1) {
		  var current = this.state.interruptions[this.state.interruptions.length - 1].seconds;
		  result.push('Currently interrupted, started at ' + new Date(current*1000).toDateString().slice(4));
	  }
	  return result;
  }
  
  render() {
	let interruptionList;
	if (this.state.interruptions.length !== 0) {
		// Add all the finished interruptions in reverse order
		_keyExtractor = (item, index) => index + ' ' + item.seconds;        
		interruptionList =           
        	<FlatList
        	  data={this.convertInterruptionTimesToIntervals()}
		 	  extraData={this.state}
		      keyExtractor={_keyExtractor}
        	  renderItem={({item}) => <Text>{item}</Text>}
        	/>;
	}
	
	let element;
	if (!this.state.started) {
		element = 
		   <Button onPress={this.addStartedOn}>
		     <Text>Start story</Text>
		   </Button>;
	} else if (!this.state.finished) {
		if (this.state.interruptions.length % 2 == 0) {
			element = 
				 <View>
					<Text>Started on {this.dateAsString(this.state.startedOn)}</Text>
					{interruptionList}
					<View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
					   <Button onPress={this.addInterrupt}>
						 <Text>Interrupt Progress</Text>
					   </Button>
					   <Button onPress={this.addFinishedOn}>
						 <Text>Finish story</Text>
					   </Button>
					</View>
				 </View>;
		} else {
			element = 
				 <View>
				   <Text>Started on {this.dateAsString(this.state.startedOn)}</Text>
					{interruptionList}
					<View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
					   <Button onPress={this.addInterrupt}>
						 <Text>Resume Progress</Text>
					   </Button>
					   <Button onPress={this.finishInterruptedStory}>
						 <Text>Finish story</Text>
					   </Button>
					</View>
				 </View>;
		}
	} else {
		element = 
	    <View>
		  <Text>Started on {this.dateAsString(this.state.startedOn)}</Text>
		  <Text>Finished on {this.dateAsString(this.state.finishedOn)}</Text>
		  <Text>Total time: {this.secondsDifferenceAsString(this.state.startedOn, this.state.finishedOn)}</Text>
		  <Text>The times that the team was interrupted were:</Text>
		  {interruptionList}
		</View>
	}

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			{element}
		</View>
    );
  }
}