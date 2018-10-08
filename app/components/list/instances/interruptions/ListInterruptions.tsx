import React, { Component } from "react";
import AbstractListCollapsible, { AbstractListCollapsiblePropsVirtual } from "../../abstractions/collapsible/AbstractListCollapsible";
import { AbstractListItemCollapsiblePropsVirtual } from "../../abstractions/collapsible/AbstractListItemCollapsible";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ModelFinish from "./models/ModelFinish";
import ModelInterruption from "./models/ModelInterruption";
import ListItemFinish from "./ListItemFinish";
import ListItemInterruption from "../../../lists/instances/interruptions/ListItemInterruption";
import { StyleSheet } from "react-native";
import Theme from "../../../../styles/Theme";
import ModelStart from "./models/ModelStart";
import ModelProductive from "./models/ModelProductive";
import ListItemStart from "./ListItemStart";
import ListItemProductive from "../../../lists/instances/interruptions/ListItemProductive";


export const InterruptionListStyles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20
    },
    icon:{
        paddingRight: 20 
    },
    text_wrapper:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 16,
        paddingBottom: 16
    }, 
    text_title:
    {
        fontWeight: "bold",
        color: Theme.colors.typography.title
    },
    text_subtitle:
    {
        color: Theme.colors.typography.subtitle
    }
});



type ModelType = ModelFinish | ModelInterruption | ModelStart | ModelProductive;
type SectionType = AbstractListItemCollapsiblePropsVirtual<ModelType>;

type Props = AbstractListCollapsiblePropsVirtual<SectionType> & 
{

}

interface State
{
}

export default class ListInterruptions extends Component<Props, State> implements Baseable<AbstractListCollapsible<ModelType, SectionType>>
{
    private mBase?: AbstractListCollapsible<ModelType, SectionType>;

    getListItemFor = (section: SectionType, item: ModelType, index: number): JSX.Element =>
    {
        if(this.isStart(item))
        {   return <ListItemStart {...this.createProps(section, item, index)} />;}
        else if(this.isInterruption(item))
        {   return <ListItemInterruption {...this.createProps(section, item, index)} />;}
        else if(this.isProductive(item))
        {   return <ListItemProductive {...this.createProps(section, item, index)} />;}
        else 
        {   return <ListItemFinish {...this.createProps(section, item, index)} />}
    }

    public createProps = <Type extends {}> (section: SectionType, item: Type, index: number) =>
    {
        return {
            item: item,
            index: index, 
            onContextMenuItemSelected: section.onContextMenuItemSelected,
            onItemSelected: section.onItemSelected
        }
    } 

    public isStart = (item: ModelType) : item is ModelStart =>
    {   return item.constructor == ModelStart;}

    public isInterruption = (item: ModelType) : item is ModelInterruption =>
    {   return item.constructor == ModelInterruption;}

    public isProductive = (item: ModelType) : item is ModelProductive =>
    {   return item.constructor == ModelProductive;}

    public isFinish = (item: ModelType) : item is ModelFinish =>
    {   return item.constructor == ModelFinish;}


    public get base ()
    {   return this.mBase;}

    render()
    {
        return (
            <AbstractListCollapsible<ModelType, SectionType> ref={onBaseReference(this)} {...this.props} getListItemFor={this.getListItemFor}/>
        );
    }
}