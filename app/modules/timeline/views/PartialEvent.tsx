import React from "react";
import Theme from "../../../styles/Theme";
import { Svg, Circle, Line } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import TimelineConstants from "../TimelineConstants";

const styles = StyleSheet.create({
    root:
    {
    }
});

interface Props {
    big: boolean,
    upperLine: boolean,
    lowerLine: boolean
}

interface State {
    big: boolean,
    upperLine: boolean,
    lowerLine: boolean
}

export default class PartialEvent extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            big: props.big,
            upperLine: props.upperLine,
            lowerLine: props.lowerLine
        }
    }

    render()
    {
        const height = TimelineConstants.EVENT_HEIGHT;
        const centerVertical = height / 2;

        return(
            <View style={styles.root}>
                <Svg width="40" height={height} viewBox={"0 0 40 " + height} >
                    {this.state.upperLine && <Line x1="20" y1={centerVertical} x2="20" y2="0" stroke={Theme.colors.primaryLight} strokeWidth="5"  />}
                    <Circle cx="20" cy={centerVertical} r={this.state.big ? 10 : 5} fill={Theme.colors.primaryLight} />
                    {this.state.lowerLine && <Line x1="20" y1={centerVertical} x2="20" y2={height} stroke={Theme.colors.primaryLight} strokeWidth="5" />}
                </Svg>
            </View>
        );
    }
}