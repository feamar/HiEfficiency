import React, {Component} from 'react';
import {View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";
import UtilityValidate from "../../../utilities/UtilityValidate"
import update from "immutability-helper";

const styles = {
    error:{
        marginTop: 10,
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

    onValueValidation = (storageValue) =>
    {
        const illegal = UtilityValidate.getIllegalCharacters(storageValue, this.props.legalCharacters);

        if(illegal == undefined || illegal == "")
        {   return undefined;}
        else
        {   return "Please refrain from using the following illegal characters: " + illegal;}
    }

    getDialogContent = () => 
    {
        console.log("Number of lines: " + this.props.numberOfLines);
        return ( 
            <View style={{marginLeft: 25, marginRight: 25}}>
                <TextInput style={{flex: 1}} autoFocus={true} name="value" label={this.props.label} value={this.state.storageValue} onChangeText={this.onValueChange} multiline={this.props.multiline} numberOfLines={this.props.numberOfLines} />
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            </View>
        );
    }
}  

DialogPreferenceText.defaultProps = {
    legalCharacters: UtilityValidate.DEFAULT_LEGAL_CHARACTERS
}

DialogPreferenceText.propTypes = {
    label: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    legalCharacters: PropTypes.string.isRequired
}


