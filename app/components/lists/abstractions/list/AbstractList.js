import React, {Component} from "react";
import {View, ScrollView} from "react-native";

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

    render() 
    {
        return(
            <ScrollView style={styles.scrollView}> 
                {this.state.items.map((item, index) => {
                    return this.getListItemFor(item, index);
                })}
                {this.state.containerHasFab && <View style={{height:88}}></View>}
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