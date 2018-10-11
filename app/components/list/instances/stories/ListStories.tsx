import React, {Component} from "react";
import AbstractList, { AbstractListPropsVirtual } from "../../abstractions/list/AbstractList";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ListItemStory from "./ListItemStory";
import ReduxStory from "../../../../dtos/redux/ReduxStory";

type Props = AbstractListPropsVirtual<ReduxStory> & 
{
 
}

interface State
{
    
}

export default class ListStories extends Component<Props, State> implements Baseable<AbstractList<ReduxStory>>
{
    public base: AbstractList<ReduxStory> | undefined = undefined;

    getItemKey = (item: ReduxStory) => 
    {   return item.document.data.name;}

    getListItemFor = (item: ReduxStory, index: number) =>
    {
        return <ListItemStory 
            {...this.props}
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