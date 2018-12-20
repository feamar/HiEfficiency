import React from "react";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import { View, StyleSheet} from "react-native";
import PartialTimestamp from "./PartialTimestamp";
import PartialEvent from "./PartialEvent";
import PartialEfficiency from "./PartialEfficiency";
import ModelFinish from "../models/ModelFinish";
import TimelineConstants from "../TimelineConstants";
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../../components/list/abstractions/list/AbstractListItem";

const styles = StyleSheet.create({
    root:{
        flexDirection: "row",
        height: TimelineConstants.EVENT_HEIGHT
    }
});

type Props = AbstractListItem_Props_Virtual<ModelFinish>

interface State {

}

export default class ViewFinish extends React.Component<Props, State> implements Baseable<AbstractListItem<ModelFinish>>
{
    public base: AbstractListItem<ModelFinish> | undefined;
    
    getItemContent = (item: ModelFinish) =>
    { 
        return (
            <View style={styles.root}>
                <PartialTimestamp timestamp={item.timestamp} shouldShowDate={false} shouldShowTime={true} />
                <PartialEvent big={true} upperLine={true} lowerLine={false} />
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