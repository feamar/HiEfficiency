import React, {Component} from "react";
import ListItemStory from './ListItemStory';
import AbstractList from "../../abstractions/list/AbstractList";

export default class ListStories extends AbstractList
{
    getItemKey = (item, index) => 
    {   return item.id;}

    getListItemFor(item, index)
    {
        return <ListItemStory 
            item={item} 
            index={index} 
            {...this.props} />
    }
}  