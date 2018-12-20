import React from "react";
import { View, StyleSheet } from "react-native";
import AbstractChartGranularity from "../granularity/models/granularities/AbstractChartGranularity";
import VsmAreaChart from "../chart/VsmAreaChart";
import GranularityPicker from "../granularity/views/GranularityPicker";
import VsmConstants from "../VsmConstants";
import ReduxStory from "../../../dtos/redux/ReduxStory";

interface Props {
    granularity: AbstractChartGranularity,
    story: ReduxStory
}

interface State {
    granularity: AbstractChartGranularity,
    story: ReduxStory
}

const styles = StyleSheet.create({
    root: {
        height: "100%"
    },
    navigation: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 12,
        paddingLeft: 12
    },
    picker: {
        paddingTop: 35,
        paddingBottom: 35
    }
});

export default class ScreenVsm extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            granularity: props.granularity,
            story: props.story
        }

    }

    render()
    {
        return (
            <View style={styles.root}>
                <VsmAreaChart data={this.state.granularity.aggregate(this.state.story.document.data.startedOn, this.state.story)} />
                <GranularityPicker style={styles.picker} granularities={VsmConstants.GRANULARITIES} selected={1}/>
            </View>
        );
    }
}