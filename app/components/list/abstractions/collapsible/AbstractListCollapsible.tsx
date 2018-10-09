import React, {Component} from "react";
import AbstractListItemCollapsible from "./AbstractListItemCollapsible";
import { View, FlatList } from "react-native";
import ActionOption from "../../../../dtos/options/ActionOption";

export interface AbstractListCollapsible_Props_Virtual<ModelType, SectionType>
{
    sections: Array<SectionType>,
    containerHasFab?: boolean, 
    onListItemCollapsed: (section: AbstractListItemCollapsible<ModelType>, open: boolean) => void,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void,
}

interface AbstractListCollapsible_Props_Sealed<ModelType, SectionType>
{
    getListItemFor: (section: SectionType, item: ModelType, index: number) => JSX.Element,
}

type Props<ModelType, SectionType> = AbstractListCollapsible_Props_Virtual<ModelType, SectionType> & AbstractListCollapsible_Props_Sealed<ModelType, SectionType> & 
{
   
};

interface State<SectionType>
{    
    sections: Array<SectionType>,
    containerHasFab: boolean
}

export type AbstractListCollapsible_SectionType <ModelType> = 
{
    items: Array<ModelType>,
    open?: boolean,
    dividers?: boolean,
    title: string,
}

export default class AbstractListCollapsible<ModelType, SectionType extends AbstractListCollapsible_SectionType<ModelType>> extends Component<Props<ModelType, SectionType>, State<SectionType>>
{
    constructor(props: Props<ModelType, SectionType>)
    {
        super(props);

        this.state = 
        {
            sections: this.props.sections,
            containerHasFab: this.props.containerHasFab || false
        }
    }

    getListSectionFor = (section: SectionType, _: number) => 
    {
        return (
            <AbstractListItemCollapsible {...this.props} {...section} content={() => this.getListItemsForSection(section)} />
        );
    } 

    getListItemsForSection = (section: SectionType): Array<JSX.Element> =>
    {   return section.items.map((item, index) => this.props.getListItemFor(section, item, index));}
 
    componentWillReceiveProps = (props: Props<ModelType, SectionType>) => 
    {   this.setState({sections: props.sections, containerHasFab: props.containerHasFab || false});}
    
    getItemKey = (section: SectionType, _: number) =>
    {   return section.title;}

    
    getListFooterComponent = () =>
    {
        if(this.state.containerHasFab)
        {   return <View key={9999999} style={{height:88}}></View>}

        return null;
    }

    render()  
    {
        return (
            <FlatList data={this.state.sections} keyExtractor={this.getItemKey} renderItem={(data: any) => this.getListSectionFor(data.item, data.index)} ListFooterComponent={this.getListFooterComponent()} />
        );
    }
}