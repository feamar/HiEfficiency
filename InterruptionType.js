import React from 'React';
import { Button, Icon, Text, } from 'native-base';
import { styles } from './Styles';

export const InterruptionButton = (props) => {
  return (<Button style={{backgroundColor: props.type.buttonColor}} onPress={() => props.onPress(props.type.interruptionCategory)}>
    <Icon active style={styles.buttonIcon} name={props.type.iconName} />
    <Text>{props.type.buttonText}</Text>
  </Button>);
}

export const Meeting = {
  buttonColor: 'purple',
  interruptionCategory: 'meeting',
  iconName: 'chatbubbles',
  buttonText: 'Meeting'
}

export const WaitingForOthers = {
  buttonColor: 'orange',
  interruptionCategory: 'waiting',
  iconName: 'people',
  buttonText: 'Waiting for others'
}

export const Other = {
  buttonColor: 'blue',
  interruptionCategory: 'other',
  iconName: 'hand',
  buttonText: 'Other'
}
