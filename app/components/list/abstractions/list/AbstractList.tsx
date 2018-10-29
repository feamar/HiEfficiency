import React, {Component} from "react";
import {View, FlatList, NativeSyntheticEvent, NativeScrollEvent} from "react-native";
import ActionOption from "../../../../dtos/options/ActionOption";
import equal from "deep-equal";
import ListManager from "../../ListManager";
import { HiEfficiencyNavigator } from "../../../routing/RoutingTypes";
import { NavigationEventSubscription } from "react-navigation";

export interface AbstractList_Props_Virtual<ModelType>
{
    items: Array<ModelType>,
    containerHasFab?: boolean,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void,
    listId: string,
    navigation: HiEfficiencyNavigator
}

interface AbstractList_Props_Sealed<ModelType>
{
    getItemLayout?: (data: ModelType[] | null, index: number) => {
        length: number,
        offset: number,
        index: number
      };
    getListItemFor: (item: ModelType, index: number) => JSX.Element,
    getItemKey: (item: ModelType) => string
}

type Props<ModelType> = AbstractList_Props_Virtual<ModelType> & AbstractList_Props_Sealed<ModelType>

interface State<ModelType>
{
    items: Array<ModelType>,
    containerHasFab: boolean,
}

export default class AbstractList<ModelType> extends Component<Props<ModelType>, State<ModelType>>
{
    private unsubscribers: Array<NavigationEventSubscription>;
    private list?: FlatList<ModelType>; 

    constructor(props: Props<ModelType>) 
    {
        super(props);

        this.unsubscribers = [];
        this.state = 
        {
            items: this.props.items,
            containerHasFab: this.props.containerHasFab || false,
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

    scrollToSavedPosition = (animated: boolean = false) =>
    {
        const saved = ListManager.instance.getStoredOffset(this.props.listId);

        if(saved)
        {
            this.scrollTo(saved, animated);
        }
    }

    componentWillMount = () =>
    {  
        var unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.onScreenWillFocus(payload)});
        this.unsubscribers.push(unsubscriber);
    }

    componentWillUnmount = () =>
    {   this.unsubscribers.forEach(unsubscriber => unsubscriber.remove());}

    onScreenWillFocus = (_payload: any) =>
    {
        this.onListReference(this.list || null);
    }

    componentDidMount = () =>
    {
        this.onListReference(this.list || null);
    }

    onScroll = (event?: NativeSyntheticEvent<NativeScrollEvent>) =>
    {
        if(event)
        {
            ListManager.instance.onScrollOffsetChanged(this.props.listId, event.nativeEvent.contentOffset.y);
        }
    }

    scrollTo = (offset: number, animated: boolean = false) =>
    {
        if(this.list)
        {   
            this.list.scrollToOffset({animated: animated, offset: offset});
            return true;
        }

        return false;
    }
    
    onListReference = (reference: FlatList<ModelType> | null) =>
    {
        if(reference == null)
        {
            this.list = undefined;
        }
        else
        {
            this.list = reference;
            this.scrollToSavedPosition();
        }
    }

    render() 
    {
        return(
            <FlatList ref={this.onListReference} onScroll={this.onScroll} getItemLayout={this.props.getItemLayout} updateCellsBatchingPeriod={50} removeClippedSubviews={true} data={this.state.items} keyExtractor={this.props.getItemKey} renderItem={(data) => this.props.getListItemFor(data.item, data.index)} ListFooterComponent={this.getListFooterComponent()} />
        ); 
    }    
}