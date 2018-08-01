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

export default class EditInterruptionModal extends React.Component {

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
            backgroundColor: '#ffffff80'
          }}>
            <Button onPress = { () => {
              this.props.parent.closeModal();
            }}>
              <Text>Close</Text>
            </Button>
            <Text>{'Selected item: ' + this.props.modalItemSelected}</Text>
            <Text>{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2].seconds*1000).toLocaleTimeString() : ''}</Text>
            <Text>{this.props.modalItemSelected !== -1 ? new Date(this.props.interruptions[this.props.modalItemSelected*2+1].seconds*1000).toLocaleTimeString() : ''}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}
