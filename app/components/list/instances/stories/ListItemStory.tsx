import React from "react";
import {Text} from "react-native-paper"
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import Theme from "../../../../styles/Theme";
import ActionType from "../../../../enums/ActionType";
import { StyleSheet } from "react-native";
import DocumentTeam from "../../../../dtos/firebase/firestore/documents/DocumentTeam";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ReduxStory from "../../../../dtos/redux/ReduxStory";

const styles = StyleSheet.create({
    teamName: {
        paddingLeft: 20,
        fontWeight: "bold",
        color: Theme.colors.typography.title
    }
});
 
type Props = AbstractListItemPropsVirtual<ReduxStory> &
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
        return <Text style={styles.teamName}>{item.document.data.name}</Text>
    }

    onBaseReference = async (reference?: AbstractListItem<ReduxStory>) =>
    {
        if(reference)
        {
            await reference.addContextMenuItem(new ActionOption(ActionType.LEAVE, "Leave"));
            await reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));

            if(__DEV__)
            {   await reference.addContextMenuItem(new ActionOption(ActionType.DELETE, "(Development) Delete"));}
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