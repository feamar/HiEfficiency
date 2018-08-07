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

export default class EditInterruptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      interruptionDateUnderEditIndex: -1
    }
  }

  _showDateTimePicker = (dateUnderEdit) => this.setState({ isDateTimePickerVisible: true, interruptionDateUnderEditIndex: dateUnderEdit });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, interruptionDateUnderEditIndex: -1 });

  _handleDatePicked = (date) => {
    this.props.parent.updateInterruptionAtIndex(this.state.interruptionDateUnderEditIndex, date);
    this._hideDateTimePicker();
  };

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
		          <Button transparent onPress = { () => {
		            this.props.parent.closeModal();
		          }}>
		            <Icon active name='close' style={{color: 'white'}} />
		          </Button>
							<Text>{this.props.interruptionCategory}</Text>
							<Button transparent onPress = { () => {
		            Alert.alert('This will ones be deleting your interruption');
		          }}>
		            <Icon active name='trash' style={{color: 'white', paddingRight: 10,}} />
		          </Button>
						</View>
	          <Text>{'Selected item: ' + this.props.modalItemSelected}</Text>
	          <View style = {{paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
							<Text style={{width: 60,}}>Start</Text>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2)}>
								<Text style={{color: 'black',}} >{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2].seconds*1000).toLocaleTimeString().substring(0,5) : ''}</Text>
	            </Button>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2)}>
								<Text style={{color: 'black',}} >{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2].seconds*1000).toDateString().slice(4).substring(0,6) : ''}</Text>
	            </Button>
	          </View>
	          <View style = {{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
							<Text style={{width: 60,}}>Finish</Text>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2 + 1)}>
								<Text style={{color: 'black',}} >{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2+1].seconds*1000).toLocaleTimeString().substring(0,5) : ''}</Text>
	            </Button>
							<Button transparent style={styles.datetimeEditButton} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2 + 1)}>
								<Text style={{color: 'black',}} >{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2 + 1].seconds*1000).toDateString().slice(4).substring(0,6) : ''}</Text>
	            </Button>
	          </View>
						<View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',}}>
							<Button transparent>
								<Text style={{color: 'red',}}>Cancel</Text>
							</Button>
							<Button transparent>
								<Text style={{color: 'green',}}>Save</Text>
							</Button>
						</View>
	        </View>
				</View>
        <DateTimePicker
          mode = 'datetime'
          isVisible = {this.state.isDateTimePickerVisible}
          onConfirm = {this._handleDatePicked}
          onCancel = {this._hideDateTimePicker}
        />
      </Modal>
    );
  }
}
