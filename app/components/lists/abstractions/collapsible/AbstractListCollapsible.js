import React, {Component} from "react";
import {View, FlatList} from "react-native";
import PropTypes from "prop-types";
import AbstractListItemCollapsibleSection from "./AbstractListItemCollapsibleSection";

const styles = {
    scrollView:
    {
        flex: 1,
    }
}


export default class AbstractListCollapsible extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            sections: this.props.sections,
            containerHasFab: this.props.containerHasFab
        }
    }

    getListSectionFor = (section, index) => 
    {
        return (

            <AbstractListItemCollapsibleSection title={section.title} open={section.open} dividers={true}>
                {section.items.map((item, index) => 
                {   return this.getListItemFor(item, index);})}
            </AbstractListItemCollapsibleSection>
        );
    } 
 
    componentWillReceiveProps = (props) => 
    {
        this.setState({sections: props.sections, containerHasFab: props.containerHasFab});
    }
    
    getItemKey = (item, index) =>
    {   return item.title;}

    
    getListFooterComponent = () =>
    {
        if(this.state.containerHasFab)
        {   return <View key={9999999} style={{height:88}}></View>}

        return null;
    }

    render()  
    {
        return (
            <FlatList data={this.state.sections} keyExtractor={this.getItemKey} renderItem={(data) => this.getListSectionFor(data.item, data.index)} ListFooterComponent={this.getListFooterComponent()} />
        );
    }
}

AbstractListCollapsible.propTypes = {
    sections: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func,
    containerHasFab: PropTypes.bool.isRequired
}