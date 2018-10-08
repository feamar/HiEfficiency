import React from "react";
import {Text} from "react-native-paper"
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import Theme from "../../../../styles/Theme";
import ActionType from "../../../../enums/ActionType";
import { StyleSheet } from "react-native";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ReduxTeam from "../../../../dtos/redux/ReduxTeam";

const styles = StyleSheet.create({
    teamName: {
        paddingLeft: 20,
        fontWeight: "bold",
        color: Theme.colors.typography.title
    }
});
 
type Props = AbstractListItemPropsVirtual<ReduxTeam> & 
{

}

interface State
{

}

export default class ListItemTeam extends React.Component<Props, State> implements Baseable<AbstractListItem<ReduxTeam>>
{
    private mBase: AbstractListItem<ReduxTeam> | undefined;

    constructor(props: Props)
    {   super(props);}

    get base()
    {   return this.mBase;}
    
    getItemContent = (item: ReduxTeam) => 
    {
        return <Text style={styles.teamName}>{item.document.data.name}</Text>
    }

    onBaseReference = (reference?: AbstractListItem<ReduxTeam>) =>
    {
        if(reference)
        {
            reference.addContextMenuItem(new ActionOption(ActionType.LEAVE, "Leave"));
            reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));

            if(__DEV__)
            {   reference.addContextMenuItem(new ActionOption(ActionType.DELETE, "(Development) Delete"));}
        }
    }

    getItemKey = (item: ReduxTeam) => 
    {   return item.document.id!;}

    render()
    {
        return (
            <AbstractListItem ref={onBaseReference(this)} content={this.getItemContent} {...this.props} />            
        );
    }
}