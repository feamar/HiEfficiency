import React, {Component} from "react";
import AbstractListItemCollapsible, { AbstractListItemCollapsiblePropsVirtual } from "./AbstractListItemCollapsible";
import { View, FlatList } from "react-native";

export interface AbstractListCollapsiblePropsVirtual<SectionType>
{
    sections: Array<SectionType>,
    containerHasFab?: boolean,
}

interface AbstractListCollapsiblePropsSealed<ModelType, SectionType>
{
    getListItemFor: (section: SectionType, item: ModelType, index: number) => JSX.Element,
}

type Props<ModelType, SectionType> = AbstractListCollapsiblePropsVirtual<SectionType> & AbstractListCollapsiblePropsSealed<ModelType, SectionType>;

interface State<SectionType>
{    
    sections: Array<SectionType>,
    containerHasFab: boolean
}

export default class AbstractListCollapsible<ModelType, SectionType extends AbstractListItemCollapsiblePropsVirtual<ModelType>> extends Component<Props<ModelType, SectionType>, State<SectionType>>
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
            <AbstractListItemCollapsible {...section} content={() => this.getListItemsForSection(section)} />
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