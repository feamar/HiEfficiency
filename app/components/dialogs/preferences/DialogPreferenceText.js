import React, {Component} from 'react';
import {View } from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';

export default class DialogPreferenceText extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            visible: this.props.visible,
            value: this.props.value
        }
    }

    handleValueChange = (text) =>
    {
        this.setState({value: text});
        this.base.handleValueChange(text);
    }

    render() 
    {
        return( 
            <View>
                <AbstractPreferenceDialog ref={instance => this.base = instance} title={this.props.label} {...this.props} value={this.state.value}>
                    <View style={{marginLeft: 25, marginRight: 25}}>
                        <TextInput name="value" label={this.props.label} value={this.state.value} onChangeText={this.handleValueChange}/>
                    </View>
                </AbstractPreferenceDialog>
            </View>
        );
    }
}  