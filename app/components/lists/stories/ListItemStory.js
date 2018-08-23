import React, {Component} from "react";
import {View} from "react-native";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import AbstractListItem from "../AbstractListItem";
import Theme from "../../../styles/Theme"
import StoryType from "../../../enums/StoryType";

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
 
export const ACTION_EDIT_STORY = "edit";
export const ACTION_UPVOTE_STORY = "upvote";
export const ACTION_INSPECT_STORY = "inspect";
export const ACTION_DELETE_STORY = "delete";

export default class ListItemTeam extends AbstractListItem
{
    constructor(props)
    {
        super(props);

        this.state = {
            ...this.state,
            storyName: this.state.item.data().name,
            storyUpvotes: this.state.item.data().upvotes
        }

        this.addContextMenuItem("Edit", ACTION_EDIT_STORY);
        this.addContextMenuItem("Upvote", ACTION_UPVOTE_STORY);
        this.addContextMenuItem("Inspect", ACTION_INSPECT_STORY);
        this.addContextMenuItem("Delete", ACTION_DELETE_STORY);
    }

    componentWillReceiveProps = (props) => 
    {
        this.setState({item: props.item, index: props.index});
    }  

    getItemIndicatorStyle = () =>
    {
        const type = StoryType.fromId(this.props.item.data().type);
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
        const data = this.state.item.data();
        const type = StoryType.fromId(data.type);
        var typeName = "Unknown";
        if(type)
        {   typeName = type.name;}
 
        return (
            <View style={styles.wrapper}>
                <View style={this.getItemIndicatorStyle()} />
                <View style={styles.contentWrapper}>
                    <Text style={styles.storyName}>{data.name}</Text>
                    <Text style={styles.storyUpvotes}>{typeName}: {data.upvotes} votes</Text>
                </View>
            </View>
        );
    }
}

