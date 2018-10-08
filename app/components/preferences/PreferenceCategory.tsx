import React, { Component } from 'react';
import { View, StyleSheet } from "react-native";
import { Text } from 'react-native-paper';
import Theme from '../../styles/Theme';
import {Divider} from "react-native-paper";

const styles = StyleSheet.create({
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
});

interface Props
{
    title: string
}

interface State
{
    title: string
}

export default class PreferenceCategory extends Component<Props, State>
{
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
