import React from 'React';
import { Button, Icon, Text, } from 'native-base';
import { styles } from './Styles';

export const InterruptionButton = (props) => {
  return (<Button style={{backgroundColor: props.type.iconColor, flexDirection: 'row',}} onPress={() => props.onPress(props.type.interruptionCategory)}>
    <Icon active style={styles.buttonIcon} name={props.type.iconName} />
  </Button>);
}

export const Meeting = {
  dbId: 'meeting',
  iconColor: 'purple',
  iconName: 'chatbubbles',
  interruptionCategory: 'meeting',
  buttonText: 'Meeting'
}

export const WaitingForOthers = {
  dbId: 'waiting',
  iconColor: 'orange',
  iconName: 'people',
  interruptionCategory: 'waiting',
  buttonText: 'Waiting for others'
}

export const Other = {
  dbId: 'other',
  iconColor: 'blue',
  iconName: 'hand',
  interruptionCategory: 'other',
  buttonText: 'Other'
}

export const None = {
  iconColor: 'black',
  iconName: 'help'
}

export const interruptionTypes = [Meeting, WaitingForOthers, Other];

export const toInterruptionType = (type) => {
  let result = None;
  interruptionTypes.forEach((interruptionType) => {
    if (interruptionType.dbId == type) {
      result = interruptionType;
    }
  });
  return result;
}
