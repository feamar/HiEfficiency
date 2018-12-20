import React from "react";
import { StyleSheet, View, TouchableHighlight, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import AbstractChartGranularity from "../models/granularities/AbstractChartGranularity";
import Theme from "../../../../styles/Theme";
import Color from "../../../../dtos/color/Color";
import ColorChannel from "../../../../dtos/color/ColorChannel";

interface Props
{
    granularity: AbstractChartGranularity,
    selected: boolean,
    style?: ViewStyle
}

interface State
{
    granularity: AbstractChartGranularity,
    selected: boolean
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "row"
    },
    text: {
        opacity: 0.5
    }
});

export default class GranularityButton extends React.Component<Props, State>
{
    constructor(props: Props) 
    {
        super(props)

        this.state = {
            granularity: props.granularity,
            selected: props.selected
        }
    }


    onPress = () =>
    {

    }

    getTouchableStyles = (selected: boolean): ViewStyle =>
    {
        var color = Color.fromHexadecimal(Theme.colors.primaryLight);
        color = Color.fromChannels(color.getChannelRed(), color.getChannelGreen(), color.getChannelBlue(), ColorChannel.fromByteValue(128));

        return {
            borderRadius: 50,
            backgroundColor: selected ? color.toHexadecimal(true, true) : "transparent",
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 10,
            paddingRight: 10
        }
    }

    render()
    {
        return (
            <View style={this.props.style || {}}>
                <View style={styles.root}>
                    <TouchableHighlight style={this.getTouchableStyles(this.state.selected)} onPress={this.onPress}>
                        <Text style={styles.text} >{this.state.granularity.text}</Text>
                    </TouchableHighlight>
                </View>
            </View>            
        );
    }
}