import React from "react";
import ModelEvent from "./models/ModelEvent";
import ModelSkip from "./models/ModelSkip";
import AbstractTimelineModel from "./models/AbstractTimelineModel";
import ViewStart from "./views/ViewStart";
import ModelStart from "./models/ModelStart";
import ModelFinish from "./models/ModelFinish";
import ViewEvent from "./views/ViewEvent";
import ViewSkip from "./views/ViewSkip";
import ViewFinish from "./views/ViewFinish";
import AbstractList, { AbstractList_Props_Virtual } from "../../components/list/abstractions/list/AbstractList";
import { Baseable } from "../../render_props/Baseable";
import AbstractListItem from "../../components/list/abstractions/list/AbstractListItem";



export type TimelineModelType = ModelStart | ModelEvent | ModelFinish | ModelSkip;

type Props = AbstractList_Props_Virtual<AbstractTimelineModel> 

interface State
{

}

export default class Timeline extends React.Component<Props, State> implements Baseable<AbstractListItem<AbstractTimelineModel>>
{
    public base: AbstractListItem<AbstractTimelineModel> | undefined;

    constructor(props: Props)
    {
        super(props);
    }

    getItemKey = (item: AbstractTimelineModel) =>
    {
        return item.timestamp.getTime().toString();
    }

    getListItemFor = (item: AbstractTimelineModel, index: number) =>
    {
        if(item instanceof ModelStart)
        {
            return <ViewStart item={item} index={index} />
        }
        else if(item instanceof ModelEvent)
        {
            return <ViewEvent item={item} index={index} />
        }
        else if(item instanceof ModelSkip)
        {
            return <ViewSkip item={item} index={index} />
        }
        else
        {
            return <ViewFinish item={item as ModelFinish} index={index} />
        }
    }

    public createProps = <Type extends {}> (item: Type, index: number, key: string) =>
    {
        return {
            key: key,
            item: item,
            index: index, 
            onContextMenuItemSelected: this.props.onContextMenuItemSelected,
            onItemSelected: this.props.onItemSelected
        }
    } 

    getItemLayout = (_data: Array<AbstractTimelineModel> | null, index: number) =>
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
            <AbstractList getItemLayout={this.getItemLayout} getItemKey={this.getItemKey} getListItemFor={this.getListItemFor} {...this.props}/>            
        );
    }
}
