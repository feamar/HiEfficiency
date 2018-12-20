import React from "react";
import {Text} from "react-native-paper"
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../abstractions/list/AbstractListItem";
import Theme from "../../../../styles/Theme";
import ActionType from "../../../../enums/ActionType";
import { StyleSheet, View, ViewStyle } from "react-native";
import DocumentTeam from "../../../../dtos/firebase/firestore/documents/DocumentTeam";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ReduxStory from "../../../../dtos/redux/ReduxStory";
import StoryType from "../../../../enums/StoryType";
import equal from "deep-equal";

const styles = StyleSheet.create({
    teamName: {
        paddingLeft: 20,
        fontWeight: "bold",
        color: Theme.colors.typography.title
    },
    wrapper:{
        flexDirection: "row", 
        flex: 1
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
});
 
type Props = AbstractListItem_Props_Virtual<ReduxStory> &
{

}

interface State
{

}

export default class ListItemStory extends React.Component<Props, State> implements Baseable<AbstractListItem<ReduxStory>>
{
    public base: AbstractListItem<ReduxStory> | undefined;

    constructor(props: Props)
    {   super(props);}

    getItemContent = (item: ReduxStory) => 
    {
        const type = StoryType.fromId(item.document.data.type) || StoryType.Feature;

        return (
            <View style={styles.wrapper}>
                <View style={this.getItemIndicatorStyle(type)} />
                <View style={styles.contentWrapper}>
                    <Text numberOfLines={2} style={styles.storyName}>{item.document.data.name}</Text>
                    <Text style={styles.storyUpvotes}>{type.name}: {item.document.data.upvotes} votes</Text>
                </View>
            </View>
        );
    }

    shouldComponentUpdate = (nextProps: Readonly<Props>, nextState: Readonly<State>, _nextContext: Readonly<any>) =>
    {
        if(equal(nextProps, this.props) && equal(nextState, this.state))
        {   return false;}

        return true;
    }

    getItemIndicatorStyle = (type: StoryType ) =>
    {
        const style: ViewStyle = 
        {
            width: 7,
            height: "100%",
            backgroundColor: type.color.toCss(),
            opacity: 0.7 
        }

        return style;
    }

    onBaseReference = async (reference?: AbstractListItem<ReduxStory>) =>
    {
        if(reference)
        {
            await reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));
            if(reference.state.item.document.data.finishedOn == undefined)
            {   await reference.addContextMenuItem(new ActionOption(ActionType.UPVOTE, "Upvote"));}
            await reference.addContextMenuItem(new ActionOption(ActionType.DELETE, "Delete"));
        }
    }

    getItemKey = (item: DocumentTeam) => 
    {   return item.name + item.code;}

    render()
    {
        return (
            <AbstractListItem ref={onBaseReference(this)} content={this.getItemContent} {...this.props} />            
        );
    }
}