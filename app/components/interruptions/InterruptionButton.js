import React, { Component } from 'react';
import { Button, Icon, Text, } from 'native-base';
import {styles} from '../../styles/Styles';
export default class InterruptionButton extends Component {
    render() {
        return (
            <Button style={{ backgroundColor: this.props.type.iconColor, flexDirection: 'row', }} onPress={() => this.props.onPress(this.props.type.interruptionCategory)}>
                <Icon active style={styles.buttonIcon} name={this.props.type.iconName} />
            </Button>
        );
    }

} 