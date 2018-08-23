import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from 'react-native-paper';

import Theme from '../../styles/Theme';
import {Divider} from "react-native-paper";
import PropTypes from "prop-types";

const styles = {
    root:
    {
    },
    title: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,   
        color: Theme.colors.primary,
    },
    wrapper:{

    }
}

export default class PreferenceCategory extends Component {
    render() {
        return (
            <View style={styles.root}>
                <Text style={styles.title}>{this.props.title}</Text>
                <View style={styles.wrapper}>{this.props.children}</View>
                <Divider />
            </View>
        );
    }
}

PreferenceCategory.propTypes ={
    title: PropTypes.string.isRequired,
}