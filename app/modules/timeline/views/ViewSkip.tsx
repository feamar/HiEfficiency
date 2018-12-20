import React from "react";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import { View, StyleSheet } from "react-native";
import ModelSkip from "../models/ModelSkip";
import PartialTimestamp from "./PartialTimestamp";
import PartialSkipLine from "./PartialSkipLine";
import PartialEfficiency, { EfficiencyMode } from "./PartialEfficiency";
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../../components/list/abstractions/list/AbstractListItem";

const styles = StyleSheet.create({
    root:{
        flexDirection: "row",
    }
});

type Props = AbstractListItem_Props_Virtual<ModelSkip>

interface State {

}

export default class ViewSkip extends React.Component<Props, State> implements Baseable<AbstractListItem<ModelSkip>>
{
    public base: AbstractListItem<ModelSkip> | undefined;
    
    getItemContent = (item: ModelSkip) =>
    { 
        return (
            <View style={styles.root}>
                <PartialTimestamp shouldShowDate={true} shouldShowTime={false} timestamp={item.timestamp} />
                <PartialSkipLine />
                <PartialEfficiency segment={item.segment} mode={EfficiencyMode.SKIP} />
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