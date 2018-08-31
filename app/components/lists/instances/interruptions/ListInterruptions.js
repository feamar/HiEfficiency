import React, {Component} from "react";
import AbstractListCollapsible from "../../abstractions/collapsible/AbstractListCollapsible";
import ListItemInterruption from "./ListItemInterruption";

export default class ListInterruptions extends AbstractListCollapsible
{
    getListItemFor(item, index)
    {
       return <ListItemInterruption 
        key={item.id} 
        item={item} 
        index={index} 
        {...this.props} />
    }
}