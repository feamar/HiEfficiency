import React, {Component} from "react";
import ListItemStory from './ListItemStory';
import AbstractList from "../../abstractions/list/AbstractList";

export default class ListStories extends AbstractList
{
    getListItemFor(item, index)
    {
        return <ListItemStory 
            key={item.id} 
            item={item} 
            index={index} 
            {...this.props} />
    }
}  