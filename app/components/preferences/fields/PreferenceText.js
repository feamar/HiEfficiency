import React, {Component} from 'react';
import { View, TouchableHighlight } from "react-native";

import { Text, TouchableRipple } from 'react-native-paper';
import DialogPreferenceText from '../../dialogs/preferences/DialogPreferenceText';
import AbstractPreference from './AbstractPreference';
import AbstractDialogPreference from "./AbstractDialogPreference";
import PropTypes from "prop-types";

export default class PreferenceText extends AbstractDialogPreference
{
    constructor(props)
    {   super(props);}

    getDialogComponent = (additionalProps) =>
    {
        return (
            <DialogPreferenceText {...additionalProps} multiline={this.props.multiline} numberOfLines={this.props.numberOfLines} />
        );
    }
}


PreferenceText.propTypes = {
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number
}