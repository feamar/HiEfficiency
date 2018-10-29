import React, {Component} from "react";
import {View, FlatList} from "react-native";
import ActionOption from "../../../../dtos/options/ActionOption";
import equal from "deep-equal";

export interface AbstractListPropsVirtual<ModelType>
{
    items: Array<ModelType>,
    containerHasFab?: boolean,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void,
}

interface AbstractListPropsSealed<ModelType>
{
    getItemLayout?: (data: ModelType[] | null, index: number) => {
        length: number,
        offset: number,
        index: number
      };
    getListItemFor: (item: ModelType, index: number) => JSX.Element,
    getItemKey: (item: ModelType) => string
}

type Props<ModelType> = AbstractListPropsVirtual<ModelType> & AbstractListPropsSealed<ModelType>

interface State<ModelType>
{
    items: Array<ModelType>,
    containerHasFab: boolean
}

export default class AbstractList<ModelType> extends Component<Props<ModelType>, State<ModelType>>
{
    constructor(props: Props<ModelType>) 
    {
        super(props);

        this.state = 
        {
            items: this.props.items,
            containerHasFab: this.props.containerHasFab || false
        }
    }


    shouldComponentUpdate = (nextProps: Readonly<Props<ModelType>>, nextState: Readonly<State<ModelType>>, _nextContext: Readonly<any>) =>
    {
        if(equal(nextProps, this.props) && equal(nextState, this.state))
        {   return false;}

        return true;
    }


    componentWillReceiveProps(props: Props<ModelType>) 
    {   this.setState({items: props.items, containerHasFab: props.containerHasFab || false});}

    getListFooterComponent = () =>
    {
        if(this.state.containerHasFab)
        {   return <View key={9999999} style={{height:88}}></View>}

        return null;
    }



    
    render() 
    {
        return(
            <FlatList getItemLayout={this.props.getItemLayout} updateCellsBatchingPeriod={50} removeClippedSubviews={true} data={this.state.items} keyExtractor={this.props.getItemKey} renderItem={(data) => this.props.getListItemFor(data.item, data.index)} ListFooterComponent={this.getListFooterComponent()} />
        ); 
    }    
}