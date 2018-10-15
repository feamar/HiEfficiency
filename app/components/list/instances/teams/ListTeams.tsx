import React, {Component} from "react";
import AbstractList, { AbstractListPropsVirtual } from "../../abstractions/list/AbstractList";
import ListItemTeam from "./ListItemTeam";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ReduxTeam from "../../../../dtos/redux/ReduxTeam";
import WithEmptyListFiller from "../../../../hocs/WithEmptyListFiller";
import ListFillerOption from "../../../../dtos/options/ListFillerOption";

type Props = AbstractListPropsVirtual<ReduxTeam> & 
{
 
}

interface State
{
    
}

class ListTeams extends Component<Props, State> implements Baseable<AbstractList<ReduxTeam>>
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

    shouldShowEmptyListFiller = () =>
    {
        if(this.base == undefined)
        {   return true;}

        return this.base.state.items.length == 0;
    }

    render()
    {
        return (
            <AbstractList ref={onBaseReference(this)} getItemKey={this.getItemKey} getListItemFor={this.getListItemFor} {...this.props}/>
        );
    }
} 


const hoc1 = WithEmptyListFiller<ListTeams, ListTeams, Props>(ListTeams, ListFillerOption.Awkward);
export default hoc1;