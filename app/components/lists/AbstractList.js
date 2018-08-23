import React, {Component} from "react";
import {View, ScrollView} from "react-native";

import PropTypes from "prop-types";

const styles = {
    scrollView:
    {
        height: " 100%",
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
            </ScrollView>
        );
    }
}

AbstractList.propTypes = {
    items: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func
}