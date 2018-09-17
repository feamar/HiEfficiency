import React, {Component} from "react";
import {View, ScrollView, FlatList} from "react-native";

import PropTypes from "prop-types";
import { Item } from "native-base";
import UtilityObject from "../../../../utilities/UtilityObject";

const styles = {
    scrollView:
    {
    }
}

export default class AbstractList extends Component
{
    constructor(props) 
    {
        super(props)
        {
            this.state = {
                items: this.props.items,
                containerHasFab: this.props.containerHasFab
            }
        }
    }

    componentWillReceiveProps(props) 
    {
        this.setState({items: props.items, containerHasFab: props.containerHasFab});
    }

    getListFooterComponent = () =>
    {
        if(this.state.containerHasFab)
        {   return <View key={9999999} style={{height:88}}></View>}

        return null;
    }

    getItemKey = (item, index) => item.key;

    render() 
    {
        return(
            <FlatList data={this.state.items} keyExtractor={this.getItemKey} renderItem={(data) => this.getListItemFor(data.item, data.index)} ListFooterComponent={this.getListFooterComponent()} />
        ); 
    }    
}
 
AbstractList.propTypes = {
    items: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func,
    containerHasFab: PropTypes.bool.isRequired
}