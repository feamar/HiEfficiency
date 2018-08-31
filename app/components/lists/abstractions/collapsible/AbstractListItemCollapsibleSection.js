import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Theme from "../../../../styles/Theme";

const styles = {
    listItem:{ 
        flexDirection: "row",
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center"
    },
    actionWrapper:{ 
        paddingTop:10,
        paddingBottom: 10,
        paddingLeft:20,
        paddingRight: 20
    },
    title: {
        color: Theme.colors.typography.title,
        fontWeight: "bold",
        paddingLeft: 20
    }
}
 
export default class AbstractListItemCollapsibleSection extends Component
{ 
    constructor(props)
    {
        super(props);

        this.state = {
            items: this.props.items,
            open: this.props.open,
            dividers: this.props.dividers,
            title: this.props.title
        }
    }

    componentWillReceiveProps = (props) => 
    {  
        this.setState({items: props.items});
    }

    onListItemSelected = () => () =>
    {
        this.setState({open: !this.state.open}, () => 
        {
            if(this.props.onListItemCollapsed)
            {   this.props.onListItemCollapsed(this.state.open);}
        });

    }

    render()
    {
        return (
            <View>
                <TouchableRipple onPress={this.onListItemSelected()}>
                    <View style={styles.listItem}>
                        <View style={styles.contentWrapper}>
                            <Text style={styles.title}>{this.state.title}</Text>
                        </View>
                        <TouchableRipple onPress={this.onListItemSelected()} style={styles.actionWrapper}>
                            <Icon style={styles.icon} size={30} name={this.state.open ? "expand-more" : "chevron-left"} />
                        </TouchableRipple>
                    </View>
                </TouchableRipple>
                {this.state.dividers && <Divider />}
                {this.state.open && this.props.children}
            </View>
        );
    }
}

AbstractListItemCollapsibleSection.propTypes = {
    open: PropTypes.bool,
    dividers: PropTypes.bool,
    title: PropTypes.string.isRequired,
    onListItemCollapsed: PropTypes.func
}
