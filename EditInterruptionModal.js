import React from 'react';
import { AppLoading, Font } from 'expo';
import { Alert, Modal, FlatList, ListView, StyleSheet, View } from 'react-native';
import {
	  Button,
	  Container,
	  Header,
		Icon,
	  Content,
	  List,
	  ListItem,
	  Text,
	  Input,
	  Item,
	} from 'native-base';
import Timestamp from 'react-timestamp';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { styles } from './Styles';

const combine = (time, date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
}

const asTime = (date) => {
	return date.toLocaleTimeString().substring(0,5);
}

const asDate = (date) => {
	return date.toDateString().slice(4, 10);
}

export default class EditInterruptionModal extends React.Component {
  constructor(props) {
    super(props);
		this.showDateTimePicker = this.showDateTimePicker.bind(this);
		this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
		this.persist = this.persist.bind(this);
		this.close = this.close.bind(this);
		this.date = this.date.bind(this);

		this.overwriteStartTime = this.overwriteStartTime.bind(this);
		this.overwriteStartDate = this.overwriteStartDate.bind(this);
		this.overwriteEndTime = this.overwriteEndTime.bind(this);
		this.overwriteEndDate = this.overwriteEndDate.bind(this);

    this.state = {
      dateTimePickerVisible: false,
			dateTimePickerMode: undefined,
			dateTimePickerDate: new Date(),
			dateTimePickerOnConfirm: (date) => {},

			startTime: () => this.date(this.props.modalItemSelected*2),
			startDate: () => this.date(this.props.modalItemSelected*2),
			endTime: () => this.date(this.props.modalItemSelected*2+1),
			endDate: () => this.date(this.props.modalItemSelected*2+1),
    }
  }

	date = (index) => {
		return index < 0 || index >= this.props.interruptions.length ? new Date() : new Date(this.props.interruptions[index].seconds*1000);
	}

	overwriteStartTime = (date) => {
		this.setState({startTime: () => date});
	}

	overwriteStartDate = (date) => {
		this.setState({startDate: () => date});
	}

	overwriteEndTime = (date) => {
		this.setState({endTime: () => date});
	}

	overwriteEndDate = (date) => {
		this.setState({endDate: () => date});
	}

	showDateTimePicker = (dateToEdit, onConfirm, mode) => {
		this.setState({
			dateTimePickerVisible: true,
			dateTimePickerMode: mode,
			dateTimePickerDate: dateToEdit,
			dateTimePickerOnConfirm: (date) => { onConfirm(date), this.hideDateTimePicker() },
		});
	}

  hideDateTimePicker = () => {
		this.setState({
			dateTimePickerVisible: false,
			dateTimePickerMode: undefined,
			dateTimePickerDate: new Date(),
			dateTimePickerOnConfirm: (date) => {},
	 	});
	}

	delete = () => {
		this.props.parent.deleteInterruptionAtIndex(this.props.modalItemSelected*2);
		this.close();
	}

	persist = () => {
		this.props.parent.updateInterruptionAtIndex(this.props.modalItemSelected*2, combine(this.state.startTime(), this.state.startDate()));
		if (this.props.modalItemSelected*2+1 < this.props.interruptions.length) {
			this.props.parent.updateInterruptionAtIndex(this.props.modalItemSelected*2+1, combine(this.state.endTime(), this.state.endDate()));
		}
		this.close();
	}

	close = () => {
		this.setState({
			startTime: () => this.date(this.props.modalItemSelected*2),
			startDate: () => this.date(this.props.modalItemSelected*2),
			endTime: () => this.date(this.props.modalItemSelected*2+1),
			endDate: () => this.date(this.props.modalItemSelected*2+1),
		});
		this.props.parent.closeModal();
	}

  render() {
		return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => alert('Requested close for modal')}
      >
				<View style={styles.modalSurroundings}>
	        <View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
		          <Button transparent onPress = { this.close }>
		            <Icon active name='close' style={{color: 'white'}} />
		          </Button>
							<Text>{this.props.interruptionCategory}</Text>
							<Button transparent onPress = { this.delete }>
		            <Icon active name='trash' style={{color: 'white', paddingRight: 10,}} />
		          </Button>
						</View>
	          <Text>{'Selected item: ' + this.props.modalItemSelected}</Text>
						<View style = {{paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
							<Text style={{width: 60,}}>Start</Text>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this.showDateTimePicker(this.state.startTime(), this.overwriteStartTime, 'time')}>
								<Text style={{color: 'black',}} >{asTime(this.state.startTime())}</Text>
							</Button>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this.showDateTimePicker(this.state.startDate(), this.overwriteStartDate, 'date')}>
								<Text style={{color: 'black',}} >{asDate(this.state.startDate())}</Text>
							</Button>
						</View>
						<View style = {{paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
							<Text style={{width: 60,}}>Finish</Text>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this.showDateTimePicker(this.state.endTime(), this.overwriteEndTime, 'time')}>
								<Text style={{color: 'black',}} >{asTime(this.state.endTime())}</Text>
							</Button>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this.showDateTimePicker(this.state.endDate(), this.overwriteEndDate, 'date')}>
								<Text style={{color: 'black',}} >{asDate(this.state.endDate())}</Text>
							</Button>
						</View>
						<View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',}}>
							<Button transparent onPress = { this.close }>
								<Text style={{color: 'red',}}>Cancel</Text>
							</Button>
							<Button transparent onPress={ this.persist }>
								<Text style={{color: 'green',}}>Save</Text>
							</Button>
						</View>
	        </View>
				</View>
        <DateTimePicker
          mode = {this.state.dateTimePickerMode}
					date = {this.state.dateTimePickerDate}
          isVisible = {this.state.dateTimePickerVisible}
          onConfirm = {this.state.dateTimePickerOnConfirm}
          onCancel = {this.hideDateTimePicker}
        />
      </Modal>
    );
  }
}
