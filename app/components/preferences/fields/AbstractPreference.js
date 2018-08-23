import React, {Component} from 'react';
import {View} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-paper';
  
export default class AbstractPreference extends Component
{
    styles = {
        root: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10
        },
        title:{
            fontWeight: "bold"
        },
        displayValue:{
            color: "#919191"
        },
        error: {
            color: "red",
            opacity: 0.55,
            fontWeight: "bold"
        }
        
    }
    

    constructor(props)
    {
        super(props);

        this.state ={ 
            storageValue: this.props.storageValue 
        }
    }  

    componentWillMount = () =>
    {   this.setDisplayValueFromStorageValue(this.state.storageValue);}
     
    setStorageValue = (storageValue) => 
    {   this.setDisplayValueFromStorageValue(storageValue);}

    setDisplayValueFromStorageValue = (storageValue) =>
    {
        var displayValue = storageValue;
        if(this.getDisplayValue)
        {   displayValue = this.getDisplayValue(storageValue);}
        
        this.setState({storageValue: storageValue, displayValue: displayValue}); 
    }

    validate = () =>
    {
        if(this.props.required && this.state.storageValue == undefined)
        {   
            this.setState({error: "Please enter the " + this.props.title.toLowerCase() + "."});    
            return false;
        }

        return true;
    }

    getErrorComponent = () =>
    {   return <Text style={this.styles.error}>{this.state.error}</Text>;}

    render(){
        return(
            <View>
                 <TouchableRipple onPress={this.onPreferencePress}>
                    <View style={this.styles.root}>
                        {this.getDisplayContent && this.getDisplayContent()}
                        {this.state.error && this.getErrorComponent()}
                    </View>
                </TouchableRipple>
                {this.getAdditionalContent && this.getAdditionalContent()}
            </View>
        );
    }
} 

AbstractPreference.propTypes = {
    storageValue: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    onValueChanged: PropTypes.func.isRequired,
    onValueValidation: PropTypes.func,
    required: PropTypes.bool
}