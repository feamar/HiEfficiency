import React, {Component} from "react";
import {View} from "react-native";
import ListItemTeam from './ListItemTeam';
import AbstractList from "../../abstractions/list/AbstractList";

export default class ListTeams extends AbstractList
{
    getItemKey = (item, index) => 
    {   return item.id;}

    getListItemFor = (item, index) =>
    {
        return <ListItemTeam 
            item={item} 
            index={index} 
            {...this.props}/>
    }
} 