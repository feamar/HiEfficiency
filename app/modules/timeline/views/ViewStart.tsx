import React from "react";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import ModelStart from "../models/ModelStart";
import { View, StyleSheet} from "react-native";
import PartialTimestamp from "./PartialTimestamp";
import PartialEvent from "./PartialEvent";
import PartialEfficiency from "./PartialEfficiency";
import PartialPercentages from "./PartialPercentages";
import TimelineConstants from "../TimelineConstants";
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../../components/list/abstractions/list/AbstractListItem";

const styles = StyleSheet.create({
    root:{
        flexDirection: "row",
        height: TimelineConstants.EVENT_HEIGHT
    },
    wrapper:
    {
        flex: 1
    }
});

type Props = AbstractListItem_Props_Virtual<ModelStart>

interface State {

}

export default class ViewStart extends React.Component<Props, State> implements Baseable<AbstractListItem<ModelStart>>
{
    public base: AbstractListItem<ModelStart> | undefined;
    
    getItemContent = (item: ModelStart) =>
    { 
        return (
            <View>
                <PartialPercentages />
                <View style={styles.root}>
                    <PartialTimestamp timestamp={item.timestamp} shouldShowDate={true} shouldShowTime={true} />
                    <PartialEvent big={true} upperLine={false} lowerLine={true}></PartialEvent>
                    <PartialEfficiency segment={item.segment}  />
                </View>
            </View>
        );
    }

    render()
    {
        return (
            <AbstractListItem divider={false} ref={onBaseReference(this)} content={this.getItemContent} {...this.props} />            
        );
    }
}