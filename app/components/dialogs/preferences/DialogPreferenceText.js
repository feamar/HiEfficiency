import React, {Component} from 'react';
import {View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";

const styles = {
    error:{
        fontWeight: "bold",
        color: "red",
        opacity: 0.75
    }
}
export default class DialogPreferenceText extends AbstractPreferenceDialog
{

    constructor(props)
    {
        super(props);
    }

    componentDidUpdate = () =>
    {
        
    }

    getDialogContent = () => 
    {
        return ( 
            <View style={{marginLeft: 25, marginRight: 25}}>
                <TextInput ref={i => this.firstInput = i} name="value" label={this.props.label} value={this.state.storageValue} onChangeText={this.onValueChange} multiline={this.props.multiline} numberOfLines={this.props.numberOfLines} />
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            </View>
        );
    }
}  

DialogPreferenceText.propTypes = {
    label: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number
}