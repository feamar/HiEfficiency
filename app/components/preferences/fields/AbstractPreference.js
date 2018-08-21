import React, {Component} from 'react';
import {View} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-paper';
  
const styles = {
    root: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    title:{
        fontWeight: "bold"
    },
    value:{
        color: "#919191"
    } 
}

export default class AbstractPreference extends Component
{
    constructor(props)
    {
        super(props);

        this.state ={
            value: this.props.value
        }
    }
     
    setValue = (value) => {
        this.setState({value: value}); 
    }
    handlePress =() =>
    {
        if(this.props.onPress)
        {   this.props.onPress();}   
    }

    render(){
        return(
            <View>
                 <TouchableRipple onPress={this.handlePress}>
                    <View style={styles.root}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        {this.state.value ? <Text style={styles.value}>{this.state.value}</Text> : null}
                    </View>
                </TouchableRipple>
            </View>
        );
    }
} 

AbstractPreference.propTypes = {
    value: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}