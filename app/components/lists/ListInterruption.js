import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { styles } from '../../styles/Styles';

export default class ListInterruption extends React.Component {
    render() {
        return (
            <FlatList
                data={this.props.data}
                extraData={this.props.extraData}
                keyExtractor={this.props.keyExtractor}
                renderItem={({ item, index }) =>
                    <View style={styles.interruptionItem}>
                        <View style={styles.interruptionSubitem}>
                            <Icon active style={{ color: item.interruptionType.iconColor }} name={item.interruptionType.iconName} />
                            <View style={styles.interruptionIconAndText}>
                                <Text>{item.title}<Text style={{ fontWeight: 'bold' }}>{item.interruptTime}</Text></Text>
                            </View>
                            <Button iconLeft transparent onPress={this.props.editFnc(index)}>
                                <Icon active style={styles.moreButton} name='more' />
                            </Button>
                        </View>
                        <Text style={styles.productiveTimeText}>{item.subtitle}</Text>
                    </View>
                }
            />
        );
    }

} 