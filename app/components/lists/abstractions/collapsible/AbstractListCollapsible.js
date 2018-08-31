import React, {Component} from "react";
import {View, ScrollView} from "react-native";
import {Divider,  ListAccordion } from "react-native-paper";
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

            <AbstractListItemCollapsibleSection key={section.title} title={section.title} open={section.open} dividers={true}>
                {section.items.map((item, index) => 
                {   return this.getListItemFor(item, index);})}
            </AbstractListItemCollapsibleSection>
        );
    } 
 
    componentWillReceiveProps = (props) => 
    {
        this.setState({sections: props.sections, containerHasFab: props.containerHasFab});
    }
    
    render()  
    {
        return (
            <ScrollView style={styles.scrollView}> 
                {this.state.sections.map((section, index) => 
                {   return this.getListSectionFor(section, index);})}
                {this.state.containerHasFab && <View style={{height:88}}></View>}
            </ScrollView>  
        );
    }
}

AbstractListCollapsible.propTypes = {
    sections: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func,
    containerHasFab: PropTypes.bool.isRequired
}