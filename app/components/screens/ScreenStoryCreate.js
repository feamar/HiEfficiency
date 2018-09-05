import React, {Component} from "react";
import {View, ScrollView, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import PreferenceCategory from "../preferences/PreferenceCategory";
import PreferenceText from "../preferences/fields/PreferenceText";
import PreferenceSelectSpinner from "../preferences/fields/PreferenceSelectSpinner";
import StoryType from "../../enums/StoryType";
import FirebaseAdapter from "../firebase/FirebaseAdapter";

import { FABGroup, Snackbar } from 'react-native-paper';
import UtilityScreen from "../../utilities/UtilityScreen";

const styles = {
    scrollView:{
        height: "100%"
    }
}

export const MODE_CREATE = "create";
export const MODE_EDIT = "edit";

class ScreenStoryCreate extends Component
{
    static displayName = "Story Details Information";

    constructor(props)
    {
        super(props);
  
        var story = {
            upvotes: 0,
            startedOn: null,
            finishedOn: null
        }

        const existingStory = props.navigation.getParam("story");
        this.mode = MODE_CREATE;
        if(existingStory) 
        {
            story = existingStory.data();
            this.mode = MODE_EDIT;
        }

        this.fields = {};
        this.unsubscribers = []
        this.state =
        {
            story: story,
            shouldFabGroupRender: false
        }
    }

    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

    onValueChanged = (field) => (value) =>
    {
        const story = this.state.story;
        story[field] = value;
        this.setState({story: story});
    }

    onValueValidation = (field) => (value) =>
    {
        switch(field)
        {
            case "points":
                if(value % 1 != 0)
                {   return "Please enter an integer value.";}
            break;
        }

        return undefined;
    }

    onFabPress = () =>
    {
        var valid = true;
        const keys = Object.keys(this.fields);
        var story = {};

        for(var i = 0 ; i < keys.length ; i++)
        {
            const key = keys[i];
            const field = this.fields[key];

            if(field.validate() == false)
            {   valid = false;}
        }   

        console.log(JSON.stringify(JSON.decycle()));
        if(valid) 
        {
            var self = this;
            var team = this.props.navigation.getParam("team");

            switch(this.mode)
            { 
                case MODE_CREATE:
                    FirebaseAdapter.getStories(team.id).add(this.state.story).then(() => 
                    {
                        ToastAndroid.show("Story successfully created!", ToastAndroid.LONG);
                        this.props.navigation.goBack();
                    })
                    .catch(error => 
                    {
                        ToastAndroid.show("Something went wrong while saving, please try again.", ToastAndroid.LONG);
                    });
                    break;

                case MODE_EDIT:
                    this.props.navigation.getParam("story").ref.update(this.state.story).then(() => 
                    {
                        ToastAndroid.show("Story successfully updated!", ToastAndroid.LONG);
                    })
                    .catch(error => 
                    {
                        ToastAndroid.show("Something went wrong while saving, please try again.", ToastAndroid.LONG);
                    });;
                    break;
            }
        }
    }

    getStoryTypeOptions = () =>
    {   return StoryType.Values.map(type => {return {value: type.name, storageValue: type.id}});}

    render()
    { 
        return ( 
            <View> 
                {this.state.shouldFabGroupRender && <FABGroup icon="save" color="white" open={false} onPress={this.onFabPress} actions={[]} onStateChange={(open) => {} } />}
                <ScrollView style={styles.scrollView}>
                    <PreferenceCategory title="Mandatory">
                        <PreferenceText required ref={c => this.fields.name = c} title="Name" storageValue={this.state.story.name} onValueChanged={this.onValueChanged("name")} />
                        <PreferenceText ref={c => this.fields.description = c} title="Description" storageValue={this.state.story.description} onValueChanged={this.onValueChanged("description")} multiline={true} numberOfLines={5} />
                        <PreferenceSelectSpinner required ref={c => this.fields.type = c} title="Story Type" storageValue={this.state.story.type} onValueChanged={this.onValueChanged("type")} options={this.getStoryTypeOptions()} getDisplayValueFromItem={storageValue => { return StoryType.fromId(storageValue).name}}/> 
                    </PreferenceCategory>
                    <PreferenceCategory title="Optional">
                        <PreferenceText ref={c => this.fields.points = c} title="Story Points" storageValue={this.state.story.points} onValueChanged={this.onValueChanged("points")} onValueValidation={this.onValueValidation("points")} />
                    </PreferenceCategory>
                </ScrollView>
            </View> 
        );
    }
} 

export default UtilityScreen.withFloatingActionButton(ScreenStoryCreate);