import React from 'react';
import { AppLoading, Font } from 'expo';
import { Modal, FlatList, ListView, StyleSheet, View } from 'react-native';
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
import Timestamp from 'react-timestamp';
import EditInterruptionModal from './EditInterruptionModal';

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
		this.setState({modalVisible: false, modalItemSelected: -1});
	}

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
							 interruptionCategories: doc.data().interruptionCategories !== undefined ? doc.data().interruptionCategories : [],
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
		let newInterrupts = this.state.interruptions
		newInterrupts.splice(indexOfChangedInterrupt, 1, newInterruptionDateTime);

		this.props.navigation.getParam('story').ref.update({
				interruptions: newInterrupts,
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

	iconColor = (interruptionCategory) => {
		switch (interruptionCategory) {
      case 'meeting':
        return {color: 'purple',};
			case 'waiting':
        return {color: 'orange',};
      case 'other':
        return {color: 'blue',};
      default:
        return {color: 'black',};
    }
	}
	iconName = (interruptionCategory) => {
		switch (interruptionCategory) {
      case 'meeting':
        return 'chatbubbles';
			case 'waiting':
        return 'people';
      case 'other':
        return 'hand';
      default:
        return 'help';
    }
	}

  convertInterruptionTimesToIntervals() {
	  var result = [];
	  var i;
	  var first;
	  var second;
	  for (i = 0; i + 1 < this.state.interruptions.length; i += 2) {
		  first = this.state.interruptions[i].seconds;
		  second = this.state.interruptions[i+1].seconds;
			if (i==0) {
				previous = this.state.startedOn;
			} else {
				previous = this.state.interruptions[i-1].seconds;
			}
		  result.push({
				interruptTime: this.secondsDifferenceAsString(first, second),
				interruptStart: new Date(first*1000).toLocaleTimeString(),
				iconColor: this.iconColor(this.state.interruptionCategories[i/2]),
				iconName: this.iconName(this.state.interruptionCategories[i/2]),
				productiveTime: this.secondsDifferenceAsString(previous, first)
			});
	  }
	  if (this.state.interruptions.length % 2 == 1) {
		  var current = this.state.interruptions[this.state.interruptions.length - 1].seconds;
		  result.push({
<<<<<<< HEAD
				currentInterrupt: 'Currently interrupted, started at ' + new Date(current*1000).toDateString().slice(4),
=======
				displayText: new Date(current*1000).toLocaleTimeString() + ' got interrupted ',
				iconColor: this.iconColor(this.state.interruptionCategories[i/2]),
				iconName: this.iconName(this.state.interruptionCategories[i/2])
>>>>>>> 1bed8cd1d15e10fab08d4b871e58ff8d9641c621
			});
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
      	  data={this.convertInterruptionTimesToIntervals().reverse()}
			 	  extraData={this.state}
		      keyExtractor={_keyExtractor}
      	  renderItem={({item, index}) =>
								<View style={styles.interruptionItem}>
<<<<<<< HEAD
									<View style={styles.interruptionSubitem}>
										<View style={styles.interruptionIconAndText}>
										  <Icon active style={item.iconColor} name={item.iconName} />
											<Text>&nbsp;&nbsp;At&nbsp;{item.interruptStart},&nbsp;lasted&nbsp;<Text style={{fontWeight: 'bold'}}>{item.interruptTime}</Text></Text>
										</View>
										<Button iconLeft transparent onPress = {() => {
											this.setState({modalItemSelected: index});
											this.setModalVisible(true);
										}}>
										  <Icon active name='more' />
										</Button>
									</View>
									<Text style={styles.productiveTimeText}>Produced for {item.productiveTime}</Text>
=======
									<Button iconLeft transparent onPress = {() => {
										this.setState({modalItemSelected: index});
										this.setModalVisible(true);
									}}>
									  <Icon active style={item.iconColor} name={item.iconName} />
									</Button>
									<Text>&nbsp;&nbsp;At&nbsp;{item.displayText == undefined ? item.interruptStart : item.displayText},&nbsp;lasted&nbsp;<Text style={{fontWeight: 'bold'}}>{item.interruptTime}</Text></Text>
>>>>>>> 1bed8cd1d15e10fab08d4b871e58ff8d9641c621
								</View>
							}
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
						{interruptionList}
						<View style={{flexDirection: 'row', marginRight: 5, alignItems: 'center'}}>
							<Icon active name='power' />
							<Text>Started on {this.dateAsString(this.state.startedOn)}</Text>
						</View>
						<View style={styles.buttonContainer}>
						   <Button style={{backgroundColor: 'purple'}} onPress={() => this.addInterrupt('meeting')}>
								 <Icon active style={styles.buttonIcon} name="chatbubbles" />
								 <Text>Meeting</Text>
						   </Button>
							 <Button style={{backgroundColor: 'orange'}} onPress={() => this.addInterrupt('waiting')}>
								 <Icon active style={styles.buttonIcon} name="people" />
								 <Text>Waiting on others</Text>
						   </Button>
							 <Button style={{backgroundColor: 'blue'}} onPress={() => this.addInterrupt('other')}>
								 <Icon active style={styles.buttonIcon} name="hand" />
								 <Text>Other</Text>
						   </Button>
						   <Button style={styles.finishButton} onPress={this.addFinishedOn}>
								 <Icon active style={styles.buttonIcon} name="checkmark" />
								 <Text>Finish story</Text>
						   </Button>
						</View>
					 </View>;
			} else {
				element =
					 <View>
						{interruptionList}
						<View style={{flexDirection: 'row', marginRight: 5, alignItems: 'center'}}>
							<Icon active name='power' />
							<Text>Started on {this.dateAsString(this.state.startedOn)}</Text>
						</View>
						<View style={styles.buttonContainer}>
						   <Button onPress={() => this.addInterrupt(undefined)}>
								 <Icon active style={styles.buttonIcon} name="refresh" />
								 <Text>Resume Progress</Text>
						   </Button>
						   <Button style={styles.finishButton} onPress={this.finishInterruptedStory}>
								 <Icon active style={styles.buttonIcon} name="checkmark" />
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
				<EditInterruptionModal
   				parent={this}
					modalVisible={this.state.modalVisible}
					modalItemSelected={this.state.modalItemSelected}
					interruptions={this.state.interruptions} />
				{element}
			</View>
	  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	finishButton: {
		backgroundColor: 'green',
	},
	interruptionItem: {
		flexDirection: 'column',
		paddingHorizontal: 5,
	},
	interruptionSubitem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	interruptionIconAndText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	productiveTimeText: {
		color: '#0005',
		marginLeft: 15,
		borderLeftWidth: 2,
		paddingLeft: 5,
		borderColor: '#0005',
	},
	buttonIcon: {
		color: 'white',
	},
});
