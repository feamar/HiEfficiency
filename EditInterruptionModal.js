import React from 'react';
import { AppLoading, Font } from 'expo';
import { Modal, FlatList, ListView, StyleSheet, View } from 'react-native';
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
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 300,
            height: 300,
            backgroundColor: '#ffffffff'
          }}>
            <Button onPress = { () => {
              this.props.parent.closeModal();
            }}>
              <Text>Close</Text>
            </Button>
            <Text>{'Selected item: ' + this.props.modalItemSelected}</Text>
            <View style = {{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text>{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2].seconds*1000).toDateString().slice(4) + ' ' + new Date(this.props.interruptions[this.props.modalItemSelected*2].seconds*1000).toLocaleTimeString() : ''}</Text>
              <Button iconLeft style={{width: 50}} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2)}>
                <Icon name='create' />
              </Button>
            </View>
            <View style = {{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text>{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2 + 1].seconds*1000).toDateString().slice(4) + ' ' + new Date(this.props.interruptions[this.props.modalItemSelected*2+1].seconds*1000).toLocaleTimeString() : ''}</Text>
              <Button iconLeft style={{width: 50}} onPress={() => this._showDateTimePicker(this.props.modalItemSelected*2 + 1)}>
                <Icon name='create' />
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
