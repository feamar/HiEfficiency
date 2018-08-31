import React, {Component} from "react";
import {View} from "react-native";
import ListItemTeam from './ListItemTeam';
import AbstractList from "../../abstractions/list/AbstractList";

export default class ListTeams extends AbstractList
{
    getListItemFor = (item, index) =>
    {
        console.log("KEY: " + item.id);
        return <ListItemTeam 
            key={item.id} 
            item={item} 
            index={index} 
            {...this.props}/>
    }
} 