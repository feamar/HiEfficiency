import React, {Component} from "react";
import AbstractList, { AbstractListPropsVirtual } from "../../abstractions/list/AbstractList";
import ListItemTeam from "./ListItemTeam";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ReduxTeam from "../../../../dtos/redux/ReduxTeam";

type Props = AbstractListPropsVirtual<ReduxTeam> & 
{
 
}

interface State
{
    
}

export default class ListTeams extends Component<Props, State> implements Baseable<AbstractList<ReduxTeam>>
{
    public base: AbstractList<ReduxTeam> | undefined = undefined;

    getItemKey = (item: ReduxTeam) => 
    {   return item.document.id!;}

    getListItemFor = (item: ReduxTeam, index: number) =>
    {
        return <ListItemTeam 
            {...this.props}
            key={item.document.id!}
            item={item} 
            index={index} />
    }

    render()
    {
        return (
            <AbstractList ref={onBaseReference(this)} getItemKey={this.getItemKey} getListItemFor={this.getListItemFor} {...this.props}/>
        );
    }
} 