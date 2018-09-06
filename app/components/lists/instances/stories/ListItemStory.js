import React, {Component} from "react";
import {View} from "react-native";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import AbstractListItem from "../../abstractions/list/AbstractListItem";
import Theme from "../../../../styles/Theme"
import StoryType from "../../../../enums/StoryType";
import ActionType from "../../../../enums/ActionType";

const styles = {
    wrapper:{
        flexDirection: "row", 
        flex: 1
    },  
    typeIndicator:{

    },
    contentWrapper:{ 
        paddingLeft: 20,  
        justifyContent: "center"
    },
    storyName:{
        color: Theme.colors.typography.title,
        fontWeight: "bold"
    },
    storyUpvotes:{
        color: Theme.colors.typography.subtitle
    }
}

export default class ListItemTeam extends AbstractListItem
{
    constructor(props)
    {
        super(props);

        if(this.props.item.finishedOn == undefined)
        {   this.addContextMenuItem("Upvote", ActionType.UPVOTE);}

        this.addContextMenuItem("Inspect", ActionType.INSPECT);
        this.addContextMenuItem("Delete", ActionType.DELETE);
    }

    getItemIndicatorStyle = () =>
    {
        const type = StoryType.fromId(this.state.item.type);
        var color = "#ADADAD";
        if(type)
        {   color = type.color;}

        const style = {
            width: 7,
            height: "100%",
            backgroundColor: color,
            opacity: 0.7 
        }

        return style;
    }

    getItemContent = () =>
    {
        const type = StoryType.fromId(this.state.item.type);
        var typeName = "Unknown";
        if(type)
        {   typeName = type.name;}
 
        return (
            <View style={styles.wrapper}>
                <View style={this.getItemIndicatorStyle()} />
                <View style={styles.contentWrapper}>
                    <Text style={styles.storyName}>{this.state.item.name}</Text>
                    <Text style={styles.storyUpvotes}>{typeName}: {this.state.item.upvotes} votes</Text>
                </View>
            </View>
        );
    }
}

