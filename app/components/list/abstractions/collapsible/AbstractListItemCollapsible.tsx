import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import Theme from "../../../../styles/Theme";
import ActionOption from "../../../../dtos/options/ActionOption";

const styles = StyleSheet.create({
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
});
 
export interface AbstractListItemCollapsible_Props_Virtual<ModelType>
{
    items: Array<ModelType>,
    open?: boolean,
    dividers?: boolean,
    title: string,
    onListItemCollapsed?: (section: AbstractListItemCollapsible<ModelType>, open: boolean) => void,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void,
}

interface AbstractListItemCollapsible_Props_Sealed<ModelType>
{
    content: (items: Array<ModelType>) => Array<JSX.Element>
}

type Props<ModelType> = AbstractListItemCollapsible_Props_Sealed<ModelType> & AbstractListItemCollapsible_Props_Virtual<ModelType>;

interface State<ModelType>
{
    items: Array<ModelType>,
    open: boolean,
    dividers: boolean,
    title: string
}

export default class AbstractListItemCollapsible<ModelType> extends Component<Props<ModelType>, State<ModelType>>
{ 
    constructor(props: Props<ModelType>)
    {
        super(props);

        this.state = {
            items: this.props.items,
            open: this.props.open || false,
            dividers: this.props.dividers || true,
            title: this.props.title
        }
    }

    componentWillReceiveProps = (props: Props<ModelType>) => 
    {  
        this.setState({items: props.items});
    }

    onListItemSelected = () => () =>
    {
        this.setState({open: !this.state.open}, () => 
        {
            if(this.props.onListItemCollapsed)
            {   this.props.onListItemCollapsed(this, this.state.open);}
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
                            <Icon size={30} name={this.state.open ? "expand-more" : "chevron-left"} />
                        </TouchableRipple>
                    </View>
                </TouchableRipple>
                {this.state.dividers && <Divider />}
                {this.state.open && this.props.content(this.state.items)}
            </View>
        );
    }
}