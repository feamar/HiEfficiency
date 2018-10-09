import React, { Component } from "react";
import AbstractListCollapsible, { AbstractListCollapsible_Props_Virtual } from "../../abstractions/collapsible/AbstractListCollapsible";
import { AbstractListItemCollapsible_Props_Virtual } from "../../abstractions/collapsible/AbstractListItemCollapsible";
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



export type InterruptionModelType = ModelFinish | ModelInterruption | ModelStart | ModelProductive;
type SectionType = AbstractListItemCollapsible_Props_Virtual<InterruptionModelType>;

type Props = AbstractListCollapsible_Props_Virtual<InterruptionModelType, SectionType> & 
{

}

interface State
{
}

export default class ListInterruptions extends Component<Props, State> implements Baseable<AbstractListCollapsible<InterruptionModelType, SectionType>>
{
    private mBase?: AbstractListCollapsible<InterruptionModelType, SectionType>;

    getListItemFor = (section: SectionType, item: InterruptionModelType, index: number): JSX.Element =>
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

    public isStart = (item: InterruptionModelType) : item is ModelStart =>
    {   return item.constructor == ModelStart;}

    public isInterruption = (item: InterruptionModelType) : item is ModelInterruption =>
    {   return item.constructor == ModelInterruption;}

    public isProductive = (item: InterruptionModelType) : item is ModelProductive =>
    {   return item.constructor == ModelProductive;}

    public isFinish = (item: InterruptionModelType) : item is ModelFinish =>
    {   return item.constructor == ModelFinish;}


    public get base ()
    {   return this.mBase;}

    render()
    {
        return (
            <AbstractListCollapsible<InterruptionModelType, SectionType> ref={onBaseReference(this)} {...this.props} getListItemFor={this.getListItemFor}/>
        );
    }
}