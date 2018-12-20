import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native";
import UtilityTime from "../../../utilities/UtilityTime";

const styles = StyleSheet.create({
    root:
    {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
    },
    date:
    {
        fontWeight: "bold"
    },
    time:
    {

    }

});

interface Props {
    timestamp: Date,
    shouldShowDate: boolean,
    shouldShowTime: boolean
}

interface State {
    timestamp: Date,
    shouldShowDate: boolean,
    shouldShowTime: boolean
}

export default class PartialTimestamp extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            timestamp: this.props.timestamp,
            shouldShowDate: this.props.shouldShowDate,
            shouldShowTime: this.props.shouldShowTime
        }
    }

    render()
    {
        const date = UtilityTime.dateToString(this.state.timestamp).substring(0, 5);
        const time = UtilityTime.millisecondsSinceEpochToTimeOfDay(this.state.timestamp.getTime()).substring(0, 5);

        return(
            <View style={styles.root}>
                {this.state.shouldShowDate && <Text style={styles.date}>{date}</Text>}
                {this.state.shouldShowTime && <Text style={styles.time}>{time}</Text>}
            </View>
        );
    }
}