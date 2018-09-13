import React from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-paper';
import AbstractPreference from "./AbstractPreference";

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