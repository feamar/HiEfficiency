import React, {Component} from "react";
import AbstractList, { AbstractListPropsVirtual } from "../../abstractions/list/AbstractList";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ListItemStory from "./ListItemStory";
import ReduxStory from "../../../../dtos/redux/ReduxStory";
import equal from "deep-equal";

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
    {   return item.document.id!;}

    getListItemFor = (item: ReduxStory, index: number) =>
    {
        return <ListItemStory 
            {...this.props}
            item={item} 
            index={index} />
    }


    shouldComponentUpdate = (nextProps: Readonly<Props>, nextState: Readonly<State>, _nextContext: Readonly<any>) =>
    {
        if(equal(nextProps, this.props) && equal(nextState, this.state))
        {   return false;}

        return true;
    }

    
    shouldShowEmptyListFiller = () =>
    {
        if(this.base == undefined)
        {   return true;}

        return this.base.state.items.length == 0;
    }

    getItemLayout = (_data: Array<ReduxStory> | null, index: number) =>
    {
        return {
            length: 70,
            offset: 70 * index,
            index: index
        }
    }

    render()
    {
        return (
            <AbstractList getItemLayout={this.getItemLayout} ref={onBaseReference(this)} getItemKey={this.getItemKey} getListItemFor={this.getListItemFor} {...this.props}/>
        );
    }
} 