import React, {Component} from "react";
import {View, ScrollView} from "react-native";

import PropTypes from "prop-types";

const styles = {
    scrollView:
    {
    }
}

export default class AbstractList extends Component
{
    render() 
    {
        return(
            <ScrollView style={styles.scrollView}> 
                {this.props.items.map((item, index) => {
                    return this.getListItemFor(item, index);
                })}
                {this.props.containerHasFab && <View style={{height:88}}></View>}
            </ScrollView>  
        ); 
    }    
}
 
AbstractList.propTypes = {
    items: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func,
    containerHasFab: PropTypes.bool.isRequired
}