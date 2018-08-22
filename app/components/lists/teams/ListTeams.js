import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import ListItemTeam from './ListItemTeam';



export default class ListTeams extends Component
{

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(
            <View>
                {this.props.items.map((item, index) => {
                    return <ListItemTeam key={item.id} team={item} index={index} onContextMenuItemSelected={this.props.onContextMenuItemSelected} onItemSelected={this.props.onItemSelected}/>
                })}
            </View>
        );
    }
}

ListTeams.propTypes = {
    items: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func.isRequired,
    onContextMenuItemSelected: PropTypes.func.isRequired
}