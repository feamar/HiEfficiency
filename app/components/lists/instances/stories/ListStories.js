import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
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