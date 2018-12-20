import React from "react";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import { View, StyleSheet } from "react-native";
import ModelEvent from "../models/ModelEvent";
import PartialTimestamp from "./PartialTimestamp";
import PartialEvent from "./PartialEvent";
import PartialEfficiency from "./PartialEfficiency";
import TimelineConstants from "../TimelineConstants";
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../../components/list/abstractions/list/AbstractListItem";

const styles = StyleSheet.create({
    root:{
        flexDirection: "row",
        height: TimelineConstants.EVENT_HEIGHT
    }
});

type Props = AbstractListItem_Props_Virtual<ModelEvent>

interface State {

}

export default class ViewEvent extends React.Component<Props, State> implements Baseable<AbstractListItem<ModelEvent>>
{
    public base: AbstractListItem<ModelEvent> | undefined;
    
    getItemContent = (item: ModelEvent) =>
    { 
        return (
            <View style={styles.root}>
                <PartialTimestamp timestamp={item.timestamp} shouldShowDate={false} shouldShowTime={true} />
                <PartialEvent big={false} upperLine={true} lowerLine={true} />
                <PartialEfficiency segment={item.segment} />
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