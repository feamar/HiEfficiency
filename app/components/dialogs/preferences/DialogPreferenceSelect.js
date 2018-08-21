import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import { Item } from 'native-base';
import PropTypes from 'prop-types';

const styles = {
    item: {
        flexDirection: "row",
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: "space-between"
    },
    title: {
        paddingTop: 9
    },
    checkbox: {}
}

export default class DialogMultiSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: this.props.visible,
            storageValue: this.props.storageValue,
            options: this.props.options,
        }
    }

    handleValueChange = (text) => {
        this.setState({ value: text });
        this.base.handleValueChange(text);
    }

    handleCheckboxPress = (index) => () => {
        var newStorageValue = index;

        this.setState({storageValue: newStorageValue});
        this.base.handleValueChange(newStorageValue);
    }

    getCheckboxFor = (item, index) => {

        //Check whether the current value array contains the current index.
        var checked = index == this.state.storageValue; 

        return (
            <View style={styles.item} key={index}>
                <Text style={styles.title}>{item}</Text>
                <Checkbox style={styles.checkbox} checked={checked} onPress={this.handleCheckboxPress(index)} />
            </View>
        );
    }

    render() {
        return (
            <View>
                <AbstractPreferenceDialog ref={instance => this.base = instance} title={this.props.label} value={this.state.storageValue} {...this.props}>
                    <View style={{marginLeft: 25, marginRight: 25}}>
                        {this.state.options.map((item, index) => {
                            return this.getCheckboxFor(item, index)
                        })}
                    </View>
                </AbstractPreferenceDialog>
            </View>
        );  
    }
}  

DialogPreferenceSelect.propTypes ={
    visible: PropTypes.bool.isRequired,
    storageValue: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired   
}