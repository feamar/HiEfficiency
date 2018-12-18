import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import GranularityButton from "./GranularityButton";
import AbstractChartGranularity from "../models/granularities/AbstractChartGranularity";

interface Props
{
    granularities: Array<AbstractChartGranularity>,
    selected?: number,
    style?: ViewStyle
}

interface State
{
    buttons: Array<AbstractChartGranularity>,
    selected: number
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 20,
        paddingLeft: 20
    }
});

export default class GranularityPicker extends React.Component<Props, State>
{
    constructor(props: Props) 
    {
        super(props)

        this.state = {
            buttons: props.granularities,
            selected: props.selected || 0
        }
    }


    getButtonStyle = (index: number) =>
    {
        return {
            paddingLeft: 20,
            paddingRight: index == this.state.buttons.length - 1 ? 20 : 0
        }
    }

    render()
    {


        return (
            <View style={this.props.style || {}}>
                <View style={styles.root}>
                    {
                        this.state.buttons.map((granularity, index) => 
                        {
                            return <GranularityButton style={this.getButtonStyle(index)} key={granularity.text} granularity={granularity} selected={index == this.state.selected} />  
                        })
                    }
                </View>
            </View>
        );
    }
}