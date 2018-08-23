import React, {Component} from 'react';
import {View} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-paper';
import AbstractPreference from "./AbstractPreference";
import { Dropdown } from 'react-native-material-dropdown';

const styles = {

}

export default class AbstractContainedPreference extends AbstractPreference
{
    constructor(props)
    {
        super(props);
    }


    getDisplayContent = () =>
    {  
        return (
            <View>
                <Text style={this.styles.title}>{this.props.title}</Text>
                {this.getAdditionalDisplayContent && this.getAdditionalDisplayContent()}
            </View>
        );
    }
} 