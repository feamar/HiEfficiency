import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { styles } from './Styles';

export function InterruptionList(props) {
  return (<FlatList
    data={props.data}
    extraData={props.extraData}
    keyExtractor={props.keyExtractor}
    renderItem={({item, index}) =>
          <View style={styles.interruptionItem}>
            <View style={styles.interruptionSubitem}>
              <View style={styles.interruptionIconAndText}>
                <Icon active style={item.interruptionType.iconColor} name={item.interruptionType.iconName} />
                <Text>&nbsp;&nbsp;At&nbsp;{item.interruptStart},&nbsp;lasted&nbsp;<Text style={{fontWeight: 'bold'}}>{item.interruptTime}</Text></Text>
              </View>
              <Button iconLeft transparent onPress = {props.editFnc(index)}>
                <Icon active style={styles.moreButton} name='more' />
              </Button>
            </View>
            <Text style={styles.productiveTimeText}>Produced for {item.productiveTime}</Text>
          </View>
        }
      />);
}
