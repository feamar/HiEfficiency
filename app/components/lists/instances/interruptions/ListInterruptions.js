import React, {Component} from "react";
import AbstractListCollapsible from "../../abstractions/collapsible/AbstractListCollapsible";
import ListItemInterruption from "./ListItemInterruption";
import {View} from "react-native";
import ListItemFinish from "./ListItemFinish";

export default class ListInterruptions extends AbstractListCollapsible
{
    getListItemFor(item, index)
    {
        return <item.ListItemType 
            key={item.id} 
            item={item} 
            index={index} 
            {...this.props}/>
    }
}